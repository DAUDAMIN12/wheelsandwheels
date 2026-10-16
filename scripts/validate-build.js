import { access, readFile } from "node:fs/promises";
import path from "node:path";
import {
  GUIDE_TOPICS,
  GUIDES,
  SEO_BRANDS,
  SEO_VEHICLES,
  SEO_SIZES,
  TYRE_RIM_HUBS,
} from "../src/Data/seoContent.js";
import { TYRE_RATES_PAGE, VEHICLE_MAKE_PAGES } from "../src/Data/marketPages.js";
import TYRE_SIZE_MANIFEST from "../src/Data/tyreSizeManifest.js";
import PRODUCTS from "../src/Data/productsData.js";

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
const sizePathFor = (item) => item.path || `/tyre-sizes/${item.slug}`;
const hasSizeEvidence = (item) =>
  (item.vehicleReferences?.length || 0) > 0 ||
  (item.catalogueReferences?.length || 0) > 0;
const evidenceBackedSizes = SEO_SIZES.filter(hasSizeEvidence);
const unsupportedSizes = SEO_SIZES.filter((item) => !hasSizeEvidence(item));
const vehiclePathFor = (item) => item.path || `/vehicles/${item.slug}`;
const indexableVehicles = SEO_VEHICLES.filter((item) => !item.noIndex);
const researchVehicles = SEO_VEHICLES.filter((item) => item.noIndex);
const indexableMakePages = Object.values(VEHICLE_MAKE_PAGES).filter((page) =>
  indexableVehicles.some((vehicle) => vehicle.make === page.make),
);
const requiredHierarchyPaths = [
  TYRE_RATES_PAGE.route,
  ...indexableMakePages.map((item) => item.route),
  ...indexableVehicles.map(vehiclePathFor),
  "/privacy",
  ...evidenceBackedSizes.map(sizePathFor),
  ...TYRE_RIM_HUBS.filter((item) => !item.noIndex).map((item) => item.path),
  ...GUIDES.map((item) => item.path || `/guides/${item.slug}`),
  ...GUIDE_TOPICS.map((item) => item.path),
];
const manifestSizePaths = new Set(TYRE_SIZE_MANIFEST.map((item) => item.path));
const generatedSizePaths = new Set(SEO_SIZES.map(sizePathFor));
const requiredRimDiameters = Array.from({ length: 13 }, (_, index) => index + 12);
const manifestSizeCodes = new Set(TYRE_SIZE_MANIFEST.map((item) => item.size));

assert(SEO_VEHICLES.length >= 100, "Pakistan vehicle directory contains too few model guides");
assert(SEO_BRANDS.length >= 20, "Tyre brand directory contains too few useful brand guides");
assert(GUIDES.length >= 20, "Long-form tyre and wheel guide library is too small");
assert(
  new Set(GUIDES.map((item) => item.slug)).size === GUIDES.length,
  "Duplicate guide slugs found",
);
assert(
  new Set(GUIDES.map((item) => item.image).filter(Boolean)).size === GUIDES.filter((item) => item.image).length,
  "Guide cover images must not be repeated",
);
for (const guide of GUIDES) {
  assert(Boolean(guide.imageAlt?.trim()), `Guide image is missing useful alt text: ${guide.slug}`);
  assert((guide.sources?.length || 0) > 0, `Guide has no primary references: ${guide.slug}`);
  for (const source of guide.sources || []) {
    assert(/^https:\/\//.test(source.url || ""), `Guide source must use HTTPS: ${guide.slug}`);
    assert(Boolean(source.title && source.publisher), `Guide source is incomplete: ${guide.slug}`);
  }
  for (const [field, asset] of [["image", guide.image], ["imageSmall", guide.imageSmall]]) {
    assert(Boolean(asset), `Guide is missing ${field}: ${guide.slug}`);
    if (!asset) continue;
    assert(asset.startsWith("/"), `Guide ${field} must use a root-relative asset: ${guide.slug}`);
    const assetPath = asset.split(/[?#]/, 1)[0].replace(/^\/+/, "");
    assert(await exists(path.join(dist, assetPath)), `Missing guide ${field} asset: ${guide.slug} -> ${asset}`);
  }
}
assert(
  new Set(SEO_VEHICLES.map((item) => item.slug)).size === SEO_VEHICLES.length,
  "Duplicate vehicle slugs found",
);
assert(
  new Set(Object.keys(VEHICLE_MAKE_PAGES)).size >= 25,
  "Vehicle make directory contains too few manufacturer hubs",
);
Object.values(VEHICLE_MAKE_PAGES).forEach((page) => {
  assert(
    SEO_VEHICLES.some((vehicle) => vehicle.make === page.make),
    `Vehicle make hub has no model guides: ${page.route}`,
  );
});
SEO_VEHICLES.forEach((vehicle) => {
  assert(Boolean(VEHICLE_MAKE_PAGES[vehicle.makeSlug]), `Missing make hub for ${vehicle.slug}`);
  assert(Boolean(vehicle.summary && vehicle.summary.length >= 100), `Vehicle summary is too thin: ${vehicle.slug}`);
  if (!vehicle.noIndex) {
    assert((vehicle.sources?.length || 0) > 0, `New indexable vehicle lacks source evidence: ${vehicle.slug}`);
  }
  vehicle.sources.forEach((source) => {
    assert(/^https:\/\//.test(source.url || ""), `Vehicle source must use HTTPS: ${vehicle.slug}`);
  });
  vehicle.commonSizes.forEach((fitment) => {
    const match = fitment.size.match(/^(\d{3})\s*\/\s*(\d{2})\s*R\s*(\d{2})$/i);
    if (!match) {
      assert(
        /^\d{3}(?:\/\d{2})?\s*R\d{2}(?:\.\d)?(?:C|LT)?(?:\s+\d{2,3}(?:\/\d{2,3})?[A-Z])?$/i.test(fitment.size),
        `Vehicle fitment is neither a standard nor supported specialist tyre code: ${vehicle.slug} -> ${fitment.size}`,
      );
      return;
    }
    const normalized = `${match[1]}/${match[2]} R${match[3]}`;
    assert(manifestSizeCodes.has(normalized), `Vehicle size is absent from manifest: ${vehicle.slug} -> ${fitment.size}`);
  });
});

assert(locations.length >= 50, "The sitemap contains too few indexable pages");
assert(new Set(locations).size === locations.length, "Duplicate sitemap URLs found");
assert(
  manifestSizePaths.size === generatedSizePaths.size &&
    [...manifestSizePaths].every((item) => generatedSizePaths.has(item)),
  "Generated tyre-size pages do not exactly match the supported size manifest",
);
assert(evidenceBackedSizes.length > 0, "No evidence-backed exact tyre-size pages found");
SEO_SIZES.forEach((item) => {
  const sizePath = sizePathFor(item);
  const shouldNoIndex = !hasSizeEvidence(item);
  assert(
    Boolean(item.noIndex) === shouldNoIndex,
    `Tyre-size indexability does not match evidence: ${sizePath}`,
  );
  assert(
    shouldNoIndex ? !sitemapPaths.has(sizePath) : sitemapPaths.has(sizePath),
    shouldNoIndex
      ? `Unsupported exact tyre-size page leaked into sitemap: ${sizePath}`
      : `Evidence-backed exact tyre-size page missing from sitemap: ${sizePath}`,
  );
});
requiredRimDiameters.forEach((rim) => {
  const hub = TYRE_RIM_HUBS.find((item) => item.rim === rim);
  assert(
    hub?.noIndex
      ? !sitemapPaths.has(`/tyre-sizes/${rim}-inch`)
      : sitemapPaths.has(`/tyre-sizes/${rim}-inch`),
    `Incorrect sitemap state for ${rim}-inch tyre hub`,
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
const internalLinkSources = new Map();
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
    'property="og:site_name"',
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
    if (!internalLinkSources.has(normalized)) internalLinkSources.set(normalized, new Set());
    internalLinkSources.get(normalized).add(url.pathname);
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

for (const [route, sources] of internalLinkSources) {
  const relative = decodeURIComponent(route).replace(/^\/+|\/+$/g, "");
  const candidates = route === "/"
    ? [path.join(dist, "index.html")]
    : [path.join(dist, relative, "index.html"), path.join(dist, `${relative}.html`)];
  const hasStaticTarget = (await Promise.all(candidates.map(exists))).some(Boolean);
  assert(
    hasStaticTarget,
    `Broken internal link ${route} from ${[...sources].slice(0, 3).join(", ")}`,
  );
}

requiredHierarchyPaths.forEach((requiredPath) => {
  assert(
    (inboundLinks.get(requiredPath)?.size || 0) > 0,
    `Hierarchy page has no crawlable inbound link: ${requiredPath}`,
  );
});

for (const item of SEO_SIZES) {
  const route = sizePathFor(item);
  const relative = route.replace(/^\/+|\/+$/g, "");
  const file = path.join(dist, relative, "index.html");
  assert(await exists(file), `Missing accessible exact tyre-size page: ${route}`);
  if (!(await exists(file))) continue;
  const html = await read(file);
  assert(/<h1[\s>]/i.test(html), `Exact tyre-size page is missing an H1: ${route}`);
  if (!hasSizeEvidence(item)) {
    assert(
      /<meta name="robots" content="[^"]*noindex/i.test(html),
      `Unsupported exact tyre-size page must be noindex: ${route}`,
    );
  }
}

for (const vehicle of SEO_VEHICLES) {
  const route = vehiclePathFor(vehicle);
  const relative = route.replace(/^\/+|\/+$/g, "");
  const file = path.join(dist, relative, "index.html");
  assert(await exists(file), `Missing accessible vehicle page: ${route}`);
  if (!(await exists(file))) continue;
  const html = await read(file);
  const isNoIndex = /<meta name="robots" content="[^"]*noindex/i.test(html);
  assert(isNoIndex === Boolean(vehicle.noIndex), `Vehicle indexability mismatch: ${route}`);
  assert(
    vehicle.noIndex ? !sitemapPaths.has(route) : sitemapPaths.has(route),
    vehicle.noIndex
      ? `Research-only vehicle leaked into sitemap: ${route}`
      : `Indexable vehicle missing from sitemap: ${route}`,
  );
}

for (const hub of TYRE_RIM_HUBS) {
  const relative = hub.path.replace(/^\/+|\/+$/g, "");
  const file = path.join(dist, relative, "index.html");
  assert(await exists(file), `Missing tyre-diameter hub: ${hub.path}`);
  if (!(await exists(file))) continue;
  const html = await read(file);
  const isNoIndex = /<meta name="robots" content="[^"]*noindex/i.test(html);
  assert(isNoIndex === Boolean(hub.noIndex), `Tyre-diameter hub indexability mismatch: ${hub.path}`);
  assert(
    hub.noIndex ? !sitemapPaths.has(hub.path) : sitemapPaths.has(hub.path),
    `Tyre-diameter hub sitemap mismatch: ${hub.path}`,
  );
}

for (const product of PRODUCTS.filter((item) => item.slug)) {
  const route = `/product/${product.slug}`;
  const file = path.join(dist, "product", product.slug, "index.html");
  assert(await exists(file), `Missing accessible catalogue page: ${route}`);
  if (!(await exists(file))) continue;
  const html = await read(file);
  assert(/<meta name="robots" content="[^"]*noindex/i.test(html), `Representative catalogue page must be noindex: ${route}`);
  assert(!sitemapPaths.has(route), `Representative catalogue page leaked into sitemap: ${route}`);
}

assert(
  !(await exists(path.join(dist, "product-fallback.html"))),
  "Obsolete product soft-404 fallback must not be generated",
);

for (const page of Object.values(VEHICLE_MAKE_PAGES)) {
  const relative = page.route.replace(/^\/+|\/+$/g, "");
  const file = path.join(dist, relative, "index.html");
  assert(await exists(file), `Missing accessible vehicle make page: ${page.route}`);
}

for (const relative of ["404.html", "admin/index.html", "quote/index.html"]) {
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
  console.log(
    `Validated ${locations.length} unique indexable routes, ${SEO_VEHICLES.length} vehicle guides (${researchVehicles.length} research-only), ${evidenceBackedSizes.length} evidence-backed exact sizes and ${unsupportedSizes.length} accessible noindex size routes.`,
  );
}
