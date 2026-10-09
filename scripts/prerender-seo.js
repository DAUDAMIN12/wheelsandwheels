import "dotenv/config";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  GUIDE_TOPICS,
  GUIDES,
  SEO_BRANDS,
  SEO_CONTENT_UPDATED,
  SEO_SIZES,
  SEO_VEHICLES,
  TYRE_RIM_HUBS,
} from "../src/Data/seoContent.js";
import { COMMERCIAL_PAGES } from "../src/Data/commercialPages.js";
import { TYRE_RATES_PAGE, VEHICLE_MAKE_PAGES } from "../src/Data/marketPages.js";
import PRODUCTS from "../src/Data/productsData.js";
import { SERVICES } from "../src/Data/services.js";
import { render } from "../dist-ssr/entry-server.js";

const root = process.cwd();
const dist = path.join(root, "dist");
const template = await readFile(path.join(dist, "index.html"), "utf8");
const deploymentHost =
  process.env.VITE_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  "https://wheelsandwheels.vercel.app";
const siteUrl = /^https?:\/\//.test(deploymentHost)
  ? deploymentHost.replace(/\/$/, "")
  : `${deploymentHost.startsWith("localhost") ? "http" : "https"}://${deploymentHost.replace(/\/$/, "")}`;

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const titleIntentSuffixes = [
  "Sizes and Current Rates",
  "Brands and Current Rates",
  "Size Guide",
  "Current Rate Guide",
];
const stripSiteName = (title = "") => {
  let base = String(title || "Tyres and Alloy Rims in Lahore").trim();
  const brandedSuffix = " | Wheels & Wheels";
  if (base.endsWith(brandedSuffix)) base = base.slice(0, -brandedSuffix.length);
  for (const suffix of titleIntentSuffixes) {
    const intentSuffix = ` | ${suffix}`;
    if (base.endsWith(intentSuffix)) base = base.slice(0, -intentSuffix.length);
  }
  if (base.toLowerCase().includes("wheels & wheels")) return base;
  const branded = `${base}${brandedSuffix}`;
  return branded.length <= 65 ? branded : base;
};

const staticPages = [
  {
    route: "/",
    title: "Tyres and Alloy Rims in Lahore | Wheels & Wheels",
    description:
      "Find premium, Japanese and Chinese tyres plus 12–24 inch alloy rims in Lahore. Search by tyre size, vehicle or brand and ask for current rates and verified fitment.",
    h1: "Tyres and alloy rims in Lahore",
    intro: "Search by complete tyre size, vehicle or brand, then ask Wheels & Wheels for current market availability and verified fitment.",
  },
  {
    route: "/tyres",
    title: "Find Tyres by Size, Brand or Vehicle",
    description: "Find tyre options by size, brand or vehicle with fitment help from Wheels & Wheels Lahore.",
    h1: "Find the right tyres for your car",
    intro: "Browse useful tyre references, then verify the exact size, load rating, speed rating and vehicle specification before purchase.",
  },
  {
    route: TYRE_RATES_PAGE.route,
    title: TYRE_RATES_PAGE.title,
    description: TYRE_RATES_PAGE.metaDescription,
    h1: TYRE_RATES_PAGE.heroTitle,
    intro: TYRE_RATES_PAGE.lede,
    updatedAt: TYRE_RATES_PAGE.updatedAt,
  },
  { route: "/brands", title: "Tyre Brands in Lahore", description: "Compare premium, Japanese and Chinese tyre brands available on request in Lahore.", h1: "Compare tyre brands in Lahore", intro: "Understand brand positioning and ask for options in your exact tyre size." },
  { route: "/vehicles", title: "Find Tyres by Vehicle in Pakistan", description: "Browse common tyre-size references for popular cars in Pakistan and request final fitment verification.", h1: "Find tyres by vehicle", intro: "Choose a make and model, then confirm model year, trim, placard and existing sidewall size." },
  { route: "/tyre-sizes", title: "Popular Tyre Sizes in Lahore", description: "Browse popular tyre sizes from 12 to 24 inches and request current brand options in Lahore.", h1: "Browse tyres by complete size", intro: "Use width, profile and rim diameter together for a useful tyre search." },
  { route: "/guides", title: "Tyre Blog and Guides for Pakistan Roads", description: "Practical tyre-size, safety, maintenance and alloy-rim articles for drivers in Lahore and Pakistan.", h1: "Tyre blog and practical guides", intro: "Clear, useful articles designed to help you ask better questions before buying." },
  {
    route: "/about",
    title: "About Wheels & Wheels Lahore",
    description: "Learn how Wheels & Wheels helps Lahore customers enquire about tyres, alloy rims, installation, balancing and alignment through direct, current-rate support.",
    h1: "Direct advice for tyres, rims and wheel care",
    intro: "Wheels & Wheels is based in Lahore's Old Tyre Market. Explore options, understand fitment and contact the team for current rates and availability.",
    sections: [
      { title: "How the website works", text: "Share the vehicle, full tyre size, rim requirement or wheel service needed. The team then confirms the current rate and next step directly." },
      { title: "Lead-only service", text: "Online payment is not enabled. Customers continue by call, official WhatsApp or the quotation form." },
    ],
  },
  {
    route: "/contact",
    title: "Contact Wheels & Wheels Lahore",
    description: "Call Wheels & Wheels on 0321 4229594 or 0339 0045836, WhatsApp 0339 0045836, or visit Old Tyre Market near Rawali Cinema and Railway Station in Lahore.",
    h1: "Talk directly to Wheels & Wheels",
    intro: "Send the full tyre size or vehicle details so the team can understand the requirement before replying with current information.",
    sections: [
      { title: "Visit the shop", text: "Old Tyre Market, near Rawali Cinema and Railway Station, Aslam Khan Road, Lahore." },
      { title: "Opening hours", text: "Monday to Saturday, 12:00 PM to 9:00 PM. Sunday closed." },
    ],
    faqs: [
      { question: "Which number is the official website WhatsApp?", answer: "The official website WhatsApp number is 0339 0045836. Both 0321 4229594 and 0339 0045836 can receive calls." },
      { question: "Why does the website ask me to request the current rate?", answer: "The website is lead-only. Contact the team to confirm the current rate and availability for the exact tyre, rim or service required." },
    ],
  },
  {
    route: "/services",
    title: "Tyre Installation, Wheel Balancing and Alignment in Lahore",
    description: "Explore tyre installation, computerised wheel balancing and wheel alignment at Wheels & Wheels in Lahore. Contact the team for current service rates.",
    h1: "Installation, balancing and alignment",
    intro: "Choose the service you need, read what it covers and contact the team for the current rate and available time.",
    sections: SERVICES.map((service) => ({ title: service.title, text: service.summary })),
  },
  {
    route: "/lahore-tyre-shop",
    title: "Tyre and Alloy Rim Shop in Lahore",
    description: "Contact or visit Wheels & Wheels at Old Tyre Market near Rawali Cinema and Railway Station, Aslam Khan Road, Lahore, for current tyre, rim and wheel-service rates.",
    h1: "Your tyre and rim enquiry starts here",
    intro: "Call or message before visiting to ask for the current rate and availability for tyres, alloy rims or wheel services in Lahore.",
    sections: [
      { title: "Location", text: "Old Tyre Market, near Rawali Cinema and Railway Station, Aslam Khan Road, Lahore." },
      { title: "Contact", text: "Call 0321 4229594 or 0339 0045836. Official WhatsApp: 0339 0045836." },
    ],
  },
  {
    route: "/faq",
    title: "Wheels & Wheels Frequently Asked Questions",
    description: "Answers about Wheels & Wheels Lahore contact numbers, official WhatsApp, location, opening hours, current rates and wheel services.",
    h1: "Frequently asked questions",
    intro: "Verified contact, location, opening-hours and service information for Wheels & Wheels Lahore.",
    faqs: [
      { question: "Where is Wheels & Wheels located?", answer: "Wheels & Wheels is in Old Tyre Market, near Rawali Cinema and Railway Station, on Aslam Khan Road in Lahore." },
      { question: "What are the opening hours?", answer: "The shop is open Monday to Saturday from 12:00 PM to 9:00 PM and is closed on Sunday." },
      { question: "Can I pay through the website?", answer: "No. The website currently collects enquiries and provides contact routes; it does not accept online payments." },
      { question: "How should I request a tyre rate?", answer: "Share the complete tyre size printed on the sidewall and your vehicle details by call, official WhatsApp or the online quotation form." },
    ],
  },
  {
    route: "/privacy",
    title: "Privacy and Website Data Use",
    description: "Learn what information Wheels & Wheels collects through tyre and rim enquiries, how contact-click measurement works, and how to request a data review.",
    h1: "Privacy and data use",
    intro: "How quotation details and limited website measurement are handled by Wheels & Wheels.",
    updatedAt: "2026-10-05",
  },
  {
    route: "/shop",
    title: "Browse Tyres and Alloy Rims in Lahore",
    description: "Browse tyre and alloy-rim options by category, brand and complete tyre size, then ask Wheels & Wheels Lahore for the current rate and verified fitment.",
    h1: "Browse tyres and alloy rims",
    intro: "Use the category and fitment filters to narrow the catalogue, then contact the team to confirm current availability, rate and vehicle compatibility.",
    sections: [
      { title: "Search by full tyre size", text: "Use width, profile and rim diameter together. Never choose a tyre by rim diameter alone." },
      { title: "Ask before purchase", text: "Pattern, manufacturing details, date code, stock, price and fitment are confirmed for the exact option offered." },
    ],
  },
  {
    route: "/quote",
    title: "Request a Current Tyre or Rim Rate",
    description: "Send your vehicle and tyre or rim requirement to Wheels & Wheels Lahore for a current-rate response and fitment confirmation.",
    h1: "Request a current rate",
    intro: "Share your contact details, vehicle and complete tyre or rim requirement. No online payment is collected through this website.",
    noIndex: true,
    excludeFromSitemap: true,
  },
  {
    route: "/admin",
    title: "Wheels & Wheels Administration",
    description: "Secure administration area for Wheels & Wheels staff.",
    h1: "Administration",
    intro: "Authorised Wheels & Wheels staff only.",
    noIndex: true,
    excludeFromSitemap: true,
  },
];

const brandPages = SEO_BRANDS.map((item) => ({
  route: `/brands/${item.slug}`,
  title: item.seoTitle || item.title,
  description: item.metaDescription || item.summary,
  h1: item.heroTitle || item.title,
  intro: item.summary,
  sections: [
    { title: "Known for", text: item.knownFor?.join(" · ") },
    { title: "Before buying", text: item.availabilityNote },
  ],
  faqs: item.faqs || [],
}));

const vehiclePages = SEO_VEHICLES.map((item) => ({
  route: `/vehicles/${item.slug}`,
  title: item.seoTitle || item.title,
  description: item.metaDescription || item.summary,
  h1: item.heroTitle || item.title,
  intro: item.summary,
  sections: [
    { title: "Model scope", text: item.yearScope },
    {
      title: "Common size references",
      text: item.commonSizes
        ?.map((entry) => `${entry.size}: ${entry.context || entry.note || "verify before purchase"}`)
        .join(" · "),
    },
  ],
  faqs: item.faqs || [],
}));

const vehicleMakePages = Object.values(VEHICLE_MAKE_PAGES).map((item) => ({
  route: item.route,
  title: item.title,
  description: item.metaDescription,
  h1: item.heroTitle,
  intro: item.intro,
  sections: [
    { title: "Fitment checks", text: item.buyerFocus.join(" · ") },
    {
      title: `${item.make} model guides`,
      text: SEO_VEHICLES.filter((vehicle) => vehicle.make === item.make)
        .map((vehicle) => vehicle.name)
        .join(" · "),
    },
  ],
  updatedAt: TYRE_RATES_PAGE.updatedAt,
}));

const sizePages = SEO_SIZES.map((item) => ({
  route: `/tyre-sizes/${item.slug}`,
  title: item.seoTitle || item.title,
  description: item.metaDescription || item.summary,
  h1: item.heroTitle || item.title,
  intro: item.summary,
  sections: [
    {
      title: "What the code means",
      text: `${item.width} mm nominal width, ${item.aspectRatio} profile and ${item.rim}-inch wheel diameter. Load and speed ratings must also be checked.`,
    },
    { title: "Fitment reminder", text: item.verificationNote },
  ],
  faqs: item.faqs || [],
  noIndex: Boolean(item.noIndex),
  excludeFromSitemap: Boolean(item.noIndex),
  updatedAt: SEO_CONTENT_UPDATED,
}));

const rimHubPages = TYRE_RIM_HUBS.map((item) => ({
  route: item.path,
  title: item.seoTitle || item.title,
  description: item.metaDescription || item.summary,
  h1: item.heroTitle || item.title,
  intro: item.summary,
  sections: item.sections?.map((section) => ({
    title: section.heading,
    text: [
      ...(section.paragraphs || []),
      ...(section.bullets || []),
    ].join(" "),
  })),
  faqs: item.faqs || [],
  noIndex: Boolean(item.noIndex),
  excludeFromSitemap: Boolean(item.noIndex),
  updatedAt: SEO_CONTENT_UPDATED,
}));

const guidePages = GUIDES.map((item) => ({
  route: `/guides/${item.slug}`,
  title: item.seoTitle || item.title,
  description: item.metaDescription || item.excerpt,
  h1: item.title,
  intro: item.excerpt,
  sections: item.sections?.map((section) => ({
    title: section.heading,
    text: [
      ...(section.paragraphs || []),
      ...(section.bullets || []),
    ].join(" "),
  })),
  faqs: item.faqs || [],
  article: true,
  image: item.image,
  publishedAt: item.publishedAt,
  updatedAt: item.updatedAt,
  author: item.author,
}));

const guideTopicPages = GUIDE_TOPICS.map((item) => ({
  route: item.path,
  title: item.seoTitle || item.title,
  description: item.description,
  h1: item.heroTitle || item.title,
  intro: item.intro,
  sections: item.guides.map((guideItem) => ({
    title: guideItem.title,
    text: guideItem.excerpt,
  })),
  faqs: [
    {
      question: `What is covered in ${item.name.toLowerCase()}?`,
      answer: item.description,
    },
    {
      question: "Does a guide confirm the correct tyre for my car?",
      answer: "No. Confirm the exact vehicle, complete size, ratings and wheel fitment before purchase.",
    },
  ],
  updatedAt: item.updatedAt || SEO_CONTENT_UPDATED,
}));

const commercialPages = COMMERCIAL_PAGES.map((item) => ({
  route: item.route,
  title: item.seoTitle || item.title,
  description: item.metaDescription,
  h1: item.title,
  intro: item.lede,
  image: item.image,
  sections: item.sections?.map((section) => ({
    title: section.heading,
    text: [
      ...(section.paragraphs || []),
      ...(section.bullets || []),
    ].join(" "),
  })),
  faqs: item.faqs || [],
  updatedAt: SEO_CONTENT_UPDATED,
  schemas: [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${siteUrl}${item.route}#collection`,
      name: item.title,
      description: item.metaDescription,
      url: `${siteUrl}${item.route}`,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Wheels & Wheels",
        url: siteUrl,
      },
    },
  ],
}));

const servicePages = SERVICES.map((item) => ({
  route: `/services/${item.slug}`,
  title: `${item.title} in Lahore`,
  description:
    item.metaDescription ||
    `${item.summary} Ask Wheels & Wheels Lahore for the current service rate and available time.`,
  h1: item.title,
  intro: item.tagline,
  sections: [
    { title: "What it is", text: item.summary },
    { title: "Why it matters", text: item.why },
    { title: "When to ask", text: item.recommended },
  ],
  faqs: item.faq || [],
  schemas: [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: item.title,
      description: item.summary,
      url: `${siteUrl}/services/${item.slug}`,
      provider: { "@id": `${siteUrl}/#business` },
      areaServed: { "@type": "City", name: "Lahore" },
    },
  ],
}));

const productPages = PRODUCTS.filter((item) => item.slug).map((item) => ({
  route: `/product/${item.slug}`,
  title: `${item.title} ${item.size} in Lahore`,
  description: `${item.description} Ask Wheels & Wheels Lahore for the current rate, availability and verified fitment for ${item.size}.`,
  h1: `${item.title} ${item.size}`,
  intro: item.description,
  sections: [
    { title: "Tyre specification", text: `${item.brand} · ${item.size} · ${item.vehicle}. Verify load index, speed rating, manufacturing details and vehicle compatibility before purchase.` },
    { title: "Current rate and availability", text: "Market pricing and stock can change. Contact Wheels & Wheels for the current quotation and exact item details." },
  ],
  schemas: [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${item.title} ${item.size}`,
      description: item.description,
      image: `${siteUrl}${(item.img || item.image || "/tyre.jpg").startsWith("/") ? (item.img || item.image || "/tyre.jpg") : `/${item.img || item.image}`}`,
      brand: { "@type": "Brand", name: item.brand },
      category: item.category,
      sku: item.slug,
      url: `${siteUrl}/product/${item.slug}`,
    },
  ],
}));

const pages = [
  ...staticPages,
  ...brandPages,
  ...vehicleMakePages,
  ...vehiclePages,
  ...rimHubPages,
  ...sizePages,
  ...commercialPages,
  ...guideTopicPages,
  ...guidePages,
  ...servicePages,
  ...productPages,
];

for (const page of pages) {
  const canonical = `${siteUrl}${page.route === "/" ? "/" : page.route}`;
  const title = stripSiteName(page.title);
  const socialImage = page.image
    ? `${siteUrl}${page.image.startsWith("/") ? page.image : `/${page.image}`}`
    : `${siteUrl}/wheelpic.jpg`;
  const socialImagePath = new URL(socialImage).pathname;
  const socialImageIsGuide = socialImagePath.startsWith("/images/guides/");
  const socialImageWidth = socialImageIsGuide
    ? socialImagePath.includes("-960.") ? 960 : 1600
    : socialImagePath === "/Rim1.jpg" ? 1280
      : socialImagePath === "/tyre.jpg" ? 612 : 894;
  const socialImageHeight = socialImageIsGuide
    ? socialImagePath.includes("-960.") ? 540 : 900
    : socialImagePath === "/Rim1.jpg" ? 852
      : socialImagePath === "/tyre.jpg" ? 612 : 894;
  const socialImageType = socialImagePath.endsWith(".webp")
    ? "image/webp"
    : socialImagePath.endsWith(".png") ? "image/png" : "image/jpeg";
  const socialImageAlt = `${page.h1} | Wheels & Wheels`;
  const renderedContent = await render(page.route, { siteUrl });
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(page.description)}" />`,
    )
    .replace(
      /<meta name="robots" content="[^"]*"\s*\/?>/i,
      `<meta name="robots" content="${page.noIndex ? "noindex, nofollow, noarchive" : "index, follow, max-image-preview:large"}" />`,
    )
    .replace(
      /<meta property="og:type" content="[^"]*"\s*\/?>/i,
      `<meta property="og:type" content="${page.article ? "article" : "website"}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    )
    .replace(
      /<meta property="og:image" content="[^"]*"\s*\/?>/i,
      `<meta property="og:image" content="${socialImage}" />`,
    )
    .replace(
      /<meta property="og:image:alt" content="[^"]*"\s*\/?>/i,
      `<meta property="og:image:alt" content="${escapeHtml(socialImageAlt)}" />`,
    )
    .replace(
      /<meta property="og:image:width" content="[^"]*"\s*\/?>/i,
      `<meta property="og:image:width" content="${socialImageWidth}" />`,
    )
    .replace(
      /<meta property="og:image:height" content="[^"]*"\s*\/?>/i,
      `<meta property="og:image:height" content="${socialImageHeight}" />`,
    )
    .replace(
      /<meta property="og:image:type" content="[^"]*"\s*\/?>/i,
      `<meta property="og:image:type" content="${socialImageType}" />`,
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
    )
    .replace(
      /<meta name="twitter:image" content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:image" content="${socialImage}" />`,
    )
    .replace(
      /<meta name="twitter:image:alt" content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:image:alt" content="${escapeHtml(socialImageAlt)}" />`,
    )
    .replace(
      "</head>",
      `<link rel="canonical" href="${canonical}" /><meta property="og:url" content="${canonical}" />${page.article && page.publishedAt ? `<meta property="article:published_time" content="${page.publishedAt}" />` : ""}${page.article && page.updatedAt ? `<meta property="article:modified_time" content="${page.updatedAt}" />` : ""}</head>`,
    )
    .replace('<div id="root"></div>', `<div id="root">${renderedContent}</div>`);
  const target = page.route === "/" ? dist : path.join(dist, page.route.slice(1));
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, "index.html"), html, "utf8");
  if (page.route !== "/") {
    const cleanUrlFile = path.join(dist, `${page.route.slice(1)}.html`);
    await mkdir(path.dirname(cleanUrlFile), { recursive: true });
    await writeFile(cleanUrlFile, html, "utf8");
  }
}

const notFoundTitle = "Page Not Found | Wheels & Wheels";
const notFoundDescription =
  "The requested Wheels & Wheels page could not be found. Browse tyres, alloy rims and practical fitment guides or contact our Lahore team.";
const notFoundContent = await render("/__not-found__", { siteUrl });
const notFoundHtml = template
  .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(notFoundTitle)}</title>`)
  .replace(
    /<meta name="description" content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(notFoundDescription)}" />`,
  )
  .replace(
    /<meta name="robots" content="[^"]*"\s*\/?>/i,
    '<meta name="robots" content="noindex, nofollow, noarchive" />',
  )
  .replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(notFoundTitle)}" />`,
  )
  .replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(notFoundDescription)}" />`,
  )
  .replace(
    '<div id="root"></div>',
    `<div id="root">${notFoundContent}</div>`,
  );
await writeFile(path.join(dist, "404.html"), notFoundHtml, "utf8");

const productFallbackContent = await render("/product/__catalogue-lookup__", {
  siteUrl,
});
const productFallbackHtml = template
  .replace(
    /<title>[\s\S]*?<\/title>/i,
    "<title>Checking Product | Wheels &amp; Wheels</title>",
  )
  .replace(
    /<meta name="description" content="[^"]*"\s*\/?>/i,
    '<meta name="description" content="Checking the requested Wheels &amp; Wheels catalogue item." />',
  )
  .replace(
    /<meta name="robots" content="[^"]*"\s*\/?>/i,
    '<meta name="robots" content="noindex, follow" />',
  )
  .replace(
    '<div id="root"></div>',
    `<div id="root">${productFallbackContent}</div>`,
  );
await writeFile(
  path.join(dist, "product-fallback.html"),
  productFallbackHtml,
  "utf8",
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
  .filter((page) => !page.excludeFromSitemap)
  .map(
    (page) =>
      `  <url><loc>${siteUrl}${page.route === "/" ? "/" : page.route}</loc><lastmod>${page.updatedAt || SEO_CONTENT_UPDATED}</lastmod></url>`,
  )
  .join("\n")}\n</urlset>\n`;
await writeFile(path.join(dist, "sitemap.xml"), sitemap, "utf8");
await writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
  "utf8",
);

console.log(
  `Prerendered ${pages.length} routes (${pages.filter((page) => !page.excludeFromSitemap).length} indexed) for ${siteUrl}`,
);
