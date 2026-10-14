import { Link, useParams } from "react-router-dom";
import { FaCheck, FaChevronRight, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import * as seoContent from "../../Data/seoContent.js";
import SeoHead from "./SeoHead.jsx";

const WHATSAPP = "923390045836";

const COLLECTION_KEYS = {
  brand: ["SEO_BRANDS", "BRAND_PAGES", "brandPages", "brands"],
  vehicle: ["SEO_VEHICLES", "VEHICLE_PAGES", "vehiclePages", "vehicles"],
  size: ["SEO_SIZES", "SIZE_PAGES", "sizePages", "sizes"],
  rim: ["TYRE_RIM_HUBS", "rimHubs"],
};

const VARIANT_LABELS = {
  brand: "Tyres by brand",
  vehicle: "Tyres by vehicle",
  size: "Tyres by size",
  rim: "Tyres by wheel diameter",
};

const VARIANT_ROOTS = {
  brand: "/brands",
  vehicle: "/vehicles",
  size: "/tyre-sizes",
  rim: "/tyre-sizes",
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

function descriptorText(value) {
  if (!value) return "";
  if (Array.isArray(value)) {
    return value.map(descriptorText).filter(Boolean).join(", ");
  }
  if (typeof value === "object") {
    return value.label || value.name || value.title || value.value || "";
  }
  return String(value);
}

function parseTyreSize(value = "") {
  const match = String(value).trim().match(/^(\d{3})\s*\/\s*(\d{2})\s*r\s*(\d{2})$/i);
  if (!match) return null;
  const [, width, profile, rim] = match;
  return {
    label: `${width}/${profile} R${rim}`,
    slug: `${width}-${profile}-r${rim}`,
  };
}

function relatedLinkDetails(item) {
  const label = typeof item === "string" ? item : item?.label || item?.name || item?.title;
  const href =
    typeof item === "object" && (item?.path || item?.url || item?.href)
      ? item.path || item.url || item.href
      : `/vehicles/${slugify(label)}`;
  return { href, label };
}

function isRelatedVehicleLink(item) {
  if (typeof item === "string") return Boolean(item.trim());
  const href = item?.path || item?.url || item?.href || "";
  return href.startsWith("/vehicles/");
}

function normalizeVehicleFitments(content) {
  const fitments = stringList(
    content.commonSizes || content.fitments || content.tyreSizes,
  );
  return fitments.map((item, index) => {
    const entry = typeof item === "string" ? { size: item } : item || {};
    const rawSize = entry.size || entry.tyreSize || entry.fitment || entry.label || "";
    return {
      ...entry,
      key: entry.id || entry.slug || `${rawSize}-${index}`,
      rawSize,
      parsedSize: parseTyreSize(rawSize),
      context: descriptorText(
        entry.context || entry.application || entry.description || entry.use,
      ),
      generation: descriptorText(entry.generation || entry.series || entry.shape),
      years: descriptorText(
        entry.yearRange || entry.modelYears || entry.years || entry.year,
      ),
      variants: descriptorText(
        entry.variants || entry.variant || entry.trims || entry.trim,
      ),
      note: descriptorText(entry.note || entry.verificationNote),
    };
  });
}

function sourceTitle(source, index) {
  if (typeof source === "string") return source;
  return source?.title || source?.label || source?.name || `Fitment source ${index + 1}`;
}

function sourceHref(source) {
  const candidate = typeof source === "string" ? source : source?.url || source?.href || "";
  return /^(?:https?:\/\/|\/)/i.test(candidate) ? candidate : "";
}

function sourceMeta(source) {
  if (!source || typeof source === "string") return "";
  return [
    source.publisher,
    source.document,
    source.page && `Page ${source.page}`,
    source.accessedAt && `Accessed ${source.accessedAt}`,
  ].filter(Boolean).join(" · ");
}

function VehicleRelatedModels({ items }) {
  const links = stringList(items).map(relatedLinkDetails).filter((item) => item.href && item.label);
  if (!links.length) return null;
  return (
    <section className="vehicle-related-models" aria-labelledby="vehicle-related-models-title">
      <p className="eyebrow">RELATED VEHICLE GUIDES</p>
      <h3 id="vehicle-related-models-title">Compare another model</h3>
      <div className="vehicle-related-model-grid">
        {links.map((item) => (
          <Link key={item.href} to={item.href}>
            <span>{item.label}</span>
            <FaChevronRight aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function VehicleFitmentDirectory({ content, name, quoteUrl, relatedModels }) {
  const fitments = normalizeVehicleFitments(content);
  const sources = [
    ...stringList(content.sources),
    ...stringList(content.source),
    ...fitments.flatMap((item) => [
      ...stringList(item.sources),
      ...stringList(item.source),
    ]),
  ].filter((source, index, items) => {
    const identity = `${sourceHref(source)}|${sourceTitle(source, index)}`;
    return items.findIndex(
      (candidate, candidateIndex) =>
        `${sourceHref(candidate)}|${sourceTitle(candidate, candidateIndex)}` === identity,
    ) === index;
  });
  const reviewedAt =
    content.reviewedAt ||
    content.lastReviewedAt ||
    content.lastReviewed ||
    content.verifiedAt ||
    content.updatedAt ||
    "";

  return (
    <section className="vehicle-fitment-directory section" aria-labelledby="vehicle-fitment-title">
      <div className="section-heading vehicle-fitment-heading">
        <div>
          <p className="eyebrow">MODEL-SPECIFIC SIZE REFERENCES</p>
          <h2 id="vehicle-fitment-title">Tyre sizes listed for {name}</h2>
        </div>
        <p>
          Start with the correct generation, model year and variant. Open an exact size guide,
          then verify the vehicle placard, owner&apos;s manual and fitted wheel before purchase.
        </p>
      </div>

      {fitments.length ? (
        <div className="vehicle-fitment-grid" role="list" aria-label={`${name} tyre size references`}>
          {fitments.map((fitment) => {
            const sizeLabel = fitment.parsedSize?.label || fitment.rawSize || "Size to verify";
            const years = fitment.years || descriptorText(content.yearScope);
            return (
              <article className="vehicle-fitment-card" role="listitem" key={fitment.key}>
                <div className="vehicle-fitment-card-head">
                  <p className="eyebrow">REFERENCE SIZE</p>
                  <h3>
                    {fitment.parsedSize ? (
                      <Link
                        to={`/tyre-sizes/${fitment.parsedSize.slug}`}
                        aria-label={`Open the ${fitment.parsedSize.label} tyre size guide for ${name}`}
                      >
                        {fitment.parsedSize.label}
                      </Link>
                    ) : (
                      <span>{sizeLabel}</span>
                    )}
                  </h3>
                  <span className="vehicle-fitment-status">Verify on vehicle</span>
                </div>

                <dl className="vehicle-fitment-details">
                  {fitment.context && (
                    <div><dt>Context</dt><dd>{fitment.context}</dd></div>
                  )}
                  {fitment.generation && (
                    <div><dt>Generation</dt><dd>{fitment.generation}</dd></div>
                  )}
                  {years && (
                    <div><dt>Year / scope</dt><dd>{years}</dd></div>
                  )}
                  {fitment.variants && (
                    <div><dt>Variant / trim</dt><dd>{fitment.variants}</dd></div>
                  )}
                </dl>

                <p className="vehicle-fitment-card-note">
                  {fitment.note ||
                    "Reference only. Confirm the complete sidewall code, load and speed rating for the exact car."}
                </p>

                {fitment.parsedSize ? (
                  <Link className="vehicle-fitment-size-link" to={`/tyre-sizes/${fitment.parsedSize.slug}`}>
                    Open {fitment.parsedSize.label} guide <FaChevronRight aria-hidden="true" />
                  </Link>
                ) : (
                  <Link className="vehicle-fitment-size-link" to={quoteUrl}>
                    Ask us to verify this size <FaChevronRight aria-hidden="true" />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="growth-sourcing-panel vehicle-fitment-empty">
          <div>
            <strong>No exact size should be assumed</strong>
            <p>Send the model year, variant and a sidewall or placard photo for a manual fitment check.</p>
          </div>
          <Link className="primary" to={quoteUrl}>Request fitment help</Link>
        </div>
      )}

      <aside className="vehicle-fitment-warning" aria-label="Important vehicle fitment warning">
        <FaCheck aria-hidden="true" />
        <div>
          <strong>Reference information is not automatic fitment approval.</strong>
          <p>
            Wheel package, import specification, model year, trim and previous modifications can
            change the correct tyre. Never buy from the model name or rim diameter alone.
          </p>
        </div>
      </aside>

      {(sources.length > 0 || reviewedAt) && (
        <aside className="vehicle-fitment-provenance" aria-labelledby="fitment-source-title">
          <div>
            <p className="eyebrow">SOURCE &amp; REVIEW DETAILS</p>
            <h3 id="fitment-source-title">How this reference is maintained</h3>
            {reviewedAt && (
              <p className="vehicle-fitment-reviewed">
                Last reviewed: <time dateTime={reviewedAt}>{reviewedAt}</time>
              </p>
            )}
          </div>
          {!!sources.length && (
            <ul>
              {sources.map((source, index) => {
                const title = sourceTitle(source, index);
                const href = sourceHref(source);
                const meta = sourceMeta(source);
                return (
                  <li key={`${href || title}-${index}`}>
                    {href ? (
                      <a href={href} target={/^https?:\/\//i.test(href) ? "_blank" : undefined} rel={/^https?:\/\//i.test(href) ? "noreferrer" : undefined}>
                        {title}
                      </a>
                    ) : (
                      <span>{title}</span>
                    )}
                    {meta && <small>{meta}</small>}
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      )}

      <VehicleRelatedModels items={relatedModels} />
    </section>
  );
}

function SizeEntityDirectory({ content, variant, name, quoteUrl }) {
  if (variant === "rim") {
    const sizes = stringList(content.sizes);
    if (!sizes.length) return null;
    return (
      <section className="growth-size-options section" aria-labelledby="rim-size-options-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXACT SIZE PAGES</p>
            <h2 id="rim-size-options-title">Choose the complete tyre size.</h2>
          </div>
          <p>Each page explains the full sidewall code and links only to references present in our current data.</p>
        </div>
        <div className="growth-size-option-grid">
          {sizes.map((item) => (
            <Link key={item.path} to={item.path}>
              <small>R{item.rim} DIRECTORY</small>
              <strong>{item.size}</strong>
              <span>Open fitment guide <FaChevronRight aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (variant !== "size") return null;
  const references = stringList(content.catalogueReferences);
  return (
    <section className="growth-catalogue-evidence section" aria-labelledby="size-catalogue-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">CURRENT CATALOGUE REFERENCES</p>
          <h2 id="size-catalogue-title">Options connected to {name}.</h2>
        </div>
        <p>These entries confirm catalogue coverage, not live stock or universal vehicle fitment. Ask for the exact current item before buying.</p>
      </div>
      {references.length ? (
        <div className="growth-catalogue-grid">
          {references.map((item) => (
            <article key={item.slug}>
              <Link className="growth-catalogue-image" to={`/product/${item.slug}`}>
                <img src={item.image || "/tyre.jpg"} alt={`${item.name} ${name}`} loading="lazy" decoding="async" />
              </Link>
              <div>
                <p className="eyebrow">{item.brand} · {name}</p>
                <h3><Link to={`/product/${item.slug}`}>{item.name}</Link></h3>
                <p>{item.vehicle || "Vehicle fitment confirmed before supply"}</p>
                <Link className="guide-read-link" to={`/product/${item.slug}`}>
                  View specification <FaChevronRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="growth-sourcing-panel">
          <div>
            <strong>Need this exact size?</strong>
            <p>No named product is attached to this page yet. Send the size and vehicle for a current sourcing check.</p>
          </div>
          <Link className="primary" to={quoteUrl}>Request current options</Link>
        </div>
      )}
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
            content.market && {
              title: "Market specification",
              description: descriptorText(content.market),
            },
            content.bodyStyle && {
              title: "Body style",
              description: descriptorText(content.bodyStyle),
            },
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
  const allRelated = stringList(
    content.relatedLinks ||
    content.related ||
    content.relatedPages ||
    content.relatedBrands ||
    content.relatedSizes,
  );
  const relatedModels = variant === "vehicle"
    ? allRelated.filter(isRelatedVehicleLink)
    : [];
  const related = variant === "vehicle"
    ? allRelated.filter((item) => !isRelatedVehicleLink(item))
    : allRelated;
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
        noIndex={Boolean(content.noIndex)}
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

      {variant === "vehicle" ? (
        <VehicleFitmentDirectory
          content={content}
          name={name}
          quoteUrl={quoteUrl}
          relatedModels={relatedModels}
        />
      ) : (
        <SizeEntityDirectory
          content={content}
          variant={variant}
          name={name}
          quoteUrl={quoteUrl}
        />
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
  const params = useParams();
  const requestedSlug = props.slug || params.slug || "";
  const rimHub =
    typeof seoContent.getRimHubBySlug === "function"
      ? seoContent.getRimHubBySlug(requestedSlug)
      : null;
  if (rimHub) {
    return <SeoLandingPage {...props} content={rimHub} variant="rim" />;
  }
  return <SeoLandingPage {...props} variant="size" />;
}
