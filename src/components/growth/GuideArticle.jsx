import { Link, useParams } from "react-router-dom";
import { FaCheck, FaChevronRight, FaClock, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import * as seoContent from "../../Data/seoContent.js";
import SeoHead from "./SeoHead.jsx";

const WHATSAPP = "923390045836";

function slugify(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function guideCollection() {
  const source =
    seoContent.GUIDES || seoContent.default?.GUIDES || [];
  if (Array.isArray(source)) return source;
  return Object.entries(source).map(([slug, guide]) => ({ slug, ...guide }));
}

function findGuide(slug) {
  if (typeof seoContent.getGuide === "function") {
    const direct = seoContent.getGuide(slug);
    if (direct) return direct;
  }
  return guideCollection().find(
    (guide) => slugify(guide.slug || guide.title) === slugify(slug),
  );
}

function list(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function GuideImageCredit({ credit }) {
  if (!credit) return null;
  if (typeof credit === "string") {
    return <span className="guide-image-credit">Photo: {credit}</span>;
  }

  const label = credit.photographer || credit.sourceLabel || credit.label || credit.name || "Image source";
  const sourceUrl = credit.url || credit.sourceUrl;
  const licenseLabel = credit.licenseName || credit.license;
  const licenseUrl = credit.licenseUrl;

  return (
    <span className="guide-image-credit">
      Photo:{" "}
      {sourceUrl ? (
        <a href={sourceUrl} target="_blank" rel="noreferrer">{label}</a>
      ) : label}
      {licenseLabel && (
        <>
          {" · "}
          {licenseUrl ? (
            <a href={licenseUrl} target="_blank" rel="noreferrer">{licenseLabel}</a>
          ) : licenseLabel}
        </>
      )}
      {credit.modified && <> · cropped for layout</>}
    </span>
  );
}

function GuideTable({ table, title }) {
  if (!table) return null;
  const headers = table.headers || table.columns || [];
  const rows = table.rows || (Array.isArray(table) ? table : []);
  if (!rows.length) return null;
  return (
    <div className="guide-table-wrap" role="region" aria-label={table.caption || title} tabIndex={0}>
      <table>
        {table.caption && <caption>{table.caption}</caption>}
        {!!headers.length && (
          <thead>
            <tr>
              {headers.map((header) => <th key={String(header)} scope="col">{header}</th>)}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rowIndex) => {
            const cells = Array.isArray(row) ? row : Object.values(row);
            return (
              <tr key={`row-${rowIndex}`}>
                {cells.map((cell, cellIndex) =>
                  cellIndex === 0 ? (
                    <th key={`cell-${cellIndex}`} scope="row">{String(cell)}</th>
                  ) : (
                    <td key={`cell-${cellIndex}`}>{String(cell)}</td>
                  ),
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ArticleSection({ section, index }) {
  const heading = section.heading || section.title || `Section ${index + 1}`;
  const id = section.id || `guide-section-${index + 1}-${slugify(heading)}`;
  return (
    <section className="guide-section" aria-labelledby={id}>
      <h2 id={id}>{heading}</h2>
      {list(section.paragraphs || section.body || section.content).map((paragraph, paragraphIndex) => (
        <p key={`${id}-p-${paragraphIndex}`}>
          {typeof paragraph === "string" ? paragraph : paragraph.text || paragraph.description}
        </p>
      ))}
      {!!list(section.bullets || section.items || section.points).length && (
        <ul className="growth-check-list">
          {list(section.bullets || section.items || section.points).map((item, itemIndex) => (
            <li key={`${id}-item-${itemIndex}`}>
              <FaCheck aria-hidden="true" />
              <span>
                {typeof item === "string" ? item : (
                  <>
                    {(item.title || item.name) && <strong>{item.title || item.name}: </strong>}
                    {item.text || item.description || item.body}
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      {section.note && <aside className="guide-note"><strong>Important:</strong> {section.note}</aside>}
      <GuideTable table={section.table} title={heading} />
    </section>
  );
}

export default function GuideArticle({ slug: slugProp, guide: guideProp }) {
  const params = useParams();
  const slug = slugProp || params.slug || params.guide || "";
  const guide = guideProp || findGuide(slug);

  if (!guide) {
    return (
      <main className="growth-page growth-not-found">
        <SeoHead title="Guide not found" description="Browse Wheels & Wheels tyre guides." noIndex />
        <section className="section">
          <p className="eyebrow">TYRE KNOWLEDGE</p>
          <h1>That guide is not available.</h1>
          <p>Visit the guides hub or ask our fitment team directly.</p>
          <div className="growth-actions">
            <Link className="primary" to="/guides">Browse tyre guides</Link>
            <a className="growth-whatsapp-button" href={`https://wa.me/${WHATSAPP}`}>
              <FaWhatsapp aria-hidden="true" /> Ask on WhatsApp
            </a>
          </div>
        </section>
      </main>
    );
  }

  const guideSlug = guide.slug || slugify(guide.title);
  const path = guide.path || `/guides/${guideSlug}`;
  const description = guide.metaDescription || guide.excerpt || guide.summary;
  const sections = list(guide.sections);
  const faq = list(guide.faqs || guide.faq);
  const related = list(guide.relatedLinks || guide.related);
  const updatedAt = guide.updatedAt || guide.dateModified;
  const topic = guide.topicSlug && typeof seoContent.getGuideTopic === "function"
    ? seoContent.getGuideTopic(guide.topicSlug)
    : null;
  const authorName =
    typeof guide.author === "object"
      ? guide.author.name || "Wheels & Wheels team"
      : guide.author || "Wheels & Wheels team";
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Blog and tyre guides", path: "/guides" },
    ...(topic ? [{ name: topic.name, path: topic.path }] : []),
    { name: guide.title, path },
  ];
  const question = `Hi Wheels & Wheels, I read “${guide.title}” and need help with my vehicle. My current tyre size is: `;

  return (
    <main className="growth-page guide-page">
      <SeoHead
        title={guide.seoTitle || guide.title}
        description={description}
        canonical={path}
        image={guide.ogImage || guide.image || "/tyre.jpg"}
        type="article"
        breadcrumbs={breadcrumbs}
        faq={faq}
        article={{
          headline: guide.title,
          description,
          image: guide.ogImage || guide.image,
          author: guide.author || "Wheels & Wheels team",
          datePublished: guide.publishedAt || updatedAt,
          dateModified: updatedAt || guide.publishedAt,
        }}
      />

      <nav className="growth-breadcrumbs breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/guides">Blog and tyre guides</Link></li>
          {topic && <li><Link to={topic.path}>{topic.name}</Link></li>}
          <li><span aria-current="page">{guide.title}</span></li>
        </ol>
      </nav>

      <article className="guide-article">
        <header className="guide-article-header">
          <p className="eyebrow">{guide.category || "TYRE KNOWLEDGE"}</p>
          <h1>{guide.heroTitle || guide.title}</h1>
          {description && <p className="growth-lede">{description}</p>}
          <div className="guide-byline">
            <span>By {authorName}</span>
            {updatedAt && <time dateTime={updatedAt}>Updated {formatDate(updatedAt)}</time>}
            {guide.readMinutes && <span><FaClock aria-hidden="true" /> {guide.readMinutes} min read</span>}
          </div>
        </header>

        {guide.image && (
          <figure className="guide-cover">
            <img
              src={guide.image}
              srcSet={guide.imageSmall ? `${guide.imageSmall} 960w, ${guide.image} 1600w` : undefined}
              sizes={guide.imageSmall ? "(max-width: 600px) 100vw, (max-width: 1168px) calc(100vw - 48px), 1120px" : undefined}
              alt={guide.imageAlt || `Illustration for ${guide.title}`}
              width="1600"
              height="900"
              fetchPriority="high"
              decoding="async"
              style={guide.imagePosition ? { objectPosition: guide.imagePosition } : undefined}
            />
            {(guide.imageCaption || guide.imageCredit) && (
              <figcaption>
                {guide.imageCaption && <span>{guide.imageCaption}</span>}
                <GuideImageCredit credit={guide.imageCredit} />
              </figcaption>
            )}
          </figure>
        )}

        <div className="guide-layout">
          {!!sections.length && (
            <nav className="guide-toc" aria-labelledby="guide-toc-title">
              <h2 id="guide-toc-title">In this guide</h2>
              <ol>
                {sections.map((section, index) => {
                  const heading = section.heading || section.title || `Section ${index + 1}`;
                  const id = section.id || `guide-section-${index + 1}-${slugify(heading)}`;
                  return <li key={id}><a href={`#${id}`}>{heading}</a></li>;
                })}
              </ol>
            </nav>
          )}
          <div className="guide-content">
            {guide.takeaway && (
              <aside className="guide-takeaway">
                <strong>Key takeaway</strong>
                <p>{guide.takeaway}</p>
              </aside>
            )}
            {sections.map((section, index) => (
              <ArticleSection key={section.id || section.heading || index} section={section} index={index} />
            ))}
            <aside className="guide-inline-cta" aria-labelledby="guide-inline-help-title">
              <h2 id="guide-inline-help-title">Want advice for your vehicle?</h2>
              <p>Send your vehicle model and the full size printed on your tyre sidewall.</p>
              <div className="growth-actions">
                <a
                  className="primary"
                  href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(question)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp aria-hidden="true" /> Ask on WhatsApp
                </a>
                <a className="growth-call-button" href="tel:+923214229594">
                  <FaPhoneAlt aria-hidden="true" /> Call sales
                </a>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {!!faq.length && (
        <section className="growth-faq section" aria-labelledby="guide-faq-title">
          <p className="eyebrow">COMMON QUESTIONS</p>
          <h2 id="guide-faq-title">Frequently asked questions</h2>
          <div className="growth-faq-list">
            {faq.map((item) => {
              const questionText = item.question || item.q;
              return (
                <details key={questionText}>
                  <summary>{questionText}</summary>
                  <p>{item.answer || item.a}</p>
                </details>
              );
            })}
          </div>
        </section>
      )}

      {!!related.length && (
        <section className="growth-related section" aria-labelledby="related-guides-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LEARN MORE</p>
              <h2 id="related-guides-title">Related guides and tyre pages</h2>
            </div>
          </div>
          <div className="growth-link-grid">
            {related.map((item, index) => {
              const label = typeof item === "string" ? item : item.label || item.title;
              const href =
                typeof item === "string" ? `/guides/${slugify(item)}` : item.href || item.path;
              return (
                <Link key={`${href}-${index}`} className="growth-link-card" to={href}>
                  <span>{label}</span>
                  <FaChevronRight aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
