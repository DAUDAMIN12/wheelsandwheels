import "dotenv/config";

const baseUrl = (process.argv[2] || "http://127.0.0.1:5000").replace(/\/$/, "");
const failures = [];
let checks = 0;

const check = (condition, message) => {
  checks += 1;
  if (!condition) failures.push(message);
};

const request = (path, options) => fetch(`${baseUrl}${path}`, options);
const readJson = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { nonJsonResponse: true };
  }
};

const pageChecks = [
  ["/", 200, false],
  ["/shop", 200, false],
  ["/brands/michelin", 200, false],
  ["/guides/how-to-choose-the-right-tyre-size-pakistan", 200, false],
  ["/product/future-catalogue-item", 200, true],
  ["/not-a-real-route", 404, true],
  ["/admin", 200, true],
];

for (const [path, expectedStatus, shouldNoIndex] of pageChecks) {
  const response = await request(path);
  const html = await response.text();
  check(response.status === expectedStatus, `${path} returned ${response.status}, expected ${expectedStatus}`);
  check(/<title>.+<\/title>/s.test(html), `${path} is missing a title`);
  check(/<h1[\s>]/i.test(html), `${path} is missing pre-rendered H1 content`);
  check((/noindex/i.test(html)) === shouldNoIndex, `${path} has an incorrect indexation directive`);
}

const health = await request("/api/health");
const healthBody = await readJson(health);
check(health.status === 200, `Health endpoint returned ${health.status}`);
check(healthBody.database === "connected", "Health endpoint reports a disconnected database");

const catalogue = await request("/api/products", {
  headers: { Origin: baseUrl },
});
const products = await readJson(catalogue);
check(catalogue.status === 200, `Catalogue returned ${catalogue.status}`);
check(Array.isArray(products) && products.length > 0, "Catalogue returned no products");
check(catalogue.headers.get("access-control-allow-origin") === baseUrl, "Same-origin CORS response is incorrect");
const catalogueCachePolicy = [
  catalogue.headers.get("vercel-cdn-cache-control"),
  catalogue.headers.get("cache-control"),
]
  .filter(Boolean)
  .join(", ");
check(
  /s-maxage=|\bpublic\b/i.test(catalogueCachePolicy),
  "Catalogue is missing its public CDN cache policy",
);

const foreignOrigin = await request("/api/products", {
  headers: { Origin: "https://attacker.invalid" },
});
check(foreignOrigin.status === 403, `Foreign origin returned ${foreignOrigin.status}, expected 403`);

const unauthorized = await request("/api/admin/summary");
check(unauthorized.status === 401, `Unprotected admin summary returned ${unauthorized.status}`);

const unknownApi = await request("/api/not-real");
check(unknownApi.status === 404, `Unknown API route returned ${unknownApi.status}`);

const disabledOrder = await request("/api/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "{}",
});
check(disabledOrder.status === 410, `Disabled checkout returned ${disabledOrder.status}`);

const invalidRfq = await request("/api/inquiries", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "A" }),
});
check(invalidRfq.status === 400, `Invalid RFQ returned ${invalidRfq.status}`);

const honeypotRfq = await request("/api/inquiries", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ website: "bot-filled-this-field" }),
});
check(honeypotRfq.status === 202, `RFQ honeypot returned ${honeypotRfq.status}`);

if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  const login = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    }),
  });
  const loginBody = await readJson(login);
  check(login.status === 200, `Configured admin login returned ${login.status}`);
  check(Boolean(loginBody.token), "Configured admin login returned no token");
  if (loginBody.token) {
    const summary = await request("/api/admin/summary", {
      headers: { Authorization: `Bearer ${loginBody.token}` },
    });
    const summaryBody = await readJson(summary);
    check(summary.status === 200, `Authorized admin summary returned ${summary.status}`);
    check(typeof summaryBody.inquiries === "number", "Admin summary is missing RFQ totals");
    check(Array.isArray(summaryBody.inquiryStatuses), "Admin summary is missing the RFQ funnel");
  }
}

if (failures.length) {
  if (healthBody?.code)
    console.error(`API diagnostic: ${healthBody.code}`);
  failures.forEach((failure) => console.error(`FAIL: ${failure}`));
  console.error(`${failures.length} of ${checks} smoke checks failed.`);
  process.exitCode = 1;
} else {
  console.log(`Passed ${checks} production smoke checks against ${baseUrl}.`);
}
