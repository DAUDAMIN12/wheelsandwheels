import { Link } from "react-router-dom";
import {
  FaCheck,
  FaChevronRight,
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaWrench,
} from "react-icons/fa";
import SeoHead from "./SeoHead.jsx";

const WHATSAPP = "923390045836";
const SALES_PHONE = "+923214229594";
const SECOND_PHONE = "+923390045836";
const EMAIL = "wheelsandwheelsinfo@gmail.com";
const ADDRESS =
  "Old Tyre Market, near Rawali Cinema and Railway Station, Aslam Khan Road, Lahore";
const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
const SITE_URL = (import.meta.env.VITE_SITE_URL || "").replace(/\/$/, "");

const OPENING_DAYS = [
  "https://schema.org/Monday",
  "https://schema.org/Tuesday",
  "https://schema.org/Wednesday",
  "https://schema.org/Thursday",
  "https://schema.org/Friday",
  "https://schema.org/Saturday",
];

const SERVICES = [
  {
    slug: "tyre-installation",
    title: "Tyre installation",
    description:
      "Installation for replacement tyres, with the vehicle and tyre requirement checked before work begins.",
  },
  {
    slug: "wheel-balancing",
    title: "Computerised wheel balancing",
    description:
      "Balancing for tyre-and-wheel assemblies when fitting tyres or investigating speed-related vibration.",
  },
  {
    slug: "wheel-alignment",
    title: "Wheel alignment",
    description:
      "Alignment checks and adjustment guidance for pulling, an off-centre steering wheel or uneven tyre wear.",
  },
];

function absoluteUrl(path) {
  if (!SITE_URL) return undefined;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function localBusinessSchema(description) {
  const url = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    ...(url ? { "@id": `${url}#business`, url } : {}),
    name: "Wheels & Wheels",
    description,
    telephone: [SALES_PHONE, SECOND_PHONE],
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Old Tyre Market, near Rawali Cinema and Railway Station, Aslam Khan Road",
      addressLocality: "Lahore",
      addressCountry: "PK",
    },
    areaServed: {
      "@type": "City",
      name: "Lahore",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: OPENING_DAYS,
      opens: "12:00",
      closes: "21:00",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SALES_PHONE,
        contactType: "sales",
      },
      {
        "@type": "ContactPoint",
        telephone: SECOND_PHONE,
        contactType: "customer service",
      },
    ],
  };
}

function serviceSchemas() {
  return SERVICES.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: {
      "@type": "AutomotiveBusiness",
      name: "Wheels & Wheels",
      telephone: SALES_PHONE,
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Old Tyre Market, near Rawali Cinema and Railway Station, Aslam Khan Road",
        addressLocality: "Lahore",
        addressCountry: "PK",
      },
    },
    areaServed: {
      "@type": "City",
      name: "Lahore",
    },
  }));
}

function Breadcrumbs({ items }) {
  return (
    <nav className="growth-breadcrumbs breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={item.path}>
            {index === items.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link to={item.path}>{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ContactActions({ subject = "tyres, rims or wheel services" }) {
  const message = `Hi Wheels & Wheels, please share the current rate and availability for ${subject}. My vehicle and requirement are: `;
  return (
    <div className="growth-actions" aria-label="Contact Wheels & Wheels">
      <a
        className="primary growth-whatsapp-button"
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noreferrer"
      >
        <FaWhatsapp aria-hidden="true" /> WhatsApp 0339 0045836
      </a>
      <a className="growth-call-button" href={`tel:${SALES_PHONE}`}>
        <FaPhoneAlt aria-hidden="true" /> Call 0321 4229594
      </a>
      <Link className="growth-quote-link" to="/quote">
        Send details online <FaChevronRight aria-hidden="true" />
      </Link>
    </div>
  );
}

function PageHero({ eyebrow, title, intro, subject, children }) {
  return (
    <header className="growth-hero business-page-hero">
      <div className="growth-hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="growth-lede">{intro}</p>
        <ContactActions subject={subject} />
      </div>
      {children}
    </header>
  );
}

function LeadBanner({ title, text, subject }) {
  const message = `Hi Wheels & Wheels, I need help with ${subject}. My vehicle and requirement are: `;
  return (
    <aside className="growth-lead-banner" aria-labelledby="business-lead-title">
      <div>
        <p className="eyebrow">ASK FOR THE CURRENT RATE</p>
        <h2 id="business-lead-title">{title}</h2>
        <p>{text}</p>
      </div>
      <a
        className="primary"
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noreferrer"
      >
        <FaWhatsapp aria-hidden="true" /> Ask on official WhatsApp
      </a>
    </aside>
  );
}

function FaqList({ items, title = "Frequently asked questions", id = "business-faq-title" }) {
  return (
    <section className="growth-faq section" aria-labelledby={id}>
      <p className="eyebrow">STRAIGHT ANSWERS</p>
      <h2 id={id}>{title}</h2>
      <div className="growth-faq-list">
        {items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function BusinessDetails() {
  return (
    <section className="business-details section" aria-labelledby="business-details-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">VISIT OR CONTACT US</p>
          <h2 id="business-details-title">Wheels & Wheels Lahore</h2>
        </div>
      </div>
      <div className="business-detail-grid">
        <article>
          <FaMapMarkerAlt aria-hidden="true" />
          <h3>Showroom location</h3>
          <address>{ADDRESS}</address>
          <a href={MAP_URL} target="_blank" rel="noreferrer">
            Open directions <FaChevronRight aria-hidden="true" />
          </a>
        </article>
        <article>
          <FaPhoneAlt aria-hidden="true" />
          <h3>Call or WhatsApp</h3>
          <p>
            <a href={`tel:${SALES_PHONE}`}>0321 4229594</a>
            <br />
            <a href={`tel:${SECOND_PHONE}`}>0339 0045836</a>
          </p>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
            Official WhatsApp <FaChevronRight aria-hidden="true" />
          </a>
        </article>
        <article>
          <FaClock aria-hidden="true" />
          <h3>Opening hours</h3>
          <p>
            Monday–Saturday: <time>12:00 PM–9:00 PM</time>
            <br />
            Sunday: Closed
          </p>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </article>
      </div>
    </section>
  );
}

const CONTACT_FAQ = [
  {
    question: "Where is Wheels & Wheels located?",
    answer:
      "Wheels & Wheels is in Old Tyre Market, near Rawali Cinema and Railway Station, on Aslam Khan Road in Lahore.",
  },
  {
    question: "What are the opening hours?",
    answer:
      "The shop is open Monday to Saturday from 12:00 PM to 9:00 PM and is closed on Sunday.",
  },
  {
    question: "Which number is the official website WhatsApp?",
    answer:
      "The official website WhatsApp number is 0339 0045836. Both 0321 4229594 and 0339 0045836 can receive calls.",
  },
  {
    question: "Why does the website ask me to request the current rate?",
    answer:
      "The website is lead-only. Contact the team to confirm the current rate and availability for the exact tyre, rim or service required.",
  },
];

const SERVICE_FAQ = [
  {
    question: "Which wheel services are listed by Wheels & Wheels?",
    answer:
      "The website lists tyre installation, computerised wheel balancing and wheel alignment.",
  },
  {
    question: "How can I ask about a service appointment?",
    answer:
      "Call 0321 4229594 or 0339 0045836, or message the official WhatsApp number 0339 0045836 with your vehicle and required service.",
  },
  {
    question: "Are service prices fixed on the website?",
    answer:
      "No. Ask the team for the current rate for the required service before visiting.",
  },
];

export function AboutPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "About Wheels & Wheels", path: "/about" },
  ];
  return (
    <main className="growth-page business-page about-page">
      <SeoHead
        title="About Wheels & Wheels Lahore"
        description="Learn how Wheels & Wheels helps Lahore customers enquire about tyres, alloy rims, installation, balancing and alignment through direct, current-rate support."
        canonical="/about"
        breadcrumbs={breadcrumbs}
        schemas={[
          localBusinessSchema(
            "A Lahore tyre and rim business offering current-rate enquiries and wheel services.",
          ),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />
      <PageHero
        eyebrow="ABOUT WHEELS & WHEELS"
        title="Direct advice for tyres, rims and wheel care."
        intro="Wheels & Wheels is based in Lahore's Old Tyre Market. This website helps customers explore options, understand fitment and contact the team for current rates and availability."
        subject="tyres, rims or wheel care"
      />

      <section className="growth-highlights section" aria-labelledby="about-approach-title">
        <p className="eyebrow">HOW THE WEBSITE WORKS</p>
        <h2 id="about-approach-title">A clear path from question to quotation</h2>
        <div className="growth-highlight-grid">
          <article>
            <span aria-hidden="true">01</span>
            <h3>Share the requirement</h3>
            <p>Send the vehicle, full tyre size, rim requirement or wheel service needed.</p>
          </article>
          <article>
            <span aria-hidden="true">02</span>
            <h3>Request the current rate</h3>
            <p>The website does not present stale prices as guaranteed current prices.</p>
          </article>
          <article>
            <span aria-hidden="true">03</span>
            <h3>Continue directly</h3>
            <p>Use a call, official WhatsApp or the online quotation form to continue.</p>
          </article>
        </div>
      </section>

      <section className="growth-related section" aria-labelledby="about-explore-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE THE WEBSITE</p>
            <h2 id="about-explore-title">Start with the information you have</h2>
          </div>
        </div>
        <div className="growth-link-grid">
          <Link className="growth-link-card" to="/brands">
            <span>Browse tyre brands</span><FaChevronRight aria-hidden="true" />
          </Link>
          <Link className="growth-link-card" to="/vehicles">
            <span>Find tyres by vehicle</span><FaChevronRight aria-hidden="true" />
          </Link>
          <Link className="growth-link-card" to="/tyre-sizes">
            <span>Browse tyre sizes</span><FaChevronRight aria-hidden="true" />
          </Link>
          <Link className="growth-link-card" to="/guides">
            <span>Read tyre guides</span><FaChevronRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <BusinessDetails />
      <LeadBanner
        title="Tell us what your vehicle needs."
        text="Share the full tyre size, vehicle details or required wheel service for a current-rate response."
        subject="a tyre, rim or wheel-service enquiry"
      />
    </main>
  );
}

export function ContactPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ];
  return (
    <main className="growth-page business-page contact-page">
      <SeoHead
        title="Contact Wheels & Wheels Lahore"
        description="Call Wheels & Wheels on 0321 4229594 or 0339 0045836, WhatsApp 0339 0045836, or visit Old Tyre Market near Rawali Cinema and Railway Station in Lahore."
        canonical="/contact"
        breadcrumbs={breadcrumbs}
        faq={CONTACT_FAQ}
        schemas={[
          localBusinessSchema(
            "Contact Wheels & Wheels in Lahore for current tyre, rim and wheel-service rates.",
          ),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />
      <PageHero
        eyebrow="CALL · WHATSAPP · VISIT"
        title="Talk directly to Wheels & Wheels."
        intro="Send the full tyre size or your vehicle details so the team can understand the requirement before replying with current information."
        subject="a current tyre, rim or service rate"
      >
        <div className="business-hero-card">
          <FaEnvelope aria-hidden="true" />
          <h2>Email</h2>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <p>For calls, use 0321 4229594 or 0339 0045836.</p>
        </div>
      </PageHero>
      <BusinessDetails />
      <FaqList items={CONTACT_FAQ} title="Contact and visiting questions" id="contact-faq-title" />
    </main>
  );
}

export function ServicesPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Wheel services", path: "/services" },
  ];
  return (
    <main className="growth-page business-page services-page">
      <SeoHead
        title="Tyre Installation, Wheel Balancing and Alignment in Lahore"
        description="Explore tyre installation, computerised wheel balancing and wheel alignment at Wheels & Wheels in Lahore. Contact the team for current service rates."
        canonical="/services"
        breadcrumbs={breadcrumbs}
        faq={SERVICE_FAQ}
        schemas={serviceSchemas()}
      />
      <Breadcrumbs items={breadcrumbs} />
      <PageHero
        eyebrow="WHEEL CARE IN LAHORE"
        title="Installation, balancing and alignment."
        intro="Choose the service you need, read what it covers and contact the team for the current rate and available time."
        subject="tyre installation, wheel balancing or wheel alignment"
      >
        <FaWrench className="growth-hero-icon" aria-hidden="true" />
      </PageHero>

      <section className="business-services section" aria-labelledby="services-list-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">AVAILABLE SERVICES</p>
            <h2 id="services-list-title">Choose a wheel service</h2>
          </div>
        </div>
        <div className="service-grid">
          {SERVICES.map((service, index) => (
            <article className="service-card" key={service.slug}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <div className="service-card-copy">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link to={`/services/${service.slug}`}>
                  Read the service guide <FaChevronRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="growth-highlights section" aria-labelledby="service-contact-title">
        <p className="eyebrow">BEFORE YOU VISIT</p>
        <h2 id="service-contact-title">Help us understand the job</h2>
        <div className="growth-highlight-grid">
          <article><FaCheck aria-hidden="true" /><h3>Share the vehicle</h3><p>Include the make and model in the message.</p></article>
          <article><FaCheck aria-hidden="true" /><h3>Name the service</h3><p>Tell us whether you need installation, balancing or alignment.</p></article>
          <article><FaCheck aria-hidden="true" /><h3>Confirm the rate</h3><p>Ask for the current service rate before visiting.</p></article>
        </div>
      </section>

      <FaqList items={SERVICE_FAQ} title="Wheel-service questions" id="service-faq-title" />
      <LeadBanner
        title="Ask about a wheel service."
        text="Message the vehicle and service required, or call the shop during opening hours."
        subject="a wheel service"
      />
    </main>
  );
}

export function LahoreTyreShopPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Lahore tyre shop", path: "/lahore-tyre-shop" },
  ];
  const localFaq = [CONTACT_FAQ[0], CONTACT_FAQ[1], CONTACT_FAQ[3]];
  return (
    <main className="growth-page business-page local-page">
      <SeoHead
        title="Tyre and Alloy Rim Shop in Lahore"
        description="Contact or visit Wheels & Wheels at Old Tyre Market near Rawali Cinema and Railway Station, Aslam Khan Road, Lahore, for current tyre, rim and wheel-service rates."
        canonical="/lahore-tyre-shop"
        breadcrumbs={breadcrumbs}
        faq={localFaq}
        schemas={[
          localBusinessSchema(
            "A Lahore tyre and alloy rim shop offering current-rate enquiries, tyre installation, wheel balancing and wheel alignment.",
          ),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />
      <PageHero
        eyebrow="OLD TYRE MARKET · LAHORE"
        title="Your tyre and rim enquiry starts here."
        intro="Wheels & Wheels is located near Rawali Cinema and Railway Station on Aslam Khan Road. Call or message before visiting to ask for the current rate and availability."
        subject="tyres or alloy rims in Lahore"
      >
        <div className="business-hero-card">
          <FaMapMarkerAlt aria-hidden="true" />
          <h2>Find the shop</h2>
          <address>{ADDRESS}</address>
          <a href={MAP_URL} target="_blank" rel="noreferrer">
            Open directions <FaChevronRight aria-hidden="true" />
          </a>
        </div>
      </PageHero>

      <section className="growth-highlights section" aria-labelledby="lahore-options-title">
        <p className="eyebrow">WHAT YOU CAN ASK ABOUT</p>
        <h2 id="lahore-options-title">Tyres, rims and wheel services</h2>
        <div className="growth-highlight-grid">
          <article><span aria-hidden="true">01</span><h3>Tyre enquiries</h3><p>Share the complete size and vehicle for current options.</p><Link to="/tyres">Find tyres</Link></article>
          <article><span aria-hidden="true">02</span><h3>Alloy rim enquiries</h3><p>Share the vehicle and rim requirement before requesting options.</p><Link to="/shop?category=Rims">Browse rims</Link></article>
          <article><span aria-hidden="true">03</span><h3>Wheel services</h3><p>Ask about installation, balancing or alignment.</p><Link to="/services">View services</Link></article>
        </div>
      </section>

      <BusinessDetails />
      <FaqList items={localFaq} title="Visiting the Lahore shop" id="lahore-faq-title" />
      <LeadBanner
        title="Check before you travel."
        text="Send your exact requirement on WhatsApp or call during opening hours for the current rate and availability."
        subject="a Lahore tyre or rim enquiry"
      />
    </main>
  );
}

export function FAQPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Frequently asked questions", path: "/faq" },
  ];
  const faq = [
    ...CONTACT_FAQ,
    ...SERVICE_FAQ,
    {
      question: "How should I request a tyre rate?",
      answer:
        "Share the complete tyre size printed on the sidewall and your vehicle details by call, official WhatsApp or the online quotation form.",
    },
    {
      question: "Can I pay through the website?",
      answer:
        "No. The website is currently used to collect enquiries and provide contact routes, not to accept online payments.",
    },
    {
      question: "What email address can I use?",
      answer: `Email ${EMAIL}. For a direct response, you can also call or use the official WhatsApp number.`,
    },
  ];
  return (
    <main className="growth-page business-page faq-page">
      <SeoHead
        title="Wheels & Wheels Frequently Asked Questions"
        description="Answers about Wheels & Wheels Lahore contact numbers, official WhatsApp, location, opening hours, current rates and wheel services."
        canonical="/faq"
        breadcrumbs={breadcrumbs}
        faq={faq}
      />
      <Breadcrumbs items={breadcrumbs} />
      <PageHero
        eyebrow="QUICK, CLEAR ANSWERS"
        title="Frequently asked questions."
        intro="Find the verified contact, location, opening-hours and service information, then contact the team for a current rate."
        subject="a tyre, rim or wheel-service question"
      />
      <FaqList items={faq} title="What customers need to know" id="main-faq-title" />
      <section className="growth-related section" aria-labelledby="faq-next-title">
        <div className="section-heading">
          <div><p className="eyebrow">NEXT STEPS</p><h2 id="faq-next-title">Continue your enquiry</h2></div>
        </div>
        <div className="growth-link-grid">
          <Link className="growth-link-card" to="/contact"><span>Contact the shop</span><FaChevronRight aria-hidden="true" /></Link>
          <Link className="growth-link-card" to="/quote"><span>Request a quotation</span><FaChevronRight aria-hidden="true" /></Link>
          <Link className="growth-link-card" to="/services"><span>Explore wheel services</span><FaChevronRight aria-hidden="true" /></Link>
          <Link className="growth-link-card" to="/guides"><span>Read tyre guides</span><FaChevronRight aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
