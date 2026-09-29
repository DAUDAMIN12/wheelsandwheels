import { Link, useParams } from "react-router-dom";
import { FaCheck, FaChevronRight, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import * as seoContent from "../../Data/seoContent.js";
import SeoHead from "./SeoHead.jsx";

const WHATSAPP = "923390045836";

const COLLECTION_KEYS = {
  brand: ["SEO_BRANDS", "BRAND_PAGES", "brandPages", "brands"],
  vehicle: ["SEO_VEHICLES", "VEHICLE_PAGES", "vehiclePages", "vehicles"],
  size: ["SEO_SIZES", "SIZE_PAGES", "sizePages", "sizes"],
};

const VARIANT_LABELS = {
  brand: "Tyres by brand",
  vehicle: "Tyres by vehicle",
  size: "Tyres by size",
};

const VARIANT_ROOTS = {
  brand: "/brands",
  vehicle: "/vehicles",
  size: "/tyre-sizes",
};

function slugify(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function asCollection(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).map(([key, item]) =>
    typeof item === "object" && item
      ? { slug: item.slug || key, ...item }
      : { slug: key, name: String(item) },
  );
}

function contentRoots() {
  return [seoContent, seoContent.default].filter(Boolean);
}

function getCollection(variant) {
  const keys = COLLECTION_KEYS[variant] || [];
  for (const root of contentRoots()) {
    for (const key of keys) {
      const found = asCollection(root?.[key]);
      if (found.length) return found;
    }
  }
  return [];
}

function findLanding(variant, requestedSlug) {
  const normalized = slugify(requestedSlug);
  if (typeof seoContent.getSeoLanding === "function") {
    const direct = seoContent.getSeoLanding(variant, normalized);
    if (direct) return direct;
  }
  const helperName = `get${variant[0].toUpperCase()}${variant.slice(1)}`;
  if (typeof seoContent[helperName] === "function") {
    const direct = seoContent[helperName](normalized);
    if (direct) return direct;
  }
  return getCollection(variant).find((item) => {
    const candidates = [item.slug, item.id, item.name, item.title, item.size];
    return candidates.some((candidate) => slugify(candidate) === normalized);
  });
}

function stringList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
}

function itemText(item) {
  if (typeof item === "string") return item;
  return item?.description || item?.text || item?.body || "";
}

function normalizeFaq(items = []) {
  return stringList(items)
    .map((item) => ({
      q: item?.q || item?.question || item?.title || "",
      a: item?.a || item?.answer || item?.body || "",
    }))
    .filter((item) => item.q && item.a);
}

function landingPath(variant, content, slug) {
  return content.path || content.url || `${VARIANT_ROOTS[variant]}/${slug}`;
}

function displayName(content, fallback) {
  return (
    content.name ||
    content.label ||
    content.size ||
    content.vehicle ||
    [content.make, content.model].filter(Boolean).join(" ") ||
    fallback
  );
}

function SectionBlock({ section, index }) {
  const heading = section.heading || section.title;
  const paragraphs = stringList(
    section.paragraphs || section.body || section.content || section.description,
  );
  const items = stringList(section.items || section.bullets || section.points);
  const headingId = `landing-section-${index}-${slugify(heading || "details")}`;
  return (
    <section className="growth-copy-section" aria-labelledby={headingId}>
      {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
      {heading && <h2 id={headingId}>{heading}</h2>}
      {paragraphs.map((paragraph, paragraphIndex) => (
        <p key={`${headingId}-p-${paragraphIndex}`}>{itemText(paragraph)}</p>
      ))}
      {!!items.length && (
        <ul className="growth-check-list">
          {items.map((item, itemIndex) => (
            <li key={`${headingId}-item-${itemIndex}`}>
              <FaCheck aria-hidden="true" />
              <span>
                {typeof item === "object" && (item.title || item.name) && (
                  <strong>{item.title || item.name}: </strong>
                )}
                {itemText(item) || item.title || item.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function RelatedLinks({ items, variant }) {
  const links = stringList(items);
  if (!links.length) return null;
  return (
    <section className="growth-related section" aria-labelledby="related-pages-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">KEEP EXPLORING</p>
          <h2 id="related-pages-title">Useful next steps</h2>
        </div>
      </div>
      <div className="growth-link-grid">
        {links.map((item, index) => {
          const label = typeof item === "string" ? item : item.label || item.name || item.title;
          const itemSlug = typeof item === "string" ? slugify(item) : item.slug || slugify(label);
          const href =
            typeof item === "object" && (item.path || item.url || item.href)
              ? item.path || item.url || item.href
              : `${VARIANT_ROOTS[variant]}/${itemSlug}`;
          return (
            <Link key={`${href}-${index}`} to={href} className="growth-link-card">
              <span>{label}</span>
              <FaChevronRight aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function SeoLandingPage({ variant = "brand", slug: slugProp, content: contentProp }) {
  const params = useParams();
  const requestedSlug =
    slugProp || params.slug || params.brand || params.vehicle || params.model || params.size || "";
  const normalizedSlug = slugify(requestedSlug);
  const content = contentProp || findLanding(variant, normalizedSlug);

  if (!content) {
    return (
      <main className="growth-page growth-not-found">
        <SeoHead
          title="Tyre guide not found"
          description="Browse tyre brands, sizes and vehicle fitment help from Wheels & Wheels Lahore."
          noIndex
        />
        <section className="section">
          <p className="eyebrow">FITMENT HELP</p>
          <h1>We could not find that tyre guide.</h1>
          <p>Browse all tyre options or ask our team to check your exact vehicle and size.</p>
          <div className="growth-actions">
            <Link className="primary" to="/tyres">Explore tyres</Link>
            <a className="growth-whatsapp-button" href={`https://wa.me/${WHATSAPP}`}>
              <FaWhatsapp aria-hidden="true" /> Ask on WhatsApp
            </a>
          </div>
        </section>
      </main>
    );
  }

  const name =
    variant === "size" && content.size
      ? content.size
      : displayName(content, requestedSlug);
  const path = landingPath(variant, content, normalizedSlug || slugify(name));
  const h1 =
    content.heroTitle || content.h1 || content.heading || content.title || `${name} tyres in Pakistan`;
  const description =
    content.metaDescription ||
    content.seoDescription ||
    content.description ||
    `Explore ${name} tyre options, current availability and expert fitment help from Wheels & Wheels Lahore.`;
  const intro = content.intro || content.lede || content.summary || description;
  const supplementalSections = [];
  if (content.buyingAdvice) {
    supplementalSections.push({
      eyebrow: "BUYING ADVICE",
      heading: `Choosing ${name} options`,
      bullets: stringList(content.buyingAdvice),
    });
  }
  if (variant === "brand" && content.modelExamples?.length) {
    supplementalSections.push({
      eyebrow: "COMMONLY REQUESTED",
      heading: `${name} model families`,
      body: "Model names and available sizes vary by shipment. Ask us to verify the exact pattern and manufacturing details before buying.",
      bullets: content.modelExamples,
    });
  }
  if (variant === "brand" && content.exampleFamilies?.length) {
    supplementalSections.push({
      eyebrow: "COMMONLY REQUESTED",
      heading: `${name} tyre families`,
      body: "Pattern names, sizes and manufacturing details vary by shipment. Confirm the exact tyre before purchase.",
      bullets: content.exampleFamilies,
    });
  }
  if (content.buyerChecks?.length) {
    supplementalSections.push({
      eyebrow: "BEFORE YOU BUY",
      heading: "Checks worth making",
      bullets: content.buyerChecks,
    });
  }
  if (content.shoppingChecklist?.length) {
    supplementalSections.push({
      eyebrow: "BEFORE YOU BUY",
      heading: `How to compare ${name}`,
      bullets: content.shoppingChecklist,
    });
  }
  const sections = [
    ...stringList(content.sections || content.contentSections),
    ...supplementalSections,
  ];
  const variantHighlights =
    variant === "brand"
      ? [
          content.marketPosition && {
            title: "Market position",
            description: content.marketPosition,
          },
          content.brandOrigin && {
            title: "Brand background",
            description: content.brandOrigin,
          },
          ...stringList(content.knownFor),
        ].filter(Boolean)
      : variant === "vehicle"
        ? [
            content.yearScope && {
              title: "Model scope",
              description: content.yearScope,
            },
            ...(content.commonSizes || []).map((entry) =>
              typeof entry === "string"
                ? entry
                : {
                    title: entry.size,
                    description:
                      [entry.context, entry.note].filter(Boolean).join(" ") ||
                      "Verify against the model year, variant and current tyre sidewall.",
                  },
            ),
          ].filter(Boolean)
        : [
            content.width && {
              title: "Size code",
              description: `${content.width} mm nominal width, ${content.aspectRatio} profile and ${content.rim}-inch wheel diameter. Load and speed ratings still need verification.`,
            },
            ...(content.commonApplications || []).map((entry) =>
              typeof entry === "string"
                ? entry
                : {
                    title: entry.application || entry.name,
                    description:
                      entry.note || "Vehicle, model year, trim and placard must be checked.",
                  },
            ),
          ].filter(Boolean);
  const highlights = stringList(
    content.highlights || content.quickFacts || content.benefits || variantHighlights,
  );
  const faq = normalizeFaq(content.faq || content.faqs);
  const related =
    content.relatedLinks ||
    content.related ||
    content.relatedPages ||
    content.relatedBrands ||
    content.relatedSizes;
  const leadSubject = content.leadSubject || `${name} tyre options`;
  const leadMessage =
    content.whatsappMessage ||
    `Hi Wheels & Wheels, please share the current rate, availability and safe fitment options for ${leadSubject}. My vehicle is: `;
  const quoteUrl = `/quote?message=${encodeURIComponent(`Please quote ${leadSubject}.`)}`;
  const breadcrumbs = content.breadcrumbs || [
    { name: "Home", path: "/" },
    { name: "Tyres", path: "/tyres" },
    { name: VARIANT_LABELS[variant] || "Tyre guide", path: VARIANT_ROOTS[variant] },
    { name, path },
  ];

  return (
    <main className={`growth-page seo-landing seo-landing--${variant}`}>
      <SeoHead
        title={content.metaTitle || content.seoTitle || h1}
        description={description}
        canonical={path}
        image={content.ogImage || content.image || "/tyre.jpg"}
        breadcrumbs={breadcrumbs}
        faq={faq}
      />

      <nav className="growth-breadcrumbs breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {breadcrumbs.map((item, index) => (
            <li key={`${item.path || item.url}-${index}`}>
              {index === breadcrumbs.length - 1 ? (
                <span aria-current="page">{item.name || item.label}</span>
              ) : (
                <Link to={item.path || item.url || item.href}>{item.name || item.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <header className="growth-hero">
        <div className="growth-hero-copy">
          <p className="eyebrow">{content.eyebrow || VARIANT_LABELS[variant]}</p>
          <h1>{h1}</h1>
          <p className="growth-lede">{intro}</p>
          <div className="growth-actions" aria-label="Contact Wheels & Wheels">
            <a
              className="growth-whatsapp-button primary"
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(leadMessage)}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp aria-hidden="true" /> WhatsApp for current rate
            </a>
            <a className="growth-call-button" href="tel:+923214229594">
              <FaPhoneAlt aria-hidden="true" /> Call 0321 4229594
            </a>
            <Link className="growth-quote-link" to={quoteUrl}>
              Send details online <FaChevronRight aria-hidden="true" />
            </Link>
          </div>
          <p className="growth-assurance">
            Current market rate · Availability checked · Vehicle fitment confirmed
          </p>
        </div>
        {content.image && (
          <figure className="growth-hero-media">
            <img
              src={content.image}
              alt={content.imageAlt || `${name} tyre options at Wheels & Wheels`}
              fetchPriority="high"
            />
            {content.imageCaption && <figcaption>{content.imageCaption}</figcaption>}
          </figure>
        )}
      </header>

      {(content.verificationNote || content.availabilityNote) && (
        <aside className="growth-verification-note section" aria-label="Important fitment information">
          <FaCheck aria-hidden="true" />
          <p>{content.verificationNote || content.availabilityNote}</p>
        </aside>
      )}

      {!!highlights.length && (
        <section className="growth-highlights section" aria-labelledby="landing-highlights-title">
          <p className="eyebrow">WHAT TO KNOW</p>
          <h2 id="landing-highlights-title">A quick fitment overview</h2>
          <div className="growth-highlight-grid">
            {highlights.map((item, index) => (
              <article key={`highlight-${index}`}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {typeof item === "object" && (item.title || item.name) && (
                  <h3>{item.title || item.name}</h3>
                )}
                <p>{itemText(item) || item.title || item.name}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="growth-article-body section">
        {sections.map((section, index) => (
          <SectionBlock
            key={section.slug || section.heading || section.title || index}
            section={typeof section === "string" ? { body: section } : section}
            index={index}
          />
        ))}
      </div>

      {!!faq.length && (
        <section className="growth-faq section" aria-labelledby="landing-faq-title">
          <p className="eyebrow">STRAIGHT ANSWERS</p>
          <h2 id="landing-faq-title">Frequently asked questions</h2>
          <div className="growth-faq-list">
            {faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <RelatedLinks items={related} variant={variant} />

      <aside className="growth-lead-banner" aria-labelledby="landing-lead-title">
        <div>
          <p className="eyebrow">NEED THE CURRENT RATE?</p>
          <h2 id="landing-lead-title">Let our Lahore team check it for you.</h2>
          <p>Share your vehicle, full tyre size and preferred brand for an accurate reply.</p>
        </div>
        <a
          className="primary"
          href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(leadMessage)}`}
          target="_blank"
          rel="noreferrer"
        >
          <FaWhatsapp aria-hidden="true" /> Ask on official WhatsApp
        </a>
      </aside>
    </main>
  );
}

export function BrandLandingPage(props) {
  return <SeoLandingPage {...props} variant="brand" />;
}

export function VehicleLandingPage(props) {
  return <SeoLandingPage {...props} variant="vehicle" />;
}

export function SizeLandingPage(props) {
  return <SeoLandingPage {...props} variant="size" />;
}
