const DEFAULT_SITE_NAME = "Wheels & Wheels";
const DEFAULT_LOCALE = "en_PK";
const TITLE_INTENT_SUFFIXES = [
  "Sizes and Current Rates",
  "Brands and Current Rates",
  "Size Guide",
  "Current Rate Guide",
];

function conciseTitle(value, siteName) {
  let base = String(value || "Tyres and Alloy Rims in Lahore").trim();
  const brandedSuffix = ` | ${siteName}`;
  if (base.endsWith(brandedSuffix)) base = base.slice(0, -brandedSuffix.length);
  for (const suffix of TITLE_INTENT_SUFFIXES) {
    const intentSuffix = ` | ${suffix}`;
    if (base.endsWith(intentSuffix)) base = base.slice(0, -intentSuffix.length);
  }
  if (base.toLowerCase().includes(siteName.toLowerCase())) return base;
  const branded = `${base} | ${siteName}`;
  return branded.length <= 65 ? branded : base;
}
const DEFAULT_IMAGE = "/wheelpic.jpg";

const KNOWN_IMAGE_METADATA = {
  "/wheelpic.jpg": { width: 894, height: 894, type: "image/jpeg" },
  "/tyre.jpg": { width: 612, height: 612, type: "image/jpeg" },
  "/Rim1.jpg": { width: 1280, height: 852, type: "image/jpeg" },
};

function getSiteUrl(explicitUrl) {
  const configured = explicitUrl || import.meta.env.VITE_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
}

function absoluteUrl(value, siteUrl) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (!siteUrl) return value;
  return `${siteUrl}${value.startsWith("/") ? value : `/${value}`}`;
}

function jsonForScript(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function inferImageType(value = "") {
  const pathname = String(value).split(/[?#]/, 1)[0].toLowerCase();
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".webp")) return "image/webp";
  if (pathname.endsWith(".avif")) return "image/avif";
  if (pathname.endsWith(".gif")) return "image/gif";
  if (pathname.endsWith(".svg")) return "image/svg+xml";
  return "image/jpeg";
}

function knownImageMetadata(value = "") {
  let pathname = value;
  try {
    pathname = new URL(value, "https://schema.invalid").pathname;
  } catch {
    // The input can still be a valid root-relative asset path.
  }
  const known = KNOWN_IMAGE_METADATA[pathname];
  if (known) return known;
  if (/^\/images\/guides\//.test(pathname)) {
    return {
      width: pathname.includes("-960.") ? 960 : 1600,
      height: pathname.includes("-960.") ? 540 : 900,
      type: inferImageType(pathname),
    };
  }
  return { type: inferImageType(pathname) };
}

function normalizeFaq(faq = []) {
  return faq
    .map((item) => ({
      question: item?.question || item?.q || item?.title || "",
      answer: item?.answer || item?.a || item?.body || "",
    }))
    .filter((item) => item.question && item.answer);
}

function breadcrumbSchema(items, siteUrl, canonical) {
  if (!Array.isArray(items) || items.length < 2) return null;
  const entries = items
    .map((item, index) => {
      const name = item?.name || item?.label || item?.title;
      const target = absoluteUrl(item?.url || item?.path || item?.href, siteUrl);
      if (!name || !target) return null;
      return {
        "@type": "ListItem",
        position: index + 1,
        name,
        item: target,
      };
    })
    .filter(Boolean);
  if (entries.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(canonical ? { "@id": `${canonical}#breadcrumb` } : {}),
    itemListElement: entries,
  };
}

function faqSchema(faq) {
  const entries = normalizeFaq(faq);
  if (!entries.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function articleSchema(article, context) {
  if (!article) return null;
  const headline = article.headline || context.title;
  if (!headline) return null;
  const image = article.image || context.image;
  const author = article.author || "Wheels & Wheels team";
  return {
    "@context": "https://schema.org",
    "@type": article.type || "Article",
    headline,
    description: article.description || context.description,
    image: image ? [absoluteUrl(image, context.siteUrl)] : undefined,
    datePublished: article.datePublished || article.publishedAt || undefined,
    dateModified:
      article.dateModified || article.updatedAt || article.datePublished || undefined,
    author: {
      "@type": article.authorType || "Organization",
      name: typeof author === "string" ? author : author.name,
      url:
        typeof author === "object"
          ? absoluteUrl(author.url, context.siteUrl) || undefined
          : undefined,
    },
    publisher: {
      "@id": `${context.siteUrl}/#business`,
    },
    mainEntityOfPage: context.canonical || undefined,
  };
}

function siteGraph(context) {
  if (!context.siteUrl || !context.canonical) return null;
  const businessId = `${context.siteUrl}/#business`;
  const websiteId = `${context.siteUrl}/#website`;
  const webpageId = `${context.canonical}#webpage`;
  const logoUrl = absoluteUrl(
    "/wheels-and-wheels-logo-600.png",
    context.siteUrl,
  );
  const imageId = context.imageUrl
    ? `${context.canonical}#primaryimage`
    : undefined;
  const business = {
    "@type": "AutomotiveBusiness",
    "@id": businessId,
    name: context.siteName,
    url: context.siteUrl,
    logo: {
      "@type": "ImageObject",
      "@id": `${context.siteUrl}/#logo`,
      url: logoUrl,
      contentUrl: logoUrl,
      width: 600,
      height: 203,
    },
    image: { "@id": `${context.siteUrl}/#logo` },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61580828295960",
      "https://www.instagram.com/wheelsandwheels_/",
    ],
    telephone: ["+923214229594", "+923390045836"],
    email: "wheelsandwheelsinfo@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Old Tyre Market, near Rawali Cinema and Railway Station, Aslam Khan Road",
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
    areaServed: { "@type": "City", name: "Lahore" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "12:00",
      closes: "21:00",
    },
  };
  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: `${context.siteUrl}/`,
    name: context.siteName,
    inLanguage: "en-PK",
    publisher: { "@id": businessId },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${context.siteUrl}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  const webpage = {
    "@type": "WebPage",
    "@id": webpageId,
    url: context.canonical,
    name: context.title,
    description: context.description || undefined,
    inLanguage: "en-PK",
    isPartOf: { "@id": websiteId },
    about: { "@id": businessId },
    publisher: { "@id": businessId },
    primaryImageOfPage: imageId ? { "@id": imageId } : undefined,
    image: imageId ? { "@id": imageId } : undefined,
    breadcrumb: context.hasBreadcrumbs
      ? { "@id": `${context.canonical}#breadcrumb` }
      : undefined,
  };
  const primaryImage = imageId
    ? {
        "@type": "ImageObject",
        "@id": imageId,
        url: context.imageUrl,
        contentUrl: context.imageUrl,
        caption: context.imageAlt,
        width: context.imageWidth || undefined,
        height: context.imageHeight || undefined,
      }
    : null;
  return {
    "@context": "https://schema.org",
    "@graph": [business, website, webpage, primaryImage].filter(Boolean),
  };
}

/**
 * React 19 hoists title, meta and link elements rendered by a component into
 * the document head. JSON-LD remains valid in the rendered page body as well,
 * which keeps this component compatible with both the current SPA and a future
 * pre-rendered/SSR setup.
 */
export default function SeoHead({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  imageAlt,
  imageWidth,
  imageHeight,
  imageType,
  type = "website",
  locale = DEFAULT_LOCALE,
  siteName = DEFAULT_SITE_NAME,
  siteUrl: explicitSiteUrl,
  noIndex = false,
  breadcrumbs = [],
  faq = [],
  article,
  schemas = [],
}) {
  const siteUrl = getSiteUrl(explicitSiteUrl);
  const fullTitle = conciseTitle(title, siteName);
  const canonicalUrl = absoluteUrl(canonical, siteUrl);
  const imageUrl = absoluteUrl(image, siteUrl);
  const inferredImage = knownImageMetadata(image);
  const resolvedImageAlt =
    imageAlt || `${title || "Tyres and alloy rims in Lahore"} | ${siteName}`;
  const resolvedImageWidth = imageWidth || inferredImage.width;
  const resolvedImageHeight = imageHeight || inferredImage.height;
  const resolvedImageType = imageType || inferredImage.type;
  const context = {
    title: fullTitle,
    description,
    image,
    imageUrl,
    imageAlt: resolvedImageAlt,
    imageWidth: resolvedImageWidth,
    imageHeight: resolvedImageHeight,
    canonical: canonicalUrl,
    siteUrl,
    siteName,
    hasBreadcrumbs: Array.isArray(breadcrumbs) && breadcrumbs.length >= 2,
  };
  const structuredData = [
    siteGraph(context),
    breadcrumbSchema(breadcrumbs, siteUrl, canonicalUrl),
    faqSchema(faq),
    articleSchema(article, context),
    ...(Array.isArray(schemas) ? schemas : [schemas]),
  ].filter(Boolean);

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta
        name="robots"
        content={
          noIndex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {imageUrl && <meta property="og:image:alt" content={resolvedImageAlt} />}
      {resolvedImageWidth && (
        <meta property="og:image:width" content={String(resolvedImageWidth)} />
      )}
      {resolvedImageHeight && (
        <meta property="og:image:height" content={String(resolvedImageHeight)} />
      )}
      {imageUrl && resolvedImageType && (
        <meta property="og:image:type" content={resolvedImageType} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {imageUrl && <meta name="twitter:image:alt" content={resolvedImageAlt} />}
      {article?.datePublished && (
        <meta property="article:published_time" content={article.datePublished} />
      )}
      {article?.dateModified && (
        <meta property="article:modified_time" content={article.dateModified} />
      )}
      {structuredData.map((schema, index) => (
        <script
          key={`${schema["@type"] || "schema"}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonForScript(schema) }}
        />
      ))}
    </>
  );
}
