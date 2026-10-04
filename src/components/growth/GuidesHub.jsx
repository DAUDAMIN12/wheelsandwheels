import { Link } from "react-router-dom";
import { FaBookOpen, FaChevronRight, FaWhatsapp } from "react-icons/fa";
import * as seoContent from "../../Data/seoContent.js";
import SeoHead from "./SeoHead.jsx";

const WHATSAPP = "923390045836";

function getGuides() {
  const candidates = [
    seoContent.GUIDES,
    seoContent.default?.GUIDES,
  ];
  const collection = candidates.find((value) => value && typeof value === "object");
  if (Array.isArray(collection)) return collection;
  if (!collection) return [];
  return Object.entries(collection).map(([slug, guide]) => ({ slug, ...guide }));
}

function getTopics() {
  const candidates = [seoContent.GUIDE_TOPICS, seoContent.default?.GUIDE_TOPICS];
  const collection = candidates.find((value) => value && typeof value === "object");
  if (Array.isArray(collection)) return collection;
  if (!collection) return [];
  return Object.entries(collection).map(([slug, topic]) => ({ slug, ...topic }));
}

function guidePath(guide) {
  return guide.path || guide.href || `/guides/${guide.slug}`;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function GuideCard({ guide, featured = false }) {
  const excerpt = guide.excerpt || guide.summary || guide.metaDescription;
  return (
    <article className={`guide-card${featured ? " guide-card--featured" : ""}`}>
      {guide.image && (
        <Link className="guide-card-media" to={guidePath(guide)} tabIndex={-1} aria-hidden="true">
          <img
            src={guide.image}
            alt=""
            loading={featured ? "eager" : "lazy"}
            fetchPriority={featured ? "high" : "auto"}
          />
        </Link>
      )}
      <div className="guide-card-copy">
        <p className="eyebrow">{guide.category || "TYRE KNOWLEDGE"}</p>
        <h2>
          <Link to={guidePath(guide)}>{guide.title}</Link>
        </h2>
        {excerpt && <p>{excerpt}</p>}
        <div className="guide-card-meta">
          {guide.updatedAt && (
            <time dateTime={guide.updatedAt}>Updated {formatDate(guide.updatedAt)}</time>
          )}
          {guide.readMinutes && <span>{guide.readMinutes} min read</span>}
        </div>
        <Link className="guide-read-link" to={guidePath(guide)}>
          Read guide <FaChevronRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function GuidesHub() {
  const guides = getGuides();
  const topics = getTopics();
  const [featured, ...remaining] = guides;
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Blog and tyre guides", path: "/guides" },
  ];

  return (
    <main className="growth-page guides-hub">
      <SeoHead
        title="Tyre Blog and Guides for Pakistan"
        description="Read practical tyre size, fitment, maintenance and buying articles from Wheels & Wheels Lahore, then request a current rate for your exact requirement."
        canonical="/guides"
        breadcrumbs={breadcrumbs}
      />

      <nav className="growth-breadcrumbs breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li><span aria-current="page">Blog and tyre guides</span></li>
        </ol>
      </nav>

      <header className="growth-hero guides-hero">
        <div className="growth-hero-copy">
          <p className="eyebrow">HONEST ADVICE FOR PAKISTAN'S ROADS</p>
          <h1>Tyre advice and blog.</h1>
          <p className="growth-lede">
            Understand sizes, compare options and spot common problems before you spend.
            Our guides support your decision; final fitment is always checked against your vehicle.
          </p>
          <div className="growth-actions">
            <Link className="primary" to="/tyres">
              Find your tyre <FaChevronRight aria-hidden="true" />
            </Link>
            <a
              className="growth-whatsapp-button"
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Wheels & Wheels, I need advice choosing tyres for my vehicle: ")}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp aria-hidden="true" /> Ask an expert
            </a>
          </div>
        </div>
        <FaBookOpen className="growth-hero-icon" aria-hidden="true" />
      </header>

      {!!topics.length && (
        <section className="guide-topics section" aria-labelledby="guide-topics-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EXPLORE BY TOPIC</p>
              <h2 id="guide-topics-title">Start with the question you need answered</h2>
              <p>Each topic page groups related articles and links into the relevant size, vehicle, brand and service pages.</p>
            </div>
          </div>
          <div className="guide-topic-grid">
            {topics.map((topic, index) => (
              <article key={topic.slug} className="guide-topic-card">
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <p className="eyebrow">{topic.count} GUIDES</p>
                <h2><Link to={topic.path}>{topic.name}</Link></h2>
                <p>{topic.description}</p>
                <Link className="guide-read-link" to={topic.path}>
                  Open topic <FaChevronRight aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {featured ? (
        <section className="guides-list section" aria-labelledby="latest-guides-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PRACTICAL ANSWERS</p>
              <h2 id="latest-guides-title">Latest tyre articles</h2>
            </div>
          </div>
          <GuideCard guide={featured} featured />
          {!!remaining.length && (
            <div className="guides-grid">
              {remaining.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="section growth-empty" aria-live="polite">
          <h2>Our first guides are being prepared.</h2>
          <p>Meanwhile, our team can answer your tyre and fitment questions directly.</p>
        </section>
      )}

      <aside className="growth-lead-banner" aria-labelledby="guide-help-title">
        <div>
          <p className="eyebrow">STILL UNSURE?</p>
          <h2 id="guide-help-title">Send us your vehicle and tyre size.</h2>
          <p>We will check suitable options, availability and the current market rate.</p>
        </div>
        <a
          className="primary"
          href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Wheels & Wheels, please help me choose tyres. My vehicle and current tyre size are: ")}`}
          target="_blank"
          rel="noreferrer"
        >
          <FaWhatsapp aria-hidden="true" /> Ask on official WhatsApp
        </a>
      </aside>
    </main>
  );
}
