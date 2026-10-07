import { Link, useParams } from "react-router-dom";
import {
  FaCar,
  FaCheck,
  FaChevronRight,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import {
  SEO_BRANDS,
  SEO_SIZES,
  SEO_VEHICLES,
} from "../../Data/seoContent.js";
import {
  TYRE_RATES_PAGE,
  VEHICLE_MAKE_PAGES,
} from "../../Data/marketPages.js";
import SeoHead from "./SeoHead.jsx";

const WHATSAPP = "923390045836";
const siteUrl = () => (
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "") ||
  "https://wheelsandwheels.vercel.app"
).replace(/\/$/, "");

function Breadcrumbs({ current, parent = { name: "Tyres", path: "/tyres" } }) {
  return (
    <nav className="growth-breadcrumbs breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><Link to="/">Home</Link></li>
        <li><Link to={parent.path}>{parent.name}</Link></li>
        <li><span aria-current="page">{current}</span></li>
      </ol>
    </nav>
  );
}

function DirectRateActions({ message, quoteMessage }) {
  return (
    <div className="growth-actions">
      <a
        className="primary"
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noreferrer"
        data-lead-event="whatsapp_click"
      >
        <FaWhatsapp aria-hidden="true" /> Ask on WhatsApp
      </a>
      <a className="growth-call-button" href="tel:+923214229594" data-lead-event="call_click">
        <FaPhoneAlt aria-hidden="true" /> Call sales
      </a>
      <Link className="growth-quote-link" to={`/quote?message=${encodeURIComponent(quoteMessage)}`}>
        Send an RFQ <FaChevronRight aria-hidden="true" />
      </Link>
    </div>
  );
}

const rateFaq = [
  {
    question: "Why does Wheels & Wheels ask me to request the current tyre rate?",
    answer:
      "Import cost, exact pattern, size, production batch and live market availability can change. We confirm the exact item before quoting instead of leaving an outdated permanent rate online.",
  },
  {
    question: "Is a quoted tyre price for one tyre or a complete set?",
    answer:
      "Always ask. A useful quotation states the quantity and whether fitting, balancing, valves, delivery or another service is included. Wheels & Wheels confirms these details with the quotation.",
  },
  {
    question: "What should I send to receive an accurate rate?",
    answer:
      "Send the complete sidewall size, vehicle make, model, year and variant, required quantity, preferred brand or origin and a clear sidewall photo when possible.",
  },
  {
    question: "Can I compare Chinese, Japanese and premium tyre options?",
    answer:
      "Yes. Ask for like-for-like options in the same verified size and required ratings. Pattern, manufacturing details, warranty source and included services should be compared as well as price.",
  },
];

const priceFactors = [
  {
    title: "Exact size and rating",
    text: "Width, profile, rim diameter, load index and speed rating define the actual requirement. Similar-looking sizes are not interchangeable by default.",
  },
  {
    title: "Brand and pattern",
    text: "Touring, performance, SUV, highway and all-terrain patterns serve different jobs. Compare the exact model, not only the logo on the sidewall.",
  },
  {
    title: "Physical tyre details",
    text: "Manufacturing country, date code, production batch and the warranty source must be checked on the exact tyre offered.",
  },
  {
    title: "Quantity and services",
    text: "Confirm whether the amount is per tyre or for a set and whether installation, balancing, valves or delivery are included.",
  },
];

export function TyreRatesPage() {
  const popularSizes = SEO_SIZES.slice(0, 12);
  const featuredBrands = SEO_BRANDS.slice(0, 12);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl()}${TYRE_RATES_PAGE.route}#collection`,
    name: TYRE_RATES_PAGE.heroTitle,
    description: TYRE_RATES_PAGE.metaDescription,
    url: `${siteUrl()}${TYRE_RATES_PAGE.route}`,
  };
  const whatsappMessage =
    "Hi Wheels & Wheels, please share the current tyre rate. My complete tyre size, vehicle and required quantity are: ";

  return (
    <main className="growth-page market-page">
      <SeoHead
        title={TYRE_RATES_PAGE.title}
        description={TYRE_RATES_PAGE.metaDescription}
        canonical={TYRE_RATES_PAGE.route}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Tyres", path: "/tyres" },
          { name: "Tyre prices in Pakistan", path: TYRE_RATES_PAGE.route },
        ]}
        faq={rateFaq}
        schemas={[collectionSchema]}
      />
      <Breadcrumbs current="Tyre prices in Pakistan" />

      <header className="growth-hero market-hero">
        <div className="growth-hero-copy">
          <p className="eyebrow">CURRENT RATE GUIDE · PAKISTAN</p>
          <h1>{TYRE_RATES_PAGE.heroTitle}</h1>
          <p className="growth-lede">{TYRE_RATES_PAGE.lede}</p>
          <DirectRateActions
            message={whatsappMessage}
            quoteMessage="Please quote my exact tyre size. Vehicle, quantity and preferred brand/origin: "
          />
          <p className="growth-assurance">No online payment · Exact item confirmed before purchase · Updated {TYRE_RATES_PAGE.updatedAt}</p>
        </div>
        <aside className="rate-checklist" aria-labelledby="rate-checklist-title">
          <p className="eyebrow">SEND THESE DETAILS</p>
          <h2 id="rate-checklist-title">Get a quotation you can compare</h2>
          <ol>
            <li><span>01</span><p><b>Complete size</b> such as 195/65 R15, plus load and speed rating where visible.</p></li>
            <li><span>02</span><p><b>Vehicle details</b> including model year, variant and whether wheels are original.</p></li>
            <li><span>03</span><p><b>Quantity and preference</b> such as value, Japanese, premium or a named brand.</p></li>
            <li><span>04</span><p><b>Included services</b> required: fitting, balancing, valves, delivery or collection.</p></li>
          </ol>
        </aside>
      </header>

      <section className="section market-section" aria-labelledby="price-factor-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">COMPARE LIKE FOR LIKE</p>
            <h2 id="price-factor-title">What changes a tyre rate?</h2>
            <p>A cheap-looking quote may describe a different pattern, production detail, quantity or service package. Check the complete offer.</p>
          </div>
        </div>
        <div className="market-factor-grid">
          {priceFactors.map((factor, index) => (
            <article key={factor.title}>
              <span>0{index + 1}</span>
              <h3>{factor.title}</h3>
              <p>{factor.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section market-directory" aria-labelledby="rate-size-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">START WITH YOUR SIDEWALL</p>
            <h2 id="rate-size-title">Popular exact tyre-size guides</h2>
            <p>Open the exact size page for buying checks and relevant vehicle references, then request the current options.</p>
          </div>
          <Link to="/tyre-sizes">View every published size <FaChevronRight aria-hidden="true" /></Link>
        </div>
        <div className="market-pill-grid">
          {popularSizes.map((size) => (
            <Link key={size.slug} to={`/tyre-sizes/${size.slug}`}>
              <b>{size.size}</b><span>Current options <FaChevronRight aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section market-directory" aria-labelledby="rate-brand-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PREMIUM · JAPANESE · CHINESE</p>
            <h2 id="rate-brand-title">Compare brands in the correct size</h2>
            <p>Brand pages explain positioning and buyer checks. Availability and price remain specific to the exact tyre offered.</p>
          </div>
          <Link to="/brands">View all brands <FaChevronRight aria-hidden="true" /></Link>
        </div>
        <div className="market-pill-grid market-brand-grid">
          {featuredBrands.map((brand) => (
            <Link key={brand.slug} to={`/brands/${brand.slug}`}>
              <b>{brand.name}</b><span>{brand.marketPosition} <FaChevronRight aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="growth-faq section" aria-labelledby="rate-faq-title">
        <p className="eyebrow">CURRENT-RATE QUESTIONS</p>
        <h2 id="rate-faq-title">Before you compare quotations</h2>
        <div className="growth-faq-list">
          {rateFaq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <aside className="growth-lead-banner" aria-labelledby="rate-lead-title">
        <div>
          <p className="eyebrow light">READY FOR A CURRENT RATE?</p>
          <h2 id="rate-lead-title">Send the full size and vehicle.</h2>
          <p>We will confirm the exact option, current availability and what the quotation includes.</p>
        </div>
        <a className="primary" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noreferrer" data-lead-event="whatsapp_click">
          <FaWhatsapp aria-hidden="true" /> Ask on WhatsApp
        </a>
      </aside>
    </main>
  );
}

export function VehicleMakePage({ makeSlug: makeSlugProp }) {
  const params = useParams();
  const makeSlug = makeSlugProp || params.makeSlug;
  const page = VEHICLE_MAKE_PAGES[makeSlug];
  if (!page) return null;

  const vehicles = SEO_VEHICLES.filter((vehicle) => vehicle.make === page.make);
  const sizeMap = new Map(SEO_SIZES.map((size) => [size.size, size]));
  const makeSizes = [...new Set(vehicles.flatMap((vehicle) => vehicle.commonSizes.map((entry) => entry.size)))]
    .map((size) => sizeMap.get(size))
    .filter(Boolean);
  const faq = [
    {
      question: `Can every ${page.make} ${vehicles[0]?.model || "model"} use the same tyre size?`,
      answer: `No. ${page.make} sizes can change by generation, year, variant, import specification and wheel package. Check the placard, owner's manual and current sidewall before purchase.`,
    },
    {
      question: `How do I request a rate for ${page.make} tyres?`,
      answer: "Send the model, year, variant, complete sidewall size, required quantity and a clear photo when possible. The team will confirm current options and fitment details.",
    },
    {
      question: "Are alternate or wider tyre sizes automatically safe?",
      answer: "No. Wheel width, clearance, load rating, speed rating and overall diameter must be checked. A commonly discussed alternate is still only a reference until verified for the exact vehicle.",
    },
  ];
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteUrl()}${page.route}#models`,
    name: `${page.make} vehicle tyre guides`,
    itemListElement: vehicles.map((vehicle, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: vehicle.name,
      url: `${siteUrl()}/vehicles/${vehicle.slug}`,
    })),
  };
  const leadMessage = `Hi Wheels & Wheels, please help me find tyres for my ${page.make}. Model, year, variant and current tyre size: `;

  return (
    <main className="growth-page market-page make-page">
      <SeoHead
        title={page.title}
        description={page.metaDescription}
        canonical={page.route}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Vehicles", path: "/vehicles" },
          { name: page.make, path: page.route },
        ]}
        faq={faq}
        schemas={[itemList]}
      />
      <Breadcrumbs current={`${page.make} tyre guides`} parent={{ name: "Vehicles", path: "/vehicles" }} />

      <header className="growth-hero market-hero make-hero">
        <div className="growth-hero-copy">
          <p className="eyebrow">MAKE · MODEL · YEAR · VARIANT</p>
          <h1>{page.heroTitle}</h1>
          <p className="growth-lede">{page.intro}</p>
          <DirectRateActions message={leadMessage} quoteMessage={`Please quote tyres for my ${page.make}. Model, year, variant and current tyre size: `} />
        </div>
        <aside className="make-check-card">
          <FaCar aria-hidden="true" />
          <p className="eyebrow">BEFORE YOU CHOOSE</p>
          <h2>Verify the exact car</h2>
          <ul>
            {page.buyerFocus.map((item) => <li key={item}><FaCheck aria-hidden="true" /> {item}</li>)}
          </ul>
        </aside>
      </header>

      <section className="section market-section" aria-labelledby={`${makeSlug}-model-title`}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">{page.make.toUpperCase()} MODEL DIRECTORY</p>
            <h2 id={`${makeSlug}-model-title`}>Choose the exact model</h2>
            <p>Each model page lists reference sizes with an explicit verification note. It is a starting point, not an automatic fitment approval.</p>
          </div>
        </div>
        <div className="make-model-grid">
          {vehicles.map((vehicle) => (
            <article key={vehicle.slug}>
              <FaCar aria-hidden="true" />
              <p className="eyebrow">VEHICLE FITMENT GUIDE</p>
              <h3><Link to={`/vehicles/${vehicle.slug}`}>{vehicle.name}</Link></h3>
              <p>{vehicle.summary}</p>
              <div>{vehicle.commonSizes.map((entry) => <span key={entry.size}>{entry.size}</span>)}</div>
              <Link className="guide-read-link" to={`/vehicles/${vehicle.slug}`}>Open model guide <FaChevronRight aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>

      {!!makeSizes.length && (
        <section className="section market-directory" aria-labelledby={`${makeSlug}-size-title`}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">PUBLISHED REFERENCES</p>
              <h2 id={`${makeSlug}-size-title`}>Exact-size guides linked to these models</h2>
              <p>The same model name can use different sizes. Open a size only after checking the exact vehicle.</p>
            </div>
          </div>
          <div className="market-pill-grid">
            {makeSizes.map((size) => (
              <Link key={size.slug} to={`/tyre-sizes/${size.slug}`}>
                <b>{size.size}</b><span>View size guide <FaChevronRight aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="growth-faq section" aria-labelledby={`${makeSlug}-faq-title`}>
        <p className="eyebrow">FITMENT QUESTIONS</p>
        <h2 id={`${makeSlug}-faq-title`}>Before buying {page.make} tyres</h2>
        <div className="growth-faq-list">
          {faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
        </div>
      </section>

      <aside className="growth-lead-banner" aria-labelledby={`${makeSlug}-lead-title`}>
        <div>
          <p className="eyebrow light">NEED A VERIFIED MATCH?</p>
          <h2 id={`${makeSlug}-lead-title`}>Send your {page.make} details.</h2>
          <p>Include the model, year, variant and current sidewall size for a useful current-rate reply.</p>
        </div>
        <a className="primary" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(leadMessage)}`} target="_blank" rel="noreferrer" data-lead-event="whatsapp_click">
          <FaWhatsapp aria-hidden="true" /> Ask on WhatsApp
        </a>
      </aside>
    </main>
  );
}

export default TyreRatesPage;
