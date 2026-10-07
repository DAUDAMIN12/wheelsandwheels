import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCar,
  FaChevronRight,
  FaPhoneAlt,
  FaSearch,
  FaTags,
  FaWhatsapp,
} from "react-icons/fa";
import * as seoContent from "../../Data/seoContent.js";
import SeoHead from "./SeoHead.jsx";
import { trackLeadEvent } from "../../lib/leadTracking.js";

const WHATSAPP = "923390045836";

function collection(...candidates) {
  const value = candidates.find((candidate) => candidate && typeof candidate === "object");
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return Object.entries(value).map(([slug, item]) => ({ slug, ...item }));
}

function slugify(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function linkPath(item, type) {
  if (item.path || item.href) return item.path || item.href;
  const slug = item.slug || slugify(item.name || item.title || item.size);
  if (type === "brand") return `/brands/${slug}`;
  if (type === "vehicle") return `/vehicles/${slug}`;
  return `/tyre-sizes/${slug}`;
}

function summaryText(item, type) {
  if (item.summary || item.description) return item.summary || item.description;
  if (type === "brand") {
    const knownFor = Array.isArray(item.knownFor) ? item.knownFor.join(", ") : item.knownFor;
    return knownFor || `${item.origin || "Imported"} tyre options, checked for current availability.`;
  }
  if (type === "vehicle") {
    const sizes = (item.commonSizes || []).slice(0, 3).map((entry) => entry.size || entry).join(", ");
    return sizes ? `Commonly researched sizes: ${sizes}. Verify by year and variant.` : "Fitment must be verified by model, year and variant.";
  }
  const applications = Array.isArray(item.commonApplications)
    ? item.commonApplications
        .slice(0, 2)
        .map((entry) =>
          typeof entry === "string" ? entry : entry.application || entry.name || entry.title,
        )
        .filter(Boolean)
        .join(", ")
    : item.commonApplications;
  return applications || "Compare current brand options and confirm fitment for your vehicle.";
}

function DiscoveryCard({ item, type }) {
  const label =
    item.name || item.heroTitle || item.title || item.size || `${item.make || ""} ${item.model || ""}`.trim();
  return (
    <article className="discovery-card">
      <p className="eyebrow">
        {type === "brand"
          ? [item.tier, item.origin].filter(Boolean).join(" · ") || "TYRE BRAND"
          : type === "vehicle"
            ? "VEHICLE FITMENT"
            : "TYRE SIZE"}
      </p>
      <h3><Link to={linkPath(item, type)}>{label}</Link></h3>
      <p>{summaryText(item, type)}</p>
      <Link className="guide-read-link" to={linkPath(item, type)}>
        Explore {type === "vehicle" ? "fitments" : "options"} <FaChevronRight aria-hidden="true" />
      </Link>
    </article>
  );
}

function DiscoverySection({ id, eyebrow, title, intro, items, type, allHref, allLabel }) {
  if (!items.length) return null;
  return (
    <section className="discovery-section section" aria-labelledby={id}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={id}>{title}</h2>
          {intro && <p>{intro}</p>}
        </div>
        {allHref && (
          <Link to={allHref}>{allLabel} <FaChevronRight aria-hidden="true" /></Link>
        )}
      </div>
      <div className="discovery-grid">
        {items.map((item) => (
          <DiscoveryCard key={item.slug || item.name || item.title || item.size} item={item} type={type} />
        ))}
      </div>
    </section>
  );
}

function TyreSizeDirectory({ hubs }) {
  return (
    <section className="tyre-size-directory section" aria-labelledby="tyre-size-directory-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">12–24 INCH DIRECTORY</p>
          <h2 id="tyre-size-directory-title">Choose a wheel diameter, then an exact size</h2>
          <p>
            Every linked profile below is a published size reference with calculated dimensions.
            Vehicle fitment, ratings, brand availability and the current rate still require confirmation.
          </p>
        </div>
      </div>
      <div className="rim-directory-grid">
        {hubs.map((hub) => (
          <article key={hub.slug} className={hub.noIndex ? "rim-directory-card is-enquiry-only" : "rim-directory-card"}>
            <p className="eyebrow">R{hub.rim} WHEEL</p>
            <h3><Link to={hub.path}>{hub.rim}-inch tyre sizes</Link></h3>
            <p>
              {hub.sizes.length
                ? `${hub.sizes.length} exact profile${hub.sizes.length === 1 ? "" : "s"} in our current data.`
                : "Send the complete sidewall code for a sourcing check."}
            </p>
            {!!hub.sizes.length && (
              <div className="rim-size-links" aria-label={`${hub.rim}-inch exact tyre sizes`}>
                {hub.sizes.slice(0, 8).map((size) => (
                  <Link key={size.slug} to={size.path}>{size.size}</Link>
                ))}
                {hub.sizes.length > 8 && (
                  <details className="rim-size-more">
                    <summary>Show {hub.sizes.length - 8} more R{hub.rim} sizes</summary>
                    <div>
                      {hub.sizes.slice(8).map((size) => (
                        <Link key={size.slug} to={size.path}>{size.size}</Link>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )}
            <Link className="guide-read-link" to={hub.path}>
              {hub.sizes.length ? "Open diameter guide" : "Ask about this diameter"}
              <FaChevronRight aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function DiscoveryHub({ focus = "all" }) {
  const navigate = useNavigate();
  const brands = collection(seoContent.SEO_BRANDS, seoContent.default?.SEO_BRANDS);
  const vehicles = collection(seoContent.SEO_VEHICLES, seoContent.default?.SEO_VEHICLES);
  const sizes = collection(seoContent.SEO_SIZES, seoContent.default?.SEO_SIZES);
  const rimHubs = collection(seoContent.TYRE_RIM_HUBS, seoContent.default?.TYRE_RIM_HUBS);
  const preferredSize = sizes.find((item) => item.slug === "195-65-r15") || sizes[0];
  const [fitment, setFitment] = useState({
    width: String(preferredSize?.width || 195),
    profile: String(preferredSize?.aspectRatio || 65),
    rim: String(preferredSize?.rim || 15),
  });
  const widthOptions = [...new Set(
    sizes.filter((item) => item.width >= 155).map((item) => item.width),
  )].sort((a, b) => a - b);
  const profileOptions = [...new Set(
    sizes
      .filter(
        (item) =>
          item.aspectRatio >= 35 && String(item.width) === fitment.width,
      )
      .map((item) => item.aspectRatio),
  )].sort((a, b) => a - b);
  const rimOptions = [...new Set(
    sizes
      .filter(
        (item) =>
          String(item.width) === fitment.width &&
          String(item.aspectRatio) === fitment.profile,
      )
      .map((item) => item.rim),
  )].sort((a, b) => a - b);
  const pageCopy = {
    all: {
      title: "Find Tyres by Size, Brand or Vehicle",
      h1: "Find the right tyres for your car.",
      canonical: "/tyres",
      description:
        "Find tyre options by size, brand or vehicle. Wheels & Wheels Lahore checks current availability, market rates and safe fitment before supply.",
    },
    brand: {
      title: "Tyre Brands in Lahore",
      h1: "Compare tyre brands with the right context.",
      canonical: "/brands",
      description:
        "Explore premium, Japanese and Chinese tyre brands in Lahore, then request current options for your exact size and vehicle.",
    },
    vehicle: {
      title: "Find Tyres by Vehicle",
      h1: "Start with your vehicle, then verify the fitment.",
      canonical: "/vehicles",
      description:
        "Browse reference tyre sizes by vehicle and ask Wheels & Wheels Lahore to verify the exact model year, variant, ratings and wheel fitment.",
    },
    size: {
      title: "Tyre Sizes in Lahore",
      h1: "Browse tyres by complete size.",
      canonical: "/tyre-sizes",
      description:
        "Browse commonly requested tyre sizes and compare current brand options in Lahore. Final vehicle fitment and availability are confirmed before supply.",
    },
  }[focus] || null;
  const activeCopy = pageCopy || {
    title: "Find Tyres by Size, Brand or Vehicle",
    h1: "Find the right tyres for your car.",
    canonical: "/tyres",
    description:
      "Find tyre options by size, brand or vehicle. Wheels & Wheels Lahore checks current availability, market rates and safe fitment before supply.",
  };
  const faq = [
    {
      question: "Where can I find my tyre size?",
      answer: "The size is printed on the tyre sidewall in a format such as 195/65 R15. You can also share a clear sidewall photo with our team.",
    },
    {
      question: "Can I choose a tyre using only the rim diameter?",
      answer: "No. Width, profile, rim diameter, load rating and vehicle requirements all matter. Wheels & Wheels confirms the complete fitment before supply.",
    },
    {
      question: "Are website rates fixed?",
      answer: "Tyre import costs and market availability change. Ask our team for the current rate and confirmed stock for your required size and brand.",
    },
  ];

  const submitFitment = (event) => {
    event.preventDefault();
    trackLeadEvent("size_search", {
      contextType: "tyre_size",
      contextValue: `${fitment.width}/${fitment.profile} R${fitment.rim}`,
    });
    const match = sizes.find(
      (item) =>
        String(item.width) === fitment.width &&
        String(item.aspectRatio) === fitment.profile &&
        String(item.rim) === fitment.rim,
    );
    if (match) navigate(match.path || `/tyre-sizes/${match.slug}`);
  };

  const selectWidth = (width) => {
    const next = sizes.find(
      (item) => item.aspectRatio >= 35 && String(item.width) === width,
    );
    if (!next) return;
    setFitment({ width, profile: String(next.aspectRatio), rim: String(next.rim) });
  };

  const selectProfile = (profile) => {
    const next = sizes.find(
      (item) => String(item.width) === fitment.width && String(item.aspectRatio) === profile,
    );
    if (!next) return;
    setFitment({ width: fitment.width, profile, rim: String(next.rim) });
  };

  return (
    <main className="growth-page discovery-hub">
      <SeoHead
        title={activeCopy.title}
        description={activeCopy.description}
        canonical={activeCopy.canonical}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: activeCopy.title, path: activeCopy.canonical },
        ]}
        faq={faq}
      />

      <nav className="growth-breadcrumbs breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li><span aria-current="page">{activeCopy.title}</span></li>
        </ol>
      </nav>

      <header className="growth-hero discovery-hero">
        <div className="growth-hero-copy">
          <p className="eyebrow">SIZE · BRAND · VEHICLE</p>
          <h1>{activeCopy.h1}</h1>
          <p className="growth-lede">
            Start with the complete size on your tyre sidewall, browse trusted brands, or check common vehicle fitments. Our team verifies the final match before supply.
          </p>
          <div className="growth-actions">
            <a
              className="primary"
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Wheels & Wheels, please help me find tyres. My vehicle and current tyre size are: ")}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp aria-hidden="true" /> Ask on official WhatsApp
            </a>
            <a className="growth-call-button" href="tel:+923214229594">
              <FaPhoneAlt aria-hidden="true" /> Call sales
            </a>
          </div>
        </div>

        <form className="discovery-finder" onSubmit={submitFitment} aria-labelledby="finder-title">
          <div>
            <FaSearch aria-hidden="true" />
            <div>
              <p className="eyebrow">FIND BY TYRE SIZE</p>
              <h2 id="finder-title">Enter your sidewall size</h2>
            </div>
          </div>
          <label>
            Width
            <select
              value={fitment.width}
              onChange={(event) => selectWidth(event.target.value)}
            >
              {widthOptions.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Profile
            <select
              value={fitment.profile}
              onChange={(event) => selectProfile(event.target.value)}
            >
              {profileOptions.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Rim diameter
            <select
              value={fitment.rim}
              onChange={(event) => setFitment({ ...fitment, rim: event.target.value })}
            >
              {rimOptions.map((value) => <option key={value} value={value}>{value} inch</option>)}
            </select>
          </label>
          <button className="primary" type="submit">
            Show tyre options <FaChevronRight aria-hidden="true" />
          </button>
          <p>Example: 195 width · 65 profile · R15 rim. Check all three values on the sidewall.</p>
        </form>
      </header>

      {(focus === "all" || focus === "brand") && (
        <DiscoverySection
          id="discover-brands"
          eyebrow="PREMIUM · JAPANESE · CHINESE"
          title="Explore tyre brands"
          intro="Compare brand positioning, commonly requested models and current sourcing options."
          items={focus === "brand" ? brands : brands.slice(0, 9)}
          type="brand"
          allHref={focus === "all" ? "/brands" : undefined}
          allLabel="View all brands"
        />
      )}

      {(focus === "all" || focus === "vehicle") && (
        <DiscoverySection
          id="discover-vehicles"
          eyebrow="START WITH YOUR CAR"
          title="Find tyres by vehicle"
          intro="Common sizes are a starting point only. Always verify the model year, variant and existing sidewall size."
          items={focus === "vehicle" ? vehicles : vehicles.slice(0, 8)}
          type="vehicle"
          allHref={focus === "all" ? "/vehicles" : undefined}
          allLabel="View all vehicles"
        />
      )}

      {focus === "size" && <TyreSizeDirectory hubs={rimHubs} />}

      {focus === "all" && (
        <DiscoverySection
          id="discover-sizes"
          eyebrow="POPULAR FITMENTS"
          title="Browse tyres by size"
          intro="Use an exact width, profile and rim diameter to narrow the options available for quotation."
          items={sizes.slice(0, 12)}
          type="size"
          allHref="/tyre-sizes"
          allLabel="View all sizes"
        />
      )}

      <section className="discovery-help section" aria-labelledby="discovery-help-title">
        <div>
          <FaCar aria-hidden="true" />
          <h2 id="discovery-help-title">Do not know your tyre size?</h2>
          <p>Send a clear sidewall photo plus your vehicle make, model and year.</p>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
            Send a photo on WhatsApp <FaChevronRight aria-hidden="true" />
          </a>
        </div>
        <div>
          <FaTags aria-hidden="true" />
          <h2>Need a current rate?</h2>
          <p>Tell us the exact size and preferred origin or brand for a live quotation.</p>
          <Link to="/quote">Request a quotation <FaChevronRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="growth-faq section" aria-labelledby="discovery-faq-title">
        <p className="eyebrow">FITMENT BASICS</p>
        <h2 id="discovery-faq-title">Common questions before buying</h2>
        <div className="growth-faq-list">
          {faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

export function BrandsHub() {
  return <DiscoveryHub focus="brand" />;
}

export function VehiclesHub() {
  return <DiscoveryHub focus="vehicle" />;
}

export function TyreSizesHub() {
  return <DiscoveryHub focus="size" />;
}
