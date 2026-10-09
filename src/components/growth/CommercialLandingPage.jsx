import { FaCheck, FaChevronRight, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getCommercialPage } from "../../Data/commercialPages.js";
import PRODUCTS from "../../Data/productsData.js";
import SeoHead from "./SeoHead.jsx";

const WHATSAPP = "923390045836";
const siteUrl = () => (
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "") ||
  "https://wheelsandwheels.vercel.app"
).replace(/\/$/, "");

export default function CommercialLandingPage({ pageKey }) {
  const page = getCommercialPage(pageKey);
  if (!page) {
    return (
      <main className="growth-page growth-not-found">
        <SeoHead
          title="Tyre Category Not Found"
          description="The requested tyre category could not be found."
          noIndex
        />
        <section className="section">
          <p className="eyebrow">PAGE NOT FOUND</p>
          <h1>This tyre category is unavailable.</h1>
          <Link className="primary" to="/tyres">Browse tyre categories</Link>
        </section>
      </main>
    );
  }

  const baseUrl = siteUrl();
  const rimProducts = page.key === "alloy-rims"
    ? PRODUCTS.filter((product) => product.category === "Rims")
    : [];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}${page.route}#collection`,
    name: page.title,
    description: page.metaDescription,
    url: `${baseUrl}${page.route}`,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "Wheels & Wheels",
      url: `${baseUrl}/`,
    },
  };
  const breadcrumbItems = page.key === "alloy-rims"
    ? [
        { name: "Home", path: "/" },
        { name: page.navLabel, path: page.route },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Tyres", path: "/tyres" },
        { name: page.navLabel, path: page.route },
      ];

  return (
    <main className="growth-page commercial-page">
      <SeoHead
        title={page.seoTitle}
        description={page.metaDescription}
        canonical={page.route}
        image={page.image}
        breadcrumbs={breadcrumbItems}
        faq={page.faqs}
        schemas={[collectionSchema]}
      />

      <nav className="growth-breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          {page.key !== "alloy-rims" && <li><Link to="/tyres">Tyres</Link></li>}
          <li aria-current="page">{page.navLabel}</li>
        </ol>
      </nav>

      <header className="growth-hero commercial-hero">
        <div className="growth-hero-copy">
          <p className="eyebrow light">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="growth-lede">{page.lede}</p>
          <div className="growth-actions">
            <Link className="primary" to={page.shopHref}>See representative options <FaChevronRight aria-hidden="true" /></Link>
            <a className="growth-call-button" href="tel:+923214229594"><FaPhoneAlt aria-hidden="true" /> Call 0321 4229594</a>
            <a className="growth-quote-link" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Wheels & Wheels, please share current ${page.navLabel.toLowerCase()} options and rates for my vehicle.`)}`} target="_blank" rel="noreferrer"><FaWhatsapp aria-hidden="true" /> Ask on WhatsApp</a>
          </div>
          <p className="growth-assurance">Ask us to confirm current stock, rate and the exact specification before purchase.</p>
        </div>
        <figure className="growth-hero-media">
          <img src={page.image} alt={page.imageAlt} width="640" height="480" fetchPriority="high" />
          <figcaption>Representative image — ask us to confirm the exact design, pattern and availability during quotation.</figcaption>
        </figure>
      </header>

      <section className="section growth-highlights" aria-labelledby={`${page.key}-highlights`}>
        <p className="eyebrow">WHAT TO COMPARE</p>
        <h2 id={`${page.key}-highlights`}>A useful enquiry starts with the full specification.</h2>
        <div className="growth-highlight-grid">
          {page.highlights.map((item, index) => (
            <article key={item.title}>
              <span aria-hidden="true">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <article className="section growth-article-body">
        {page.sections.map((section) => (
          <section className="growth-copy-section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets?.length > 0 && (
              <ul className="growth-check-list">
                {section.bullets.map((bullet) => <li key={bullet}><FaCheck aria-hidden="true" /> {bullet}</li>)}
              </ul>
            )}
          </section>
        ))}
      </article>

      {rimProducts.length > 0 && (
        <section className="section growth-related" aria-labelledby="rim-catalogue-title">
          <p className="eyebrow">REPRESENTATIVE RIM CATALOGUE</p>
          <h2 id="rim-catalogue-title">Explore alloy-rim styles, then confirm the full fitment.</h2>
          <p>
            These catalogue images are representative. We verify diameter, width,
            PCD, offset, centre bore, load suitability and the exact available
            design before quotation.
          </p>
          <div className="growth-link-grid">
            {rimProducts.map((product) => (
              <Link
                className="growth-link-card"
                to={`/product/${product.slug || product._id}`}
                key={product.slug || product._id}
              >
                <span>{product.title}<small>{product.size} · Representative image</small></span>
                <FaChevronRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="section growth-faq" aria-labelledby={`${page.key}-faq`}>
        <p className="eyebrow">COMMON QUESTIONS</p>
        <h2 id={`${page.key}-faq`}>{page.title} FAQ</h2>
        <div className="growth-faq-list">
          {page.faqs.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section growth-related" aria-labelledby={`${page.key}-related`}>
        <p className="eyebrow">CONTINUE YOUR RESEARCH</p>
        <h2 id={`${page.key}-related`}>Related tyre and fitment pages</h2>
        <div className="growth-link-grid">
          {page.relatedLinks.map((link) => (
            <Link className="growth-link-card" to={link.href} key={link.href}>{link.label}<FaChevronRight aria-hidden="true" /></Link>
          ))}
        </div>
      </section>

      <section className="growth-lead-banner" aria-labelledby={`${page.key}-lead-title`}>
        <div>
          <p className="eyebrow light">CURRENT LAHORE MARKET OPTIONS</p>
          <h2 id={`${page.key}-lead-title`}>Send the exact size or vehicle.</h2>
          <p>Our team will check fitment, current availability and the rate for the exact option discussed.</p>
        </div>
        <Link className="primary" to={`/quote?message=${encodeURIComponent(`Please quote current ${page.navLabel.toLowerCase()} options for my vehicle.`)}`}>Request current rate <FaChevronRight aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
