import "dotenv/config";

const baseUrl = (process.argv[2] || "http://127.0.0.1:5000").replace(/\/$/, "");
const targetUrl = new URL(baseUrl);
const isLoopback = ["127.0.0.1", "localhost", "::1"].includes(
  targetUrl.hostname,
);
if (!isLoopback && targetUrl.protocol !== "https:")
  throw new Error("Remote smoke tests require an HTTPS target");
const failures = [];
let checks = 0;

const check = (condition, message) => {
  checks += 1;
  if (!condition) failures.push(message);
};

const request = (path, options = {}) =>
  fetch(`${baseUrl}${path}`, {
    ...options,
    signal: AbortSignal.timeout(15_000),
  });
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
  ["/shop?q=michelin", 200, false],
  ["/rims", 200, false],
  ["/tyre-prices-pakistan", 200, false],
  ["/vehicles", 200, false],
  ["/vehicles/suzuki", 200, false],
  ["/vehicles/toyota", 200, false],
  ["/vehicles/honda", 200, false],
  ["/vehicles/kia", 200, false],
  ["/vehicles/hyundai", 200, false],
  ["/vehicles/changan", 200, false],
  ["/vehicles/mg", 200, false],
  ["/vehicles/haval", 200, false],
  ["/vehicles/gwm", 200, true],
  ["/vehicles/omoda", 200, true],
  ["/vehicles/jaecoo", 200, true],
  ["/vehicles/honri", 200, true],
  ["/vehicles/peugeot", 200, false],
  ["/vehicles/isuzu", 200, false],
  ["/vehicles/daihatsu", 200, true],
  ["/vehicles/suzuki-fronx", 200, false],
  ["/vehicles/suzuki-every", 200, false],
  ["/vehicles/toyota-corolla-cross", 200, false],
  ["/vehicles/honda-hr-v", 200, false],
  ["/vehicles/kia-stonic", 200, false],
  ["/vehicles/hyundai-elantra", 200, false],
  ["/vehicles/changan-alsvin", 200, false],
  ["/vehicles/changan-m9-sherpa", 200, false],
  ["/vehicles/mg-hs", 200, false],
  ["/vehicles/mg-zs", 200, false],
  ["/vehicles/mg-zs-ev", 200, false],
  ["/vehicles/haval-h6", 200, false],
  ["/vehicles/gwm-tank-500", 200, true],
  ["/vehicles/omoda-7-shs-p", 200, true],
  ["/vehicles/jaecoo-j7-shs-p", 200, true],
  ["/vehicles/proton-saga", 200, true],
  ["/vehicles/toyota-camry", 200, false],
  ["/vehicles/toyota-land-cruiser", 200, false],
  ["/vehicles/changan-karvaan", 200, false],
  ["/vehicles/jetour-dashing", 200, false],
  ["/privacy", 200, false],
  ["/brands/michelin", 200, false],
  ["/brands/nitto", 200, false],
  ["/brands/hankook", 200, false],
  ["/brands/gt-radial", 200, false],
  ["/tyre-sizes", 200, false],
  ...Array.from({ length: 13 }, (_, index) => [
    `/tyre-sizes/${index + 12}-inch`,
    200,
    index + 12 === 23,
  ]),
  ["/tyre-sizes/195-65-r15", 200, false],
  ["/tyre-sizes/285-45-r21", 200, false],
  ["/tyre-sizes/165-60-r15", 200, true],
  ["/tyre-sizes/315-35-r24", 200, true],
  ["/product/bridgestone-ecopia-ep300", 200, true],
  ["/guides/topics/tyre-size-and-fitment", 200, false],
  ["/guides/how-to-choose-the-right-tyre-size-pakistan", 200, false],
  ["/guides/tyre-load-index-speed-rating-guide-pakistan", 200, false],
  ["/guides/topics/alloy-rims-and-wheel-fitment", 200, false],
  ["/guides/how-to-read-tyre-date-code-pakistan", 200, false],
  ["/guides/alloy-wheel-pcd-offset-centre-bore-guide", 200, false],
  ["/tools", 200, false],
  ["/tools/tyre-size-calculator", 200, false],
  ["/tools/tyre-date-code-checker", 200, false],
  ["/product/future-catalogue-item", 404, true],
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

const forgedConversionEvent = await request("/api/events", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ eventType: "quote_submit", currentPath: "/quote" }),
});
check(
  forgedConversionEvent.status === 400,
  `Forged RFQ event returned ${forgedConversionEvent.status}, expected 400`,
);

if (isLoopback || process.env.SMOKE_MUTATION_TESTS === "true") {
  const adminMeasurementEvent = await request("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType: "call_click", currentPath: "/admin" }),
  });
  check(
    adminMeasurementEvent.status === 400,
    `Admin measurement event returned ${adminMeasurementEvent.status}, expected 400`,
  );
}

if (process.env.SMOKE_ADMIN_EMAIL && process.env.SMOKE_ADMIN_PASSWORD) {
  const login = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SMOKE_ADMIN_EMAIL,
      password: process.env.SMOKE_ADMIN_PASSWORD,
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
    check(typeof summaryBody.emailConfigured === "boolean", "Admin summary is missing email configuration health");
    check(typeof summaryBody.emailDeliveryIssues === "number", "Admin summary is missing email delivery issue totals");
    check(typeof summaryBody.leadAnalytics?.rfqSubmissions === "number", "Admin summary is missing trusted RFQ attribution totals");
    check(Array.isArray(summaryBody.leadAnalytics?.totals), "Admin summary is missing contact-click totals");
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
