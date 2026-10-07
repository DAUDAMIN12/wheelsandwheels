import { access, readFile } from "node:fs/promises";
import path from "node:path";
import {
  GUIDE_TOPICS,
  GUIDES,
  SEO_SIZES,
  TYRE_RIM_HUBS,
} from "../src/Data/seoContent.js";
import { TYRE_RATES_PAGE, VEHICLE_MAKE_PAGES } from "../src/Data/marketPages.js";
import TYRE_SIZE_MANIFEST from "../src/Data/tyreSizeManifest.js";

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
const sitemapPaths = new Set(locations.map((location) => new URL(location).pathname || "/"));
const requiredHierarchyPaths = [
  TYRE_RATES_PAGE.route,
  ...Object.values(VEHICLE_MAKE_PAGES).map((item) => item.route),
  "/privacy",
  ...SEO_SIZES.map((item) => item.path || `/tyre-sizes/${item.slug}`),
  ...TYRE_RIM_HUBS.filter((item) => !item.noIndex).map((item) => item.path),
  ...GUIDES.map((item) => item.path || `/guides/${item.slug}`),
  ...GUIDE_TOPICS.map((item) => item.path),
];
const manifestSizePaths = new Set(TYRE_SIZE_MANIFEST.map((item) => item.path));
const publishedSizePaths = new Set(SEO_SIZES.map((item) => item.path));
const requiredRimDiameters = Array.from({ length: 13 }, (_, index) => index + 12);

assert(locations.length >= 50, "The sitemap contains too few indexable pages");
assert(new Set(locations).size === locations.length, "Duplicate sitemap URLs found");
assert(
  manifestSizePaths.size === publishedSizePaths.size &&
    [...manifestSizePaths].every((item) => publishedSizePaths.has(item)),
  "Published tyre-size pages do not exactly match the supported size manifest",
);
requiredRimDiameters.forEach((rim) => {
  assert(
    sitemapPaths.has(`/tyre-sizes/${rim}-inch`),
    `Missing ${rim}-inch tyre hub from sitemap`,
  );
  assert(
    TYRE_SIZE_MANIFEST.some((item) => Number(item.rim) === rim),
    `Tyre-size manifest has no exact fitment for R${rim}`,
  );
});
requiredHierarchyPaths.forEach((requiredPath) => {
  assert(sitemapPaths.has(requiredPath), `Missing hierarchy URL from sitemap: ${requiredPath}`);
});
TYRE_RIM_HUBS.filter((item) => item.noIndex).forEach((item) => {
  assert(!sitemapPaths.has(item.path), `Noindex diameter hub leaked into sitemap: ${item.path}`);
});
assert(/Disallow:\s*\/admin/i.test(robots), "robots.txt must block /admin");
assert(/Disallow:\s*\/api\//i.test(robots), "robots.txt must block /api/");
assert(/Sitemap:\s*https?:\/\/[^\s]+\/sitemap\.xml/i.test(robots), "robots.txt is missing the absolute sitemap URL");

const seenTitles = new Map();
const seenCanonicals = new Map();
const inboundLinks = new Map();
const contentFingerprints = new Map();

const internalPageLinks = (html) => {
  const links = [...html.matchAll(/<a\b[^>]*\bhref=(?:"([^"]+)"|'([^']+)')[^>]*>/gi)]
    .map((match) => match[1] || match[2])
    .filter((href) => href.startsWith("/") && !href.startsWith("//"))
    .map((href) => href.split(/[?#]/, 1)[0] || "/")
    .filter(
      (href) =>
        !href.startsWith("/api/") &&
        !href.startsWith("/assets/") &&
        !/\.(?:avif|css|gif|ico|jpe?g|js|json|png|svg|webmanifest|webp|xml)$/i.test(href),
    );
  return new Set(links);
};

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

  assert(
    [...html.matchAll(/<link rel="canonical"/g)].length === 1,
    `Expected exactly one canonical tag on ${url.pathname}`,
  );
  assert(
    [...html.matchAll(/<meta name="description"/g)].length === 1,
    `Expected exactly one meta description on ${url.pathname}`,
  );
  for (const selector of [
    'property="og:title"',
    'property="og:description"',
    'property="og:image"',
    'property="og:url"',
    'name="twitter:title"',
    'name="twitter:description"',
    'name="twitter:image"',
  ]) {
    assert(
      [...html.matchAll(new RegExp(`<meta ${selector}`, "g"))].length === 1,
      `Expected exactly one ${selector} tag on ${url.pathname}`,
    );
  }

  assert(Boolean(title), `Missing title on ${url.pathname}`);
  assert(Boolean(canonical), `Missing canonical on ${url.pathname}`);
  assert(canonical === location, `Canonical mismatch on ${url.pathname}`);
  assert(/<h1[\s>]/i.test(html), `Missing visible H1 on ${url.pathname}`);
  assert(!/<meta name="robots" content="[^"]*noindex/i.test(html), `Indexed sitemap page is noindex: ${url.pathname}`);
  assert(schemas.length > 0, `Missing structured data on ${url.pathname}`);
  assert(
    /<header\b[^>]*\bclass=(?:"[^"]*\bsite-header\b[^"]*"|'[^']*\bsite-header\b[^']*')[^>]*>/i.test(html),
    `Missing the real site header on ${url.pathname}`,
  );
  assert(/<footer(?:\s|>)/i.test(html), `Missing footer on ${url.pathname}`);
  assert(
    !/\bseo-prerender\b/i.test(html),
    `Temporary SEO placeholder markup found on ${url.pathname}`,
  );
  const internalLinks = internalPageLinks(html);
  internalLinks.forEach((href) => {
    const normalized = href.length > 1 ? href.replace(/\/$/, "") : href;
    if (!inboundLinks.has(normalized)) inboundLinks.set(normalized, new Set());
    inboundLinks.get(normalized).add(url.pathname);
  });
  assert(
    internalLinks.size >= 5,
    `Too few meaningful internal page links on ${url.pathname}: found ${internalLinks.size}, expected at least 5`,
  );

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
  const schemaFingerprints = new Map();
  const schemaIdentity = new Map();
  let graphBlocks = 0;
  const graphTypes = new Set();
  schemas.forEach((schema, index) => {
    try {
      const parsed = JSON.parse(schema[1]);
      const fingerprint = JSON.stringify(parsed);
      const previousFingerprint = schemaFingerprints.get(fingerprint);
      assert(
        previousFingerprint === undefined,
        `Duplicate JSON-LD block ${previousFingerprint + 1} and ${index + 1} on ${url.pathname}`,
      );
      schemaFingerprints.set(fingerprint, index);
      const nodes = Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [parsed];
      if (Array.isArray(parsed?.["@graph"])) graphBlocks += 1;
      nodes.forEach((node) => {
        if (node?.["@type"]) graphTypes.add(node["@type"]);
        if (!node?.["@id"]) return;
        const identity = `${node["@type"] || "Thing"}|${node["@id"]}`;
        const previousIdentity = schemaIdentity.get(identity);
        assert(
          previousIdentity === undefined,
          `Duplicate JSON-LD identity ${identity} in blocks ${previousIdentity + 1} and ${index + 1} on ${url.pathname}`,
        );
        schemaIdentity.set(identity, index);
      });
      assert(
        !/"(?:url|contentUrl|item)"\s*:\s*"\//.test(fingerprint),
        `Relative URL found in JSON-LD on ${url.pathname}`,
      );
    } catch {
      failures.push(`Invalid JSON-LD block ${index + 1} on ${url.pathname}`);
    }
  });
  assert(graphBlocks === 1, `Expected one connected @graph on ${url.pathname}`);
  for (const schemaType of ["AutomotiveBusiness", "WebSite", "WebPage"]) {
    assert(graphTypes.has(schemaType), `Missing ${schemaType} graph node on ${url.pathname}`);
  }

  const mainText = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  if (mainText.length > 300) {
    const previousPath = contentFingerprints.get(mainText);
    assert(!previousPath, `Exact duplicate main content on ${previousPath} and ${url.pathname}`);
    contentFingerprints.set(mainText, url.pathname);
  }
}

requiredHierarchyPaths.forEach((requiredPath) => {
  assert(
    (inboundLinks.get(requiredPath)?.size || 0) > 0,
    `Hierarchy page has no crawlable inbound link: ${requiredPath}`,
  );
});

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
