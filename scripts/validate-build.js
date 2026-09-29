import { access, readFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const failures = [];

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const exists = async (file) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};

const read = (file) => readFile(file, "utf8");
const sitemap = await read(path.join(dist, "sitemap.xml"));
const robots = await read(path.join(dist, "robots.txt"));
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
);

assert(locations.length >= 50, "The sitemap contains too few indexable pages");
assert(new Set(locations).size === locations.length, "Duplicate sitemap URLs found");
assert(/Disallow:\s*\/admin/i.test(robots), "robots.txt must block /admin");
assert(/Disallow:\s*\/api\//i.test(robots), "robots.txt must block /api/");
assert(/Sitemap:\s*https?:\/\/[^\s]+\/sitemap\.xml/i.test(robots), "robots.txt is missing the absolute sitemap URL");

const seenTitles = new Map();
const seenCanonicals = new Map();

for (const location of locations) {
  const url = new URL(location);
  const relative = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, "");
  const file = path.join(dist, relative, "index.html");
  if (!(await exists(file))) {
    failures.push(`Missing pre-rendered file for ${location}`);
    continue;
  }
  const html = await read(file);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();
  const canonical = html.match(/<link rel="canonical" href="(.*?)"\s*\/>/s)?.[1];
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  assert(Boolean(title), `Missing title on ${url.pathname}`);
  assert(Boolean(canonical), `Missing canonical on ${url.pathname}`);
  assert(canonical === location, `Canonical mismatch on ${url.pathname}`);
  assert(/<h1[\s>]/i.test(html), `Missing visible H1 on ${url.pathname}`);
  assert(!/<meta name="robots" content="[^"]*noindex/i.test(html), `Indexed sitemap page is noindex: ${url.pathname}`);
  assert(schemas.length > 0, `Missing structured data on ${url.pathname}`);

  if (title) {
    const other = seenTitles.get(title);
    assert(!other, `Duplicate title on ${other} and ${url.pathname}`);
    seenTitles.set(title, url.pathname);
  }
  if (canonical) {
    const other = seenCanonicals.get(canonical);
    assert(!other, `Duplicate canonical on ${other} and ${url.pathname}`);
    seenCanonicals.set(canonical, url.pathname);
  }
  schemas.forEach((schema, index) => {
    try {
      JSON.parse(schema[1]);
    } catch {
      failures.push(`Invalid JSON-LD block ${index + 1} on ${url.pathname}`);
    }
  });
}

for (const relative of ["404.html", "product-fallback.html", "admin/index.html", "quote/index.html"]) {
  const file = path.join(dist, relative);
  assert(await exists(file), `Missing utility page: ${relative}`);
  if (await exists(file)) {
    const html = await read(file);
    assert(/<meta name="robots" content="[^"]*noindex/i.test(html), `${relative} must be noindex`);
  }
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL: ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Validated ${locations.length} unique indexable routes, their metadata and JSON-LD.`);
}
