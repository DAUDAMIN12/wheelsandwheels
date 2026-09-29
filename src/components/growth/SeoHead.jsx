const DEFAULT_SITE_NAME = "Wheels & Wheels";
const DEFAULT_LOCALE = "en_PK";

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

function normalizeFaq(faq = []) {
  return faq
    .map((item) => ({
      question: item?.question || item?.q || item?.title || "",
      answer: item?.answer || item?.a || item?.body || "",
    }))
    .filter((item) => item.question && item.answer);
}

function breadcrumbSchema(items, siteUrl) {
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
      "@type": "Organization",
      name: context.siteName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/wheels-and-wheels-logo-600.png", context.siteUrl),
      },
    },
    mainEntityOfPage: context.canonical || undefined,
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
  image = "/wheelpic.jpg",
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
  const fullTitle = title?.includes(siteName)
    ? title
    : `${title || "Tyres and Alloy Rims in Lahore"} | ${siteName}`;
  const canonicalUrl = absoluteUrl(canonical, siteUrl);
  const imageUrl = absoluteUrl(image, siteUrl);
  const context = {
    title: fullTitle,
    description,
    image,
    canonical: canonicalUrl,
    siteUrl,
    siteName,
  };
  const structuredData = [
    breadcrumbSchema(breadcrumbs, siteUrl),
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
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
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
