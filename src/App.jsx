import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  FaBars,
  FaBookOpen,
  FaCheck,
  FaChevronRight,
  FaFacebookF,
  FaInstagram,
  FaHome,
  FaMapMarkerAlt,
  FaMinus,
  FaPhoneAlt,
  FaPlus,
  FaSearch,
  FaShoppingBag,
  FaStar,
  FaTimes,
  FaTruck,
  FaWhatsapp,
} from "react-icons/fa";
import PRODUCTS, { formatPrice } from "./Data/productsData";
import TYRE_SIZE_MANIFEST, { findTyreSize } from "./Data/tyreSizeManifest.js";
import { api, apiWithMeta } from "./api";
import ServiceDetail from "./components/ServiceDetail.jsx";
import FloatingWhatsApp from "./components/FloatingWhatsApp.jsx";
import SeoHead from "./components/growth/SeoHead.jsx";

const DiscoveryHub = lazy(() => import("./components/growth/DiscoveryHub.jsx"));
const BrandsHub = lazy(() =>
  import("./components/growth/DiscoveryHub.jsx").then((module) => ({ default: module.BrandsHub })),
);
const VehiclesHub = lazy(() =>
  import("./components/growth/DiscoveryHub.jsx").then((module) => ({ default: module.VehiclesHub })),
);
const TyreSizesHub = lazy(() =>
  import("./components/growth/DiscoveryHub.jsx").then((module) => ({ default: module.TyreSizesHub })),
);
const GuidesHub = lazy(() => import("./components/growth/GuidesHub.jsx"));
const GuideTopicPage = lazy(() => import("./components/growth/GuideTopicPage.jsx"));
const GuideArticle = lazy(() => import("./components/growth/GuideArticle.jsx"));
const CommercialLandingPage = lazy(() =>
  import("./components/growth/CommercialLandingPage.jsx"),
);
const BrandLandingPage = lazy(() =>
  import("./components/growth/SeoLandingPage.jsx").then((module) => ({ default: module.BrandLandingPage })),
);
const VehicleLandingPage = lazy(() =>
  import("./components/growth/SeoLandingPage.jsx").then((module) => ({ default: module.VehicleLandingPage })),
);
const SizeLandingPage = lazy(() =>
  import("./components/growth/SeoLandingPage.jsx").then((module) => ({ default: module.SizeLandingPage })),
);
const AboutPage = lazy(() =>
  import("./components/growth/BusinessPages.jsx").then((module) => ({ default: module.AboutPage })),
);
const ContactPage = lazy(() =>
  import("./components/growth/BusinessPages.jsx").then((module) => ({ default: module.ContactPage })),
);
const ServicesPage = lazy(() =>
  import("./components/growth/BusinessPages.jsx").then((module) => ({ default: module.ServicesPage })),
);
const LahoreTyreShopPage = lazy(() =>
  import("./components/growth/BusinessPages.jsx").then((module) => ({ default: module.LahoreTyreShopPage })),
);
const FAQPage = lazy(() =>
  import("./components/growth/BusinessPages.jsx").then((module) => ({ default: module.FAQPage })),
);

const WHATSAPP = "923390045836";
const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://wheelsandwheels.vercel.app"
).replace(/\/$/, "");
const RFQ_PAGE_SIZE = 50;
const ONLINE_CHECKOUT_ENABLED = false;
const CUSTOMER_PORTAL_ENABLED = false;
const whatsappNumberFor = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("0092")) return digits.slice(2);
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  return digits;
};
const BRAND_PRIORITY = [
  "Michelin", "Pirelli", "Continental", "Dunlop", "Yokohama",
  "Bridgestone", "Toyo", "Nitto", "Falken", "APLUS", "Sailun",
  "Linglong", "Triangle", "RoadX",
];
const brandPriority = (brand) => {
  const index = BRAND_PRIORITY.indexOf(brand);
  return index === -1 ? BRAND_PRIORITY.length : index;
};
const TYRE_PROFILE_GUIDE = Object.fromEntries(
  Array.from({ length: 13 }, (_, index) => index + 12).map((rim) => [
    rim,
    [...new Set(
      TYRE_SIZE_MANIFEST
        .filter((item) => item.rim === rim)
        .map((item) => item.profile),
    )].sort((a, b) => a - b),
  ]),
);
const SOURCING_BRANDS = [
  { brand: "Michelin", group: "premium", origin: "Other", badge: "Premium · France" },
  { brand: "Pirelli", group: "premium", origin: "Other", badge: "Premium · Italy" },
  { brand: "Continental", group: "premium", origin: "Other", badge: "Premium · Germany" },
  { brand: "Dunlop", group: "japanese", origin: "Japan", badge: "Japanese" },
  { brand: "Yokohama", group: "japanese", origin: "Japan", badge: "Japanese" },
  { brand: "Bridgestone", group: "japanese", origin: "Japan", badge: "Japanese" },
  { brand: "Toyo", group: "japanese", origin: "Japan", badge: "Japanese" },
  { brand: "Falken", group: "japanese", origin: "Japan", badge: "Japanese" },
  { brand: "APLUS", group: "chinese", origin: "China", badge: "Chinese value" },
  { brand: "Sailun", group: "chinese", origin: "China", badge: "Chinese value" },
  { brand: "Linglong", group: "chinese", origin: "China", badge: "Chinese value" },
  { brand: "Triangle", group: "chinese", origin: "China", badge: "Chinese value" },
  { brand: "RoadX", group: "chinese", origin: "China", badge: "Chinese value" },
];

function RouteEffects() {
  const { pathname, hash } = useLocation();
  const previousRoute = useRef(null);
  useEffect(() => {
    const root = document.documentElement;
    const route = `${pathname}${hash}`;

    if (previousRoute.current === null) {
      previousRoute.current = route;
      if (hash) {
        window.requestAnimationFrame(() => {
          document.querySelector(hash)?.scrollIntoView({ block: "start" });
        });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
      return undefined;
    }

    if (previousRoute.current === route) return undefined;
    previousRoute.current = route;
    root.classList.remove("route-enter");
    // Force a reflow so the animation restarts even between similar pages.
    void root.offsetWidth;
    root.classList.add("route-enter");
    if (hash) {
      window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ block: "start" });
      });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    const timer = window.setTimeout(
      () => root.classList.remove("route-enter"),
      800,
    );
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
  return null;
}

function ProductCard({ product, add }) {
  const productDestination = product.onRequest
    ? `/quote?tyreSize=${encodeURIComponent(product.size)}&message=${encodeURIComponent(`Please quote ${product.brand} options for ${product.size}.`)}`
    : `/product/${product.slug || product._id}`;
  return (
    <article className="product-card">
      <div className="product-image">
        <Link to={productDestination}>
          <img src={product.image} alt={product.title} loading="lazy" decoding="async" />
        </Link>
        {product.badge && <span className="pill">{product.badge}</span>}
        <button
          className="quick-add"
          onClick={() => add(product)}
          aria-label={`Add ${product.title} to quote list`}
        >
          <FaPlus />
        </button>
      </div>
      <div className="product-copy">
        <div className="eyebrow">
          {product.brand} · {product.category}
        </div>
        <h3>
          <Link to={productDestination}>{product.title}</Link>
        </h3>
        <div className="spec-row">
          <span>{product.size}</span>
          <span>{product.vehicle}</span>
        </div>
        <div className="rating">
          {product.onRequest ? (
            <><FaCheck /> <span>Availability and exact pattern confirmed on request</span></>
          ) : (
            <><FaCheck /> <span>Catalogue reference · Confirm current availability</span></>
          )}
        </div>
        <div className="price-row">
          <span className="rate-label"><small>CURRENT PRICE</small><strong>Ask for rate</strong></span>
          <span className="rate-live">Live availability</span>
        </div>
        <Link
          className="rate-link"
          to={`/quote?tyreSize=${encodeURIComponent(product.size || "")}&message=${encodeURIComponent(`Please quote the current rate and availability for ${product.title}.`)}`}
        >
          Ask current rate <FaChevronRight />
        </Link>
        <button className="add-button" onClick={() => add(product)}>
          {product.onRequest ? "Ask about this option" : "Save selection"}{" "}<FaChevronRight />
        </button>
      </div>
    </article>
  );
}

function SizeCatalogue({ type, diameter = "", width = "", profile = "" }) {
  const [selected, setSelected] = useState(null);
  const isRim = type === "rims";
  const sizes = diameter
    ? [Number(diameter)]
    : Array.from({ length: 13 }, (_, index) => index + 12);
  const requestedFitment = isRim
    ? diameter && `${diameter}-inch rims`
    : diameter && `${width || "Any width"}/${profile || "Any profile"} R${diameter}`;
  useEffect(() => {
    if (!selected) return undefined;
    const close = (event) => event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);
  return (
    <section className="size-catalogue" aria-labelledby={`${type}-size-title`}>
      <div className="size-catalogue-head">
        <div><div className="eyebrow">{requestedFitment ? "YOUR SELECTED FITMENT" : "12–24 INCH RANGE"}</div><h2 id={`${type}-size-title`}>{requestedFitment || (isRim ? "Rims in every diameter." : "Tyres by rim size.")}</h2></div>
        <p>{requestedFitment ? "This diameter matches your selection. Ask our team for the current rate and final vehicle fitment confirmation." : isRim ? "Choose a diameter. PCD, offset, width and hub fitment are confirmed for your vehicle before supply." : "Choose your rim diameter to see commonly sourced profiles. Width, load rating and final fitment are confirmed for your vehicle."}</p>
      </div>
      <div className="diameter-grid">
        {sizes.map((diameter) => (
          <button key={diameter} className="diameter-card" onClick={() => setSelected({ diameter, profiles: TYRE_PROFILE_GUIDE[diameter] })} aria-label={`Ask about ${diameter} inch ${isRim ? "rims" : "tyres"}`}>
            <span className="diameter-image"><img src={isRim ? "/Rim1.jpg" : "/tyre.jpg"} alt={`${diameter} inch ${isRim ? "alloy rim" : "tyre"}`} loading="lazy" decoding="async" /><i>ASK US</i></span>
            <span className="diameter-copy"><small>{isRim ? "ALLOY RIM" : "TYRE FITMENT"}</small><strong>{diameter}<sup>″</sup></strong>{!isRim && <em>{TYRE_PROFILE_GUIDE[diameter].length ? `Published profiles ${TYRE_PROFILE_GUIDE[diameter].join(" · ")}` : "Send your complete tyre size"}</em>}<b>Check current options <FaChevronRight /></b></span>
          </button>
        ))}
      </div>
      <p className="fitment-note"><FaCheck /> We can source additional width/profile combinations. Never select a tyre by rim diameter alone—our team verifies the complete size and vehicle specification.</p>
      {selected && (
        <div className="size-contact-modal" role="dialog" aria-modal="true" aria-labelledby="size-contact-title" onClick={() => setSelected(null)}>
          <div className="size-contact-card" onClick={(event) => event.stopPropagation()}>
            <button className="size-modal-close" onClick={() => setSelected(null)} aria-label="Close contact options"><FaTimes /></button>
            <div className="size-modal-visual"><img src={isRim ? "/Rim1.jpg" : "/tyre.jpg"} alt="" /><span>{selected.diameter}″</span></div>
            <div className="eyebrow">AVAILABLE ON REQUEST</div>
            <h2 id="size-contact-title">Ask about {selected.diameter}-inch {isRim ? "rims" : "tyres"}.</h2>
            {!isRim && <p className="modal-profiles">{selected.profiles.length ? <><b>Published profiles:</b> {selected.profiles.join(", ")}. </> : null}Share your full tyre size or vehicle model for an exact match.</p>}
            {isRim && <p className="modal-profiles">Share your vehicle make, model and year so we can verify PCD, offset, width and hub size.</p>}
            <div className="size-contact-actions">
              <a href="tel:+923214229594"><FaPhoneAlt /> Call 0321 4229594</a>
              <a href="tel:+923390045836"><FaPhoneAlt /> Call 0339 0045836</a>
              <a className="modal-whatsapp" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Wheels & Wheels, please share current options and rates for ${selected.diameter}-inch ${isRim ? "rims" : "tyres"}.`)}`} target="_blank" rel="noreferrer"><FaWhatsapp /> WhatsApp 0339 0045836</a>
            </div>
            <small className="modal-assurance">Current rate · Live availability · Fitment confirmed by our team</small>
          </div>
        </div>
      )}
    </section>
  );
}

function Header({ count, openCart }) {
  const [open, setOpen] = useState(false);
  const closeNavigation = () => {
    setOpen(false);
    document.querySelectorAll(".nav-mega[open]").forEach((menu) => {
      menu.removeAttribute("open");
    });
  };
  const keepOneMegaMenuOpen = (event) => {
    if (!event.currentTarget.open) return;
    document.querySelectorAll(".nav-mega[open]").forEach((menu) => {
      if (menu !== event.currentTarget) menu.removeAttribute("open");
    });
  };
  useEffect(() => {
    const closeAllMenus = () => {
      setOpen(false);
      document.querySelectorAll(".nav-mega[open]").forEach((menu) => {
        menu.removeAttribute("open");
      });
    };
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".site-header")) closeAllMenus();
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") closeAllMenus();
    };
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);
  return (
    <>
      <div className="announcement">
        <span className="announcement-offer">
          Lahore tyre shop · Nationwide tyre and rim enquiries
        </span>
        <div className="announcement-contacts">
          <a href="tel:+923214229594" aria-label="Call sales on 0321 4229594">
            <FaPhoneAlt />
            <small>Call</small>
            <b>0321 4229594</b>
          </a>
          <i aria-hidden="true" />
          <div className="official-contact">
            <a href="tel:+923390045836" aria-label="Call 0339 0045836">
              <FaPhoneAlt />
              <small>Call</small>
              <b>0339 0045836</b>
            </a>
            <a
              className="official-whatsapp"
              href="https://wa.me/923390045836"
              target="_blank"
              rel="noreferrer"
              aria-label="Official website WhatsApp and RFQ channel"
            >
              <FaWhatsapp />
              <span>Official WhatsApp · RFQ</span>
            </a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <Link className="logo" to="/" aria-label="Wheels & Wheels home">
          <img src="/wheels-and-wheels-logo-600.png" alt="Wheels and Wheels" width="600" height="203" />
        </Link>
        <nav className={open ? "nav-open" : ""} aria-label="Main navigation">
          <details className="nav-mega" onToggle={keepOneMegaMenuOpen}>
            <summary>Tyres</summary>
            <div className="mega-panel">
              <section>
                <small>SHOP BY TYPE</small>
                <Link to="/tyres/japanese" onClick={closeNavigation}>Japanese tyres</Link>
                <Link to="/tyres/premium" onClick={closeNavigation}>Premium tyres</Link>
                <Link to="/tyres/chinese" onClick={closeNavigation}>Chinese tyres</Link>
                <Link to="/tyre-sizes" onClick={closeNavigation}>All 12–24 inch tyre sizes</Link>
              </section>
              <section>
                <small>TOP BRANDS</small>
                <Link to="/brands/michelin" onClick={closeNavigation}>Michelin</Link>
                <Link to="/brands/pirelli" onClick={closeNavigation}>Pirelli</Link>
                <Link to="/brands/continental" onClick={closeNavigation}>Continental</Link>
                <Link to="/brands/bridgestone" onClick={closeNavigation}>Bridgestone</Link>
              </section>
              <section>
                <small>POPULAR SIZES</small>
                <Link to="/tyre-sizes/195-65-r15" onClick={closeNavigation}>195/65 R15</Link>
                <Link to="/tyre-sizes/205-55-r16" onClick={closeNavigation}>205/55 R16</Link>
                <Link to="/tyre-sizes/185-65-r15" onClick={closeNavigation}>185/65 R15</Link>
                <Link to="/guides/how-to-choose-the-right-tyre-size-pakistan" onClick={closeNavigation}>How to read tyre size</Link>
              </section>
            </div>
          </details>
          <details className="nav-mega" onToggle={keepOneMegaMenuOpen}>
            <summary>Find by car</summary>
            <div className="mega-panel vehicle-panel">
              <section><small>SUZUKI</small><Link to="/vehicles/suzuki-alto" onClick={closeNavigation}>Alto</Link><Link to="/vehicles/suzuki-cultus" onClick={closeNavigation}>Cultus</Link><Link to="/vehicles/suzuki-wagon-r" onClick={closeNavigation}>Wagon R</Link></section>
              <section><small>HONDA</small><Link to="/vehicles/honda-city" onClick={closeNavigation}>City</Link><Link to="/vehicles/honda-civic" onClick={closeNavigation}>Civic</Link><Link to="/vehicles/honda-br-v" onClick={closeNavigation}>BR-V</Link></section>
              <section><small>TOYOTA</small><Link to="/vehicles/toyota-corolla" onClick={closeNavigation}>Corolla</Link><Link to="/vehicles/toyota-yaris" onClick={closeNavigation}>Yaris</Link><Link to="/vehicles/toyota-fortuner" onClick={closeNavigation}>Fortuner</Link></section>
            </div>
          </details>
          <Link to="/rims" onClick={closeNavigation}>Rims</Link>
          <details className="nav-mega" onToggle={keepOneMegaMenuOpen}>
            <summary>Services</summary>
            <div className="mega-panel compact-panel">
              <section><small>WHEEL CARE</small><Link to="/services" onClick={closeNavigation}>All services</Link><Link to="/services/tyre-installation" onClick={closeNavigation}>Tyre installation</Link><Link to="/services/wheel-balancing" onClick={closeNavigation}>Wheel balancing</Link><Link to="/services/wheel-alignment" onClick={closeNavigation}>Wheel alignment</Link></section>
            </div>
          </details>
          <Link to="/guides" onClick={closeNavigation}>Blog</Link>
          <details className="nav-mega" onToggle={keepOneMegaMenuOpen}>
            <summary>More</summary>
            <div className="mega-panel compact-panel">
              <section><small>HELP & COMPANY</small><Link to="/about" onClick={closeNavigation}>About us</Link><Link to="/lahore-tyre-shop" onClick={closeNavigation}>Lahore shop</Link><Link to="/contact" onClick={closeNavigation}>Contact & location</Link><Link to="/faq" onClick={closeNavigation}>Questions & answers</Link></section>
            </div>
          </details>
          <Link className="nav-quote" to="/quote" onClick={closeNavigation}>Get current rate</Link>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button mobile-menu"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
          <Link className="search-link" to="/shop" aria-label="Search products">
            <FaSearch />
          </Link>
          <button className="cart-button" onClick={openCart} aria-label={`Open selection, ${count} items`}>
            <FaShoppingBag />
            <span>Quote list</span>
            <b>{count}</b>
          </button>
        </div>
      </header>
    </>
  );
}

function MobileNavigation({ count, openCart }) {
  const { pathname } = useLocation();
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
      <Link className={pathname === "/" ? "active" : ""} to="/">
        <FaHome /><span>Home</span>
      </Link>
      <Link className={pathname.startsWith("/tyre-sizes") || pathname.startsWith("/shop") || pathname.startsWith("/product") ? "active" : ""} to="/tyre-sizes">
        <FaSearch /><span>Tyres</span>
      </Link>
      <Link className={pathname.startsWith("/guides") ? "active" : ""} to="/guides">
        <FaBookOpen /><span>Blog</span>
      </Link>
      <Link className={pathname === "/quote" ? "active" : ""} to="/quote">
        <FaPhoneAlt /><span>Get rate</span>
      </Link>
      <button type="button" onClick={openCart} aria-label={`Open saved selection, ${count} items`}>
        <span className="mobile-cart-icon"><FaShoppingBag />{count > 0 && <b>{count}</b>}</span>
        <span>Selection</span>
      </button>
    </nav>
  );
}

function Home({ add, products }) {
  const navigate = useNavigate();
  const [fitment, setFitment] = useState({
    width: "205",
    profile: "55",
    rim: "16",
  });
  const widthOptions = [...new Set(TYRE_SIZE_MANIFEST.map((item) => item.width))];
  const profileOptions = [...new Set(
    TYRE_SIZE_MANIFEST
      .filter((item) => String(item.width) === fitment.width)
      .map((item) => item.profile),
  )].sort((a, b) => a - b);
  const rimOptions = [...new Set(
    TYRE_SIZE_MANIFEST
      .filter(
        (item) =>
          String(item.width) === fitment.width && String(item.profile) === fitment.profile,
      )
      .map((item) => item.rim),
  )].sort((a, b) => a - b);
  const selectHomeWidth = (width) => {
    const next = TYRE_SIZE_MANIFEST.find((item) => String(item.width) === width);
    if (next) setFitment({ width, profile: String(next.profile), rim: String(next.rim) });
  };
  const selectHomeProfile = (profile) => {
    const next = TYRE_SIZE_MANIFEST.find(
      (item) => String(item.width) === fitment.width && String(item.profile) === profile,
    );
    if (next) setFitment({ width: fitment.width, profile, rim: String(next.rim) });
  };
  const openSelectedSize = () => {
    const match = findTyreSize(fitment);
    navigate(match?.path || "/tyre-sizes");
  };
  return (
    <main>
      <SeoHead
        title="Tyres and Alloy Rims in Lahore"
        description="Find premium, Japanese and Chinese tyres plus 12–24 inch alloy rims in Lahore. Search by tyre size, vehicle or brand and ask Wheels & Wheels for current rates and verified fitment."
        canonical="/"
      />
      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow light">TYRES &amp; ALLOY RIMS IN LAHORE</div>
          <h1>
            Find the right
            <br />
            <em>tyres.</em>
          </h1>
          <p>
            Compare premium, Japanese and Chinese tyre options by size or car,
            then ask our Lahore team for current rates and verified fitment.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => navigate("/tyre-sizes")}>
              Find tyres by size <FaChevronRight />
            </button>
            <a
              className="secondary"
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp /> Ask an expert
            </a>
          </div>
          <div className="hero-proof">
            <span>
              <b>12–24″</b> tyre and rim range
            </span>
            <span>
              <b>Vehicle-first</b> fitment advice
            </span>
            <span>
              <b>Direct</b> call and WhatsApp support
            </span>
          </div>
        </div>
        <div className="fitment-box">
          <div className="fitment-head">
            <span>01</span>
            <div>
              <b>Find your perfect fit</b>
              <small>Tyres and rims from 12 to 24 inches</small>
            </div>
          </div>
          <div className="fitment-fields">
            <label>
              WIDTH
              <select
                value={fitment.width}
                onChange={(event) => selectHomeWidth(event.target.value)}
              >
                {widthOptions.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              PROFILE
              <select
                value={fitment.profile}
                onChange={(event) => selectHomeProfile(event.target.value)}
              >
                {profileOptions.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              RIM
              <select
                value={fitment.rim}
                onChange={(event) =>
                  setFitment({ ...fitment, rim: event.target.value })
                }
              >
                {rimOptions.map((value) => (
                  <option key={value} value={value}>
                    {value} inch
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            onClick={openSelectedSize}
          >
            Show matching tyres <FaChevronRight />
          </button>
        </div>
      </section>
      <section className="trust-strip">
        <span>
          <FaTruck />
          <b>Delivery available</b>
          <small>Confirm timing with our team</small>
        </span>
        <span>
          <FaCheck />
          <b>Clear product guidance</b>
          <small>Brand, date and fitment checks</small>
        </span>
        <span>
          <FaStar />
          <b>Expert fitment</b>
          <small>Precision installation</small>
        </span>
        <span>
          <FaWhatsapp />
          <b>Real support</b>
          <small>Talk to a wheel expert</small>
        </span>
      </section>
      <section className="home-growth section" aria-labelledby="home-find-title">
        <div className="section-heading">
          <div>
            <div className="eyebrow">THE FASTER WAY TO FIND A MATCH</div>
            <h2 id="home-find-title">Start with what you know.</h2>
            <p>Use a complete tyre size, your vehicle, or a preferred brand. We confirm the final fitment and current market availability before supply.</p>
          </div>
          <Link to="/tyres">Open tyre finder <FaChevronRight /></Link>
        </div>
        <div className="home-growth-grid">
          <Link to="/tyre-sizes"><span>01</span><small>EXACT FITMENT</small><h3>Find tyres by size</h3><p>Start with a sidewall code such as 195/65 R15.</p><b>Browse popular sizes <FaChevronRight /></b></Link>
          <Link to="/vehicles"><span>02</span><small>MAKE &amp; MODEL</small><h3>Find tyres by car</h3><p>Review common sizes, then verify year and variant.</p><b>Choose your vehicle <FaChevronRight /></b></Link>
          <Link to="/brands"><span>03</span><small>COMPARE OPTIONS</small><h3>Find tyres by brand</h3><p>Explore premium, Japanese and Chinese choices.</p><b>Compare tyre brands <FaChevronRight /></b></Link>
          <Link to="/guides"><span>04</span><small>BUY WITH CONTEXT</small><h3>Read our tyre blog</h3><p>Learn about size codes, tyre age, rims and road use.</p><b>Visit the blog <FaChevronRight /></b></Link>
        </div>
        <nav className="popular-seo-links" aria-label="Popular tyre searches">
          <strong>Popular:</strong>
          <Link to="/tyre-sizes/195-65-r15">195/65 R15</Link>
          <Link to="/tyre-sizes/205-55-r16">205/55 R16</Link>
          <Link to="/vehicles/honda-city">Honda City tyres</Link>
          <Link to="/vehicles/toyota-corolla">Toyota Corolla tyres</Link>
          <Link to="/brands/michelin">Michelin tyres</Link>
          <Link to="/brands/bridgestone">Bridgestone tyres</Link>
        </nav>
      </section>
      <section className="section featured">
        <div className="section-heading">
          <div>
            <div className="eyebrow">HANDPICKED FOR YOU</div>
            <h2>Built for the road ahead.</h2>
          </div>
          <Link to="/shop">
            View full collection <FaChevronRight />
          </Link>
        </div>
        <div className="product-grid">
          {[...products]
            .sort((a, b) => brandPriority(a.brand) - brandPriority(b.brand))
            .filter(
              (product, index, ordered) =>
                ordered.findIndex((item) => item.brand === product.brand) ===
                index,
            )
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p._id} product={p} add={add} />
            ))}
        </div>
      </section>
      <section className="category-section">
        <Link
          to="/tyres/japanese"
          className="category japan-cat"
        >
          <span>01</span>
          <div>
            <small>COMFORT. CONTROL. HERITAGE.</small>
            <h2>Japanese tyres</h2>
            <p>Bridgestone, Yokohama, Dunlop, Toyo and Falken options by exact fitment.</p>
            <b>
              Explore Japanese tyres <FaChevronRight />
            </b>
          </div>
        </Link>
        <Link
          to="/tyres/premium"
          className="category premium-cat"
        >
          <span>02</span>
          <div>
            <small>MICHELIN. PIRELLI. CONTINENTAL.</small>
            <h2>Premium tyres</h2>
            <p>Compare premium patterns by complete size, ratings and real driving priorities.</p>
            <b>
              Explore premium tyres <FaChevronRight />
            </b>
          </div>
        </Link>
        <Link
          to="/tyres/chinese"
          className="category china-cat"
        >
          <span>03</span>
          <div>
            <small>VALUE. RANGE. AVAILABILITY.</small>
            <h2>Chinese tyres</h2>
            <p>Ask for APLUS, Sailun, Linglong, Triangle and RoadX in your exact size.</p>
            <b>
              Explore Chinese tyres <FaChevronRight />
            </b>
          </div>
        </Link>
        <Link to="/rims" className="category rim-cat">
          <span>04</span>
          <div>
            <small>12–24 INCH FITMENTS.</small>
            <h2>Alloy rims</h2>
            <p>PCD, offset and hub fitment verified before every order.</p>
            <b>
              Explore rims <FaChevronRight />
            </b>
          </div>
        </Link>
      </section>
      <section className="services section" id="services">
        <div className="eyebrow">THE COMPLETE WHEEL CARE</div>
        <h2>More than a tyre shop.</h2>
        <div className="service-grid">
          <Link className="service-card" to="/services/tyre-installation">
            <b>01</b>
            <img src="/tyreinstallation.jpg" alt="Professional tyre installation in Lahore" loading="lazy" decoding="async" />
            <h3>Tyre installation</h3>
            <p>Safe, careful fitting with new valves and exact pressure.</p>
            <strong>
              Learn why it matters <FaChevronRight />
            </strong>
          </Link>
          <Link className="service-card" to="/services/wheel-balancing">
            <b>02</b>
            <img src="/wheelbalancing.jpg" alt="Computerised wheel balancing service" loading="lazy" decoding="async" />
            <h3>Computerised balancing</h3>
            <p>Smoother driving and even tread wear at every speed.</p>
            <strong>
              Learn why it matters <FaChevronRight />
            </strong>
          </Link>
          <Link className="service-card" to="/services/wheel-alignment">
            <b>03</b>
            <img src="/wheelalignment.jpeg" alt="Wheel alignment service in Lahore" loading="lazy" decoding="async" />
            <h3>Wheel alignment</h3>
            <p>Precision geometry for better control and tyre life.</p>
            <strong>
              Learn why it matters <FaChevronRight />
            </strong>
          </Link>
        </div>
      </section>
      <section className="cta">
        <div>
          <small>NOT SURE WHAT FITS?</small>
          <h2>Let’s build your perfect setup.</h2>
          <p>
            Send us your car model and budget. Our fitment experts will
            recommend the right options.
          </p>
        </div>
        <a
          href={`https://wa.me/${WHATSAPP}?text=Hi%20Wheels%20%26%20Wheels%2C%20I%20need%20help%20choosing%20a%20setup.`}
          target="_blank"
          rel="noreferrer"
        >
          <FaWhatsapp /> Chat on WhatsApp
        </a>
      </section>
    </main>
  );
}

function Shop({ add, products, loading }) {
  const [params] = useSearchParams();
  const requestedSize = params.get("size") || "";
  const requestedParts = requestedSize.match(/(\d{3})\/(\d{2})\s*R(\d{2})/i);
  const requestedCategory = params.get("category");
  const initial =
    requestedCategory === "Tyres"
      ? "All Tyres"
      : requestedCategory === "Chinese Tyres"
        ? "Chinese Brands"
        : requestedCategory === "Japanese Tyres"
          ? "Japanese Brands"
          : requestedCategory || "All Tyres";
  const [size, setSize] = useState(requestedSize);
  const [category, setCategory] = useState(initial);
  const [rim, setRim] = useState(requestedParts?.[3] || "");
  const [width, setWidth] = useState(requestedParts?.[1] || "");
  const [profile, setProfile] = useState(requestedParts?.[2] || "");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const widthOptions = [...new Set(TYRE_SIZE_MANIFEST.map((item) => item.width))];
  const profileOptions = [...new Set(
    TYRE_SIZE_MANIFEST
      .filter((item) => !width || String(item.width) === width)
      .map((item) => item.profile),
  )].sort((a, b) => a - b);
  const tyreRimOptions = [...new Set(
    TYRE_SIZE_MANIFEST
      .filter(
        (item) =>
          (!width || String(item.width) === width) &&
          (!profile || String(item.profile) === profile),
      )
      .map((item) => item.rim),
  )].sort((a, b) => a - b);
  const selectedManifestSize = findTyreSize({ width, profile, rim });
  const inventoryItems = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (category === "All" ||
              (category === "All Tyres" && p.category === "Tyres") ||
              (category === "Premium & Japanese" &&
                p.category === "Tyres" &&
                ["Other", "Japan"].includes(p.origin)) ||
              (category === "Premium Brands" &&
                p.category === "Tyres" &&
                ["Michelin", "Pirelli", "Continental"].includes(p.brand)) ||
              (category === "Chinese Brands" &&
                p.category === "Tyres" &&
                p.origin === "China") ||
              (category === "Japanese Brands" &&
                p.category === "Tyres" &&
                p.origin === "Japan") ||
              (category === "Rims" && p.category === "Rims")) &&
            (!size || p.size === size) &&
            (!rim || Number(p.rimDiameter) === Number(rim)) &&
            (!width || Number(p.width) === Number(width)) &&
            (!profile || Number(p.profile) === Number(profile)) &&
            `${p.title} ${p.brand} ${p.size}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "brand"
            ? a.brand.localeCompare(b.brand)
            : brandPriority(a.brand) - brandPriority(b.brand),
        ),
    [category, query, sort, products, size, rim, width, profile],
  );
  const sourcedItems = useMemo(() => {
    if (category === "Rims" || !width || !profile || !rim) return [];
    const requestedSize = `${width}/${profile} R${rim}`;
    const brands = SOURCING_BRANDS.filter(({ group }) => {
      if (category === "Premium Brands") return group === "premium";
      if (category === "Japanese Brands") return group === "japanese";
      if (category === "Chinese Brands") return group === "chinese";
      if (category === "Premium & Japanese")
        return group === "premium" || group === "japanese";
      return true;
    });
    return brands
      .filter(({ brand }) =>
        `${brand} ${requestedSize}`.toLowerCase().includes(query.toLowerCase()),
      )
      .map(({ brand, origin, badge }) => ({
        _id: `request-${brand.toLowerCase()}-${width}-${profile}-${rim}`,
        title: `${brand} ${requestedSize}`,
        brand,
        category: "Tyres",
        origin,
        image: "/tyre.jpg",
        price: 0,
        size: requestedSize,
        width: Number(width),
        profile: Number(profile),
        rimDiameter: Number(rim),
        vehicle: "Exact fitment verified",
        rating: null,
        stock: 0,
        badge: `${badge} · On request`,
        description: `${brand} options for ${requestedSize}, subject to current market availability and vehicle fitment confirmation.`,
        onRequest: true,
      }));
  }, [category, query, rim, width, profile]);
  const items = useMemo(() => {
    if (!sourcedItems.length) return inventoryItems;
    const inventoryBrands = new Set(inventoryItems.map((item) => item.brand));
    return [
      ...inventoryItems,
      ...sourcedItems.filter((item) => !inventoryBrands.has(item.brand)),
    ].sort((a, b) =>
      sort === "brand"
        ? a.brand.localeCompare(b.brand)
        : brandPriority(a.brand) - brandPriority(b.brand),
    );
  }, [inventoryItems, sourcedItems, sort]);
  return (
    <main className="shop-page">
      <SeoHead
        title="Browse Tyres and Alloy Rims in Lahore"
        description="Browse tyre and alloy-rim options by category, brand and complete tyre size, then ask Wheels & Wheels Lahore for the current rate and verified fitment."
        canonical="/shop"
      />
      <div className="shop-banner">
        <div className="eyebrow light">THE COLLECTION</div>
        <h1>Find your next set.</h1>
        <p>Tyre and rim options for Pakistan's roads, confirmed before supply.</p>
      </div>
      <section className="shop-layout">
        <aside>
          <h3>Shop by category</h3>
          {[
            "All",
            "All Tyres",
            "Premium & Japanese",
            "Premium Brands",
            "Japanese Brands",
            "Chinese Brands",
            "Rims",
          ].map((c) => (
            <button
              className={category === c ? "selected" : ""}
              onClick={() => setCategory(c)}
              key={c}
            >
              {c}
              <span>
                {c === "All"
                  ? products.length
                  : c === "All Tyres"
                    ? products.filter((p) => p.category === "Tyres").length
                    : c === "Premium & Japanese"
                      ? products.filter(
                          (p) =>
                            p.category === "Tyres" &&
                            ["Other", "Japan"].includes(p.origin),
                        ).length
                    : c === "Premium Brands"
                      ? products.filter((p) =>
                          ["Michelin", "Pirelli", "Continental"].includes(
                            p.brand,
                          ),
                        ).length
                    : c === "Chinese Brands"
                      ? products.filter((p) => p.origin === "China").length
                      : c === "Japanese Brands"
                        ? products.filter((p) => p.origin === "Japan").length
                        : products.filter((p) => p.category === "Rims").length}
              </span>
            </button>
          ))}
          <div className="help-card">
            <FaWhatsapp />
            <b>Need fitment help?</b>
            <p>Share your vehicle details with our expert.</p>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
            >
              Start a chat
            </a>
          </div>
        </aside>
        <div className="shop-main">
          <div className="size-finder">
            <div>
              <small>FITMENT FINDER</small>
              <b>
                {category === "Rims"
                  ? "Choose rim diameter"
                  : "Choose tyre width, profile and rim"}
              </b>
            </div>
            {category !== "Rims" && (
              <select
                value={width}
                onChange={(event) => {
                  setWidth(event.target.value);
                  setProfile("");
                  setRim("");
                  setSize("");
                }}
              >
                <option value="">Any width</option>
                {widthOptions.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            )}
            {category !== "Rims" && (
              <select
                value={profile}
                onChange={(event) => {
                  setProfile(event.target.value);
                  setRim("");
                  setSize("");
                }}
              >
                <option value="">Any profile</option>
                {profileOptions.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
              </select>
            )}
            <select
              value={rim}
              onChange={(event) => {
                const nextRim = event.target.value;
                setRim(nextRim);
                setSize("");
              }}
            >
              <option value="">12–24 inch</option>
              {(category === "Rims"
                ? Array.from({ length: 13 }, (_, index) => index + 12)
                : tyreRimOptions
              ).map(
                (value) => (
                  <option key={value} value={value}>
                    {value} inch
                  </option>
                ),
              )}
            </select>
            {(rim || width || profile) && (
              <button
                onClick={() => {
                  setRim("");
                  setWidth("");
                  setProfile("");
                  setSize("");
                }}
              >
                Clear
              </button>
            )}
          </div>
          <SizeCatalogue
            type={category === "Rims" ? "rims" : "tyres"}
            diameter={rim}
            width={width}
            profile={profile}
          />
          {(rim || width || profile) && (
            <div className="fitment-result" role="status">
              <span>
                Selected requirement{" "}
                <b>
                  {category === "Rims"
                    ? `${rim || "12–24"} inch rims`
                    : `${width || "Any width"}/${profile || "Any profile"} R${rim || "12–24"}`}
                </b>
              </span>
              <div className="fitment-result-actions">
                {category !== "Rims" && selectedManifestSize && (
                  <Link to={selectedManifestSize.path}>Open exact size guide</Link>
                )}
                <button
                  onClick={() => {
                    setRim("");
                    setWidth("");
                    setProfile("");
                    setSize("");
                  }}
                >
                  View full range
                </button>
              </div>
            </div>
          )}
          {size && (
            <div className="fitment-result">
              <span>
                Showing exact size <b>{size}</b>
              </span>
              <button onClick={() => setSize("")}>View every size</button>
            </div>
          )}
          <div className="shop-tools">
            <label>
              <FaSearch />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search brand, model or size"
              />
            </label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="brand">Brand: A to Z</option>
            </select>
          </div>
          <p className="result-count">
            {loading
              ? "Loading live inventory…"
              : `Showing ${items.length} products`}
          </p>
          <div className="product-grid">
            {items.map((p) => (
              <ProductCard key={p._id} product={p} add={add} />
            ))}
          </div>
          {!loading && !items.length && (
            <div className="empty fitment-empty">
              <h3>We can source this fitment.</h3>
              <p>
                Not every 12–24 inch profile is held in display stock. Send the
                exact requirement and our team will confirm safe fitment,
                origin, availability and price.
              </p>
              <Link
                className="primary"
                to={`/quote?tyreSize=${encodeURIComponent(`${width || "Any"}/${profile || "Any"} R${rim || "12–24"}`)}&message=${encodeURIComponent(`${category} requirement`)}`}
              >
                Request this size
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Cart({ open, close, cart, change }) {
  const [showContact, setShowContact] = useState(false);
  const selection = cart
    .map((item) => `${item.qty} x ${item.title} (${item.size})`)
    .join(", ");
  return (
    <>
      <div className={`cart-shade ${open ? "show" : ""}`} onClick={close} />
      <aside className={`cart-drawer ${open ? "show" : ""}`}>
        <div className="cart-head">
          <div>
            <small>YOUR SELECTION</small>
            <h2>Quote list</h2>
          </div>
          <button onClick={close}>
            <FaTimes />
          </button>
        </div>
        {cart.length === 0 ? (
          <div className="cart-empty">
            <FaShoppingBag />
            <h3>Your quote list is empty</h3>
            <p>Save tyre and rim options, then ask us for current rates.</p>
            <Link to="/shop" onClick={close}>
              Find tyres and rims
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((i) => (
                <article key={i._id}>
                  <img src={i.image} alt={i.title} loading="lazy" decoding="async" />
                  <div>
                    <small>{i.brand}</small>
                    <h3>{i.title}</h3>
                    <p>{i.size}</p>
                    <div className="qty">
                      <button onClick={() => change(i._id, -1)}>
                        <FaMinus />
                      </button>
                      <span>{i.qty}</span>
                      <button onClick={() => change(i._id, 1)}>
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <strong>Ask rate</strong>
                </article>
              ))}
            </div>
            <div className="cart-total">
              <span>
                Current pricing <b>Ask for rate</b>
              </span>
              <small>Delivery calculated after confirmation.</small>
              {!showContact ? (
                <button onClick={() => setShowContact(true)}>
                  Contact us to order <FaChevronRight />
                </button>
              ) : (
                <div className="contact-to-order">
                  <div className="contact-order-icon"><FaPhoneAlt /></div>
                  <h3>Contact us to confirm your order</h3>
                  <p>
                    Online payment and checkout are currently unavailable. Our
                    team will confirm current price, fitment, stock and delivery
                    directly with you.
                  </p>
                  <a className="contact-call" href="tel:+923214229594">
                    <FaPhoneAlt /> Call 0321 4229594
                  </a>
                  <a
                    className="contact-whatsapp"
                    href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Wheels & Wheels, please share the current rate, availability and fitment for: ${selection}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaWhatsapp /> WhatsApp 0339 0045836
                  </a>
                  <small>No payment is collected through this website.</small>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function ProductDetail({ products, add }) {
  const { id } = useParams();
  const [remote, setRemote] = useState(null);
  const [zoom, setZoom] = useState(false);
  const [scale, setScale] = useState(1.5);
  const localProduct = products.find((p) => p._id === id || p.slug === id);
  const product = localProduct || remote;
  const productSizeGuide = product?.category === "Tyres"
    ? findTyreSize({
        width: product.width,
        profile: product.profile,
        rim: product.rimDiameter,
      })
    : null;
  useEffect(() => {
    if (!products.find((p) => p._id === id || p.slug === id))
      api(`/products/${id}`)
        .then(setRemote)
        .catch(() => setRemote(false));
  }, [id, products]);
  useEffect(() => {
    const close = (e) => e.key === "Escape" && setZoom(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  if (product === false)
    return (
      <>
        <SeoHead
          title="Product Not Found"
          description="The requested Wheels & Wheels product could not be found."
          noIndex
        />
        <main className="detail-page">
          <div className="empty product-state">
            <div className="eyebrow">CATALOGUE LOOKUP</div>
            <h1>Product not found.</h1>
            <p>Browse the current tyre and rim catalogue or ask our Lahore team to source your exact requirement.</p>
            <Link className="primary" to="/shop">Browse current options</Link>
          </div>
        </main>
      </>
    );
  if (!product)
    return (
      <main className="detail-page">
        <div className="empty product-state" aria-live="polite">
          <div className="eyebrow">CATALOGUE LOOKUP</div>
          <h1>Checking this product.</h1>
          <p>We are loading the requested tyre or rim and its current availability.</p>
        </div>
      </main>
    );
  const productPath = `/product/${product.slug || product._id}`;
  const brandPath = product.category === "Rims"
    ? "/rims"
    : `/brands/${String(product.brand || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}${productPath}#product`,
    name: `${product.title} ${product.size}`,
    description: product.description || product.desc,
    image: [
      `${SITE_URL}${product.image.startsWith("/") ? product.image : `/${product.image}`}`,
    ],
    sku: product.slug || product._id,
    category: product.category,
    brand: { "@type": "Brand", name: product.brand },
    url: `${SITE_URL}${productPath}`,
  };
  return (
    <main className="detail-page">
      <SeoHead
        title={`${product.title} ${product.size}`}
        description={`${product.description} Ask Wheels & Wheels Lahore for the current rate, availability and verified fitment.`}
        canonical={productPath}
        image={product.image}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Tyre catalogue", path: "/shop" },
          ...(productSizeGuide
            ? [{ name: productSizeGuide.size, path: productSizeGuide.path }]
            : []),
          { name: product.title, path: productPath },
        ]}
        schemas={[productSchema]}
      />
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> /{" "}
        {product.title}
      </div>
      <section className="detail-grid">
        <button
          className="detail-image"
          onClick={() => setZoom(true)}
          aria-label="Open product image zoom"
        >
          <img src={product.image} alt={product.title} decoding="async" />
          {product.badge && <span className="pill">{product.badge}</span>}
          <span className="zoom-hint">
            <FaSearch /> Click to zoom
          </span>
        </button>
        <div className="detail-copy">
          <div className="eyebrow">
            {product.brand} · {product.category}
          </div>
          <h1>{product.title}</h1>
          <div className="rating">
            <FaCheck /> Specification and current stock confirmed before supply
          </div>
          <div className="detail-price">
            <small>CURRENT RATE</small>
            <strong>Ask for current rate</strong>
            <span>Confirmed against today’s stock and import pricing</span>
          </div>
          <p>{product.description || product.desc}</p>
          <div className="detail-specs">
            <span>
              <small>SIZE</small>
              <b>{product.size}</b>
            </span>
            <span>
              <small>FITMENT</small>
              <b>{product.vehicle}</b>
            </span>
            <span>
              <small>AVAILABILITY</small>
              <b>Confirm current availability</b>
            </span>
          </div>
          <button
            className="detail-add"
            disabled={!product.stock && !product.onRequest}
            onClick={() => add(product)}
          >
            <FaShoppingBag /> {product.onRequest ? "Ask about this option" : product.stock ? "Save to selection" : "Out of stock"}
          </button>
          <div className="detail-benefits">
            <span>
              <FaCheck /> Brand, date code and warranty terms checked
            </span>
            <span>
              <FaTruck /> Delivery options confirmed with your quotation
            </span>
            <span>
              <FaWhatsapp /> Expert fitment confirmation
            </span>
          </div>
        </div>
      </section>
      <section className="detail-information" aria-labelledby="product-information-title">
        <article className="detail-specification-card">
          <p className="eyebrow">CATALOGUE SPECIFICATION</p>
          <h2 id="product-information-title">Check the complete requirement.</h2>
          <dl>
            <div><dt>Brand</dt><dd>{product.brand}</dd></div>
            <div><dt>Product</dt><dd>{product.title}</dd></div>
            <div><dt>Category</dt><dd>{product.category}</dd></div>
            <div><dt>Labelled size</dt><dd>{product.size}</dd></div>
            {product.width && <div><dt>Nominal width</dt><dd>{product.width} mm</dd></div>}
            {product.profile && <div><dt>Aspect ratio</dt><dd>{product.profile}</dd></div>}
            {product.rimDiameter && <div><dt>Wheel diameter</dt><dd>{product.rimDiameter} inch</dd></div>}
            <div><dt>Use category</dt><dd>{product.vehicle || "Confirm for your vehicle"}</dd></div>
          </dl>
          <p className="detail-specification-note">
            This catalogue entry is not a universal fitment approval. Confirm the vehicle,
            model year, trim, placard size, load index, speed rating and wheel specification.
          </p>
        </article>
        <aside className="detail-research-card" aria-label="Related buying information">
          <p className="eyebrow">VERIFY BEFORE BUYING</p>
          <h2>Research this option.</h2>
          {productSizeGuide && (
            <Link to={productSizeGuide.path}>
              Read the {productSizeGuide.size} size guide <FaChevronRight />
            </Link>
          )}
          <Link to={brandPath}>
            {product.category === "Rims" ? "Explore alloy rims" : `Explore ${product.brand} tyres`} <FaChevronRight />
          </Link>
          <Link to="/guides/how-to-choose-the-right-tyre-size-pakistan">
            Learn how to read tyre size <FaChevronRight />
          </Link>
          <Link to={`/quote?tyreSize=${encodeURIComponent(product.size || "")}&message=${encodeURIComponent(`Please confirm the current rate and complete specification for ${product.title}.`)}`}>
            Request current rate <FaChevronRight />
          </Link>
        </aside>
      </section>
      {zoom && (
        <div
          className="zoom-modal"
          role="dialog"
          aria-modal="true"
          onClick={() => setZoom(false)}
        >
          <button className="zoom-close">
            <FaTimes />
          </button>
          <div className="zoom-stage" onClick={(e) => e.stopPropagation()}>
            <img
              src={product.image}
              alt={product.title}
              style={{ transform: `scale(${scale})` }}
            />
          </div>
          <div className="zoom-controls" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setScale((v) => Math.max(1, v - 0.25))}>
              <FaMinus />
            </button>
            <span>{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale((v) => Math.min(3, v + 0.25))}>
              <FaPlus />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function LeadInsights({ summary }) {
  const statusMap = Object.fromEntries(
    (summary.inquiryStatuses || []).map((status) => [status._id, status.count]),
  );
  const stages = [
    { key: "new", label: "New", color: "#e7a624", dot: "pending" },
    { key: "contacted", label: "Contacted", color: "#2788d8", dot: "confirmed" },
    { key: "quoted", label: "Quoted", color: "#7a59c4", dot: "shipped" },
    { key: "won", label: "Won", color: "#2a9c63", dot: "completed" },
    { key: "closed", label: "Closed", color: "#d51f27", dot: "cancelled" },
  ];
  const max = Math.max(1, ...stages.map((stage) => statusMap[stage.key] || 0));
  const total = summary.inquiries || 0;
  const followUps = [
    {
      key: "new",
      title: "New RFQs need first contact",
      help: "Call or WhatsApp the customer, then mark the lead Contacted.",
    },
    {
      key: "contacted",
      title: "Contacted leads need a quotation",
      help: "Confirm fitment, current stock and rate before preparing the quote.",
    },
    {
      key: "quoted",
      title: "Sent quotes need follow-up",
      help: "Record the result as Won or Closed when the customer decides.",
    },
  ];
  return (
    <section className="insights">
      <div className="sales-panel">
        <div className="panel-title">
          <div>
            <small>ALL WEBSITE RATE REQUESTS</small>
            <h2>RFQ lead funnel</h2>
          </div>
          <b>{total} total</b>
        </div>
        <div className="sales-chart">
          {total ? (
            stages.map((stage) => {
              const count = statusMap[stage.key] || 0;
              return (
                <div
                  className="bar-wrap"
                  key={stage.key}
                  title={`${stage.label}: ${count} RFQs`}
                >
                  <span
                    style={{
                      height: `${Math.max(5, (count / max) * 100)}%`,
                      background: stage.color,
                    }}
                  />
                  <small>{stage.label}</small>
                </div>
              );
            })
          ) : (
            <div className="no-data">
              RFQ activity will appear after customers send rate requests.
            </div>
          )}
        </div>
        <div className="status-strip">
          {stages.map((stage) => (
            <span key={stage.key}>
              <i className={stage.dot}></i>
              <b>{statusMap[stage.key] || 0}</b> {stage.label}
            </span>
          ))}
        </div>
      </div>
      <div className="stock-panel">
        <div className="panel-title">
          <div>
            <small>INVENTORY HEALTH</small>
            <h2>Stock alerts</h2>
          </div>
          <b className={(summary.outOfStock || []).length ? "alert" : ""}>
            {(summary.outOfStock || []).length} empty
          </b>
        </div>
        <div className="stock-list">
          {[...(summary.outOfStock || []), ...(summary.lowStock || [])]
            .slice(0, 6)
            .map((p) => (
              <div key={p._id}>
                <img src={p.image} alt="" />
                <span>
                  <b>{p.title}</b>
                  <small>
                    {p.stock === 0
                      ? "Out of stock"
                      : `Only ${p.stock} remaining`}
                  </small>
                </span>
                <strong className={p.stock === 0 ? "empty-stock" : "low-stock"}>
                  {p.stock}
                </strong>
              </div>
            ))}
          {!(summary.outOfStock?.length || summary.lowStock?.length) && (
            <div className="no-data">All products are well stocked.</div>
          )}
        </div>
      </div>
      <div className="seller-panel">
        <div className="panel-title">
          <div>
            <small>PRIORITY QUEUE</small>
            <h2>Lead follow-up</h2>
          </div>
        </div>
        {followUps.map((item, index) => (
          <div className="seller-row" key={item.key}>
            <b>0{index + 1}</b>
            <span>
              {item.title}
              <small>{item.help}</small>
            </span>
            <strong>{statusMap[item.key] || 0}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrackOrder() {
  const [trackParams] = useSearchParams();
  const [form, setForm] = useState({
    id: trackParams.get("id") || "",
    phone: trackParams.get("phone") || "",
  });
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    try {
      setOrder(
        await api(
          `/orders/track/${form.id.trim()}?phone=${encodeURIComponent(form.phone.trim())}`,
        ),
      );
    } catch (err) {
      setError(err.message);
    }
  };
  const stages = ["pending", "confirmed", "shipped", "completed"];
  return (
    <main className="track-page">
      <div className="track-hero">
        <div className="eyebrow light">ORDER STATUS</div>
        <h1>Track your order</h1>
        <p>
          Enter the order number from your confirmation and the same phone
          number used at checkout.
        </p>
      </div>
      <div className="track-card">
        <form onSubmit={submit}>
          <label>
            Order number
            <input
              required
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              placeholder="e.g. 68a..."
            />
          </label>
          <label>
            Phone number
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="03XX XXXXXXX"
            />
          </label>
          <button>Track order</button>
        </form>
        {error && <div className="form-error">{error}</div>}
        {order && (
          <div className="tracking-result">
            <div>
              <small>ORDER</small>
              <b>#{order._id.slice(-8).toUpperCase()}</b>
              <small>
                Placed {new Date(order.createdAt).toLocaleDateString()}
              </small>
            </div>
            <div
              className={`track-steps ${order.status === "cancelled" ? "cancelled" : ""}`}
            >
              {order.status === "cancelled" ? (
                <strong>Order cancelled</strong>
              ) : (
                stages.map((stage, index) => (
                  <span
                    className={
                      index <= stages.indexOf(order.status) ? "done" : ""
                    }
                    key={stage}
                  >
                    <i>
                      <FaCheck />
                    </i>
                    <b>{stage}</b>
                  </span>
                ))
              )}
            </div>
            <div className="tracked-items">
              {order.items.map((i) => (
                <span key={i._id}>
                  {i.quantity}× {i.title}
                  <b>{formatPrice(i.price * i.quantity)}</b>
                </span>
              ))}
            </div>
            <div className="tracked-total">
              Total <b>{formatPrice(order.total)}</b>
            </div>
          </div>
        )}
      </div>
      <LookupGuide type="order" />
    </main>
  );
}

function LookupGuide({ type }) {
  const quote = type === "quote";
  return (
    <section className="lookup-guide">
      <div className="lookup-guide-heading">
        <div className="eyebrow">HOW IT WORKS</div>
        <h2>{quote ? "From request to final rate." : "From checkout to delivery."}</h2>
        <p>
          {quote
            ? "Your reference keeps the conversation organised while your private details remain protected."
            : "Your order reference provides a secure view of fulfilment progress without requiring an account."}
        </p>
      </div>
      <div className="lookup-steps">
        <article><b>01</b><h3>{quote ? "Request rates" : "Place your order"}</h3><p>{quote ? "Submit your vehicle, tyre size, preferred brands and budget." : "Complete checkout and save the full order number shown on confirmation."}</p></article>
        <article><b>02</b><h3>Save your reference</h3><p>{quote ? "Your RFQ reference appears immediately after submission." : "Use the same phone number that you entered during checkout."}</p></article>
        <article><b>03</b><h3>{quote ? "Our team prepares it" : "We update progress"}</h3><p>{quote ? "We check fitment, stock and the current market rate before replying." : "The dashboard moves your order through pending, confirmed, shipped and completed."}</p></article>
        <article><b>04</b><h3>{quote ? "Review and discuss" : "Track securely"}</h3><p>{quote ? "Check this page for the rate, products and sales reply, then continue on WhatsApp." : "Enter the full reference and matching phone number whenever you want an update."}</p></article>
      </div>
      <div className="lookup-help"><FaWhatsapp /><span><b>Need help finding your reference?</b><small>Message official WhatsApp with your name and phone number.</small></span><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">Get help</a></div>
    </section>
  );
}

function Checkout({ cart, clear }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Lahore",
    address: "",
    notes: "",
    paymentMethod: "cash-on-delivery",
    paymentReference: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery =
    subtotal >= 50000 && form.city.toLowerCase() === "lahore" ? 0 : 1500;
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await api("/orders", {
        method: "POST",
        body: JSON.stringify({
          customer: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            city: form.city,
            address: form.address,
            notes: form.notes,
          },
          paymentMethod: form.paymentMethod,
          paymentReference: form.paymentReference,
          items: cart.map((i) => ({ product: i._id, quantity: i.qty })),
        }),
      });
      setOrder(result);
      clear();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  if (order)
    return (
      <main className="checkout-page">
        <div className="order-success">
          <FaCheck />
          <div className="eyebrow">ORDER RECEIVED</div>
          <h1>Thank you for your order.</h1>
          <p>
            Your order number is <b>{order.orderId}</b>. Our team will call you
            to confirm fitment and delivery.
          </p>
          <div className="success-actions">
            <button className="primary" type="button" onClick={() => navigator.clipboard?.writeText(order.orderId)}>Copy order number</button>
            <Link className="success-secondary" to={`/track?id=${order.orderId}&phone=${encodeURIComponent(form.phone)}`}>Track this order</Link>
            <button className="success-text" type="button" onClick={() => navigate("/")}>Return home</button>
          </div>
        </div>
      </main>
    );
  if (!cart.length)
    return (
      <main className="checkout-page">
        <div className="order-success">
          <h1>Your cart is empty.</h1>
          <Link className="primary" to="/shop">
            Browse products
          </Link>
        </div>
      </main>
    );
  return (
    <main className="checkout-page">
      <div className="checkout-title">
        <div className="eyebrow">SECURE CHECKOUT</div>
        <h1>Complete your order</h1>
      </div>
      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={submit}>
          <h2>Delivery details</h2>
          <div className="form-grid">
            <label>
              Full name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              Phone number
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              City
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </label>
            <label className="wide">
              Complete delivery address
              <textarea
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </label>
            <label className="wide">
              Order notes
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>
          </div>
          <h2>Payment method</h2>
          <label className="payment payment-option">
            <input
              type="radio"
              checked={form.paymentMethod === "cash-on-delivery"}
              onChange={() =>
                setForm({ ...form, paymentMethod: "cash-on-delivery" })
              }
            />
            <span>
              <b>Cash on delivery</b>
              <small>Pay when your order arrives</small>
            </span>
          </label>
          <label className="payment payment-option">
            <input
              type="radio"
              checked={form.paymentMethod === "jazzcash"}
              onChange={() =>
                setForm({ ...form, paymentMethod: "jazzcash" })
              }
            />
            <span>
              <b>JazzCash</b>
              <small>Send payment to 0321 4229594</small>
            </span>
          </label>
          <label className="payment payment-option">
            <input
              type="radio"
              checked={form.paymentMethod === "meezan-bank"}
              onChange={() =>
                setForm({ ...form, paymentMethod: "meezan-bank" })
              }
            />
            <span>
              <b>Meezan Bank transfer</b>
              <small>Account number: 00300111316686</small>
            </span>
          </label>
          {form.paymentMethod !== "cash-on-delivery" && (
            <div className="payment-instructions">
              <b>Complete payment before placing the order</b>
              <p>
                Transfer the order total using the selected method, then enter
                the transaction/reference ID below. Our team will verify it
                before confirming your order.
              </p>
              <label>
                Transaction / reference ID
                <input
                  required
                  value={form.paymentReference}
                  onChange={(e) =>
                    setForm({ ...form, paymentReference: e.target.value })
                  }
                  placeholder="Enter the ID shown on your payment receipt"
                />
              </label>
            </div>
          )}
          {error && <div className="form-error">{error}</div>}
          <button disabled={busy} className="place-order">
            {busy ? "Placing order…" : "Place order"}
          </button>
        </form>
        <aside className="order-summary">
          <h2>Order summary</h2>
          {cart.map((i) => (
            <div className="summary-item" key={i._id}>
              <img src={i.image} alt="" />
              <span>
                <b>{i.title}</b>
                <small>
                  {i.qty} × {formatPrice(i.price)}
                </small>
              </span>
              <strong>{formatPrice(i.price * i.qty)}</strong>
            </div>
          ))}
          <div className="summary-totals">
            <span>
              Subtotal <b>{formatPrice(subtotal)}</b>
            </span>
            <span>
              Delivery <b>{delivery ? formatPrice(delivery) : "Free"}</b>
            </span>
            <strong>
              Total <b>{formatPrice(subtotal + delivery)}</b>
            </strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

function QuoteRequest() {
  const [quoteParams] = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Lahore",
    vehicle: "",
    tyreSize: quoteParams.get("tyreSize") || "",
    budget: "",
    message: quoteParams.get("message") || "",
    website: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const successPanel = useRef(null);
  const rfqReference = result?.reference || result?.inquiryId || "";
  const customerEmailStatus = result?.customerEmailStatus;
  useEffect(() => {
    if (!result || !successPanel.current) return;
    successPanel.current.focus({ preventScroll: true });
    successPanel.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      setResult(
        await api("/inquiries", { method: "POST", body: JSON.stringify(form) }),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  if (result)
    return (
      <main className="quote-page">
        <SeoHead
          title="Tyre Rate Request Received"
          description="Your Wheels & Wheels tyre or rim rate request has been received."
          canonical="/quote"
          noIndex
        />
        <div className="order-success" ref={successPanel} tabIndex="-1" aria-live="polite">
          <FaCheck aria-hidden="true" />
          <div className="eyebrow">REQUEST RECEIVED</div>
          <h1>We’re preparing your options.</h1>
          <p>Your request is safely recorded. Keep this short reference when you call or message us.</p>
          <dl className="success-details">
            <div><dt>RFQ reference</dt><dd>{rfqReference}</dd></div>
            <div><dt>Submitted contact number</dt><dd>{form.phone}</dd></div>
          </dl>
          <p className="success-note">We will use the contact number you entered to reply. For immediate help, contact the official shop numbers below.</p>
          <div
            className={`rfq-delivery-message ${result.customerEmailSent ? "sent" : "attention"}`}
            role="status"
          >
            {form.email ? (
              result.customerEmailSent ? (
                <>
                  <b>Confirmation email sent</b>
                  <span>Check {form.email} and its spam folder for your RFQ receipt.</span>
                </>
              ) : (
                <>
                  <b>Your RFQ is saved, but email delivery was not confirmed</b>
                  <span>
                    Keep the reference above and use call or WhatsApp. Status: {customerEmailStatus === "not_configured" ? "email service not configured" : "delivery failed"}.
                  </span>
                </>
              )
            ) : (
              <>
                <b>No confirmation email requested</b>
                <span>You did not enter an email address; we will reply using your submitted phone number.</span>
              </>
            )}
          </div>
          <button
            className="copy-reference"
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard?.writeText(rfqReference);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? "RFQ reference copied" : "Copy RFQ reference"}
          </button>
          <div className="success-actions">
            <a className="primary" href="tel:+923214229594">
              <FaPhoneAlt aria-hidden="true" /> Call 0321 4229594
            </a>
            <a
              className="success-whatsapp"
              href={`https://wa.me/923390045836?text=${encodeURIComponent(`Hi Wheels & Wheels, I just submitted RFQ ${rfqReference}.`)}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp aria-hidden="true" /> WhatsApp 0339 0045836
            </a>
            <Link className="success-secondary" to="/shop">Browse tyre options</Link>
          </div>
          <button className="success-text" type="button" onClick={() => { setResult(null); setCopied(false); }}>
            Submitted the wrong number? Correct the details
          </button>
        </div>
      </main>
    );
  return (
    <main className="quote-page">
      <SeoHead
        title="Request Current Tyre and Rim Rates in Lahore"
        description="Send your vehicle, tyre size and requirements to Wheels & Wheels Lahore for current tyre or alloy-rim options and verified fitment advice."
        canonical="/quote"
        noIndex
      />
      <section className="quote-intro">
        <div className="eyebrow light">PERSONAL FITMENT ADVICE</div>
        <h1>Request a quote.</h1>
        <p>
          Tell us about your vehicle, preferred setup and budget. A wheel
          specialist will check fitment, stock and current pricing.
        </p>
        <div>
          <span>
            <FaCheck /> Saved directly in our sales dashboard
          </span>
          <span>
            <FaCheck /> Shop and customer email delivery is checked after saving
          </span>
          <span>
            <FaCheck /> Reply by phone, email or WhatsApp
          </span>
        </div>
      </section>
      <form className="quote-form" onSubmit={submit}>
        <label className="form-honeypot" aria-hidden="true">
          Website
          <input
            tabIndex="-1"
            autoComplete="off"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </label>
        <div className="eyebrow">YOUR REQUIREMENTS</div>
        <h2>Let’s find the right setup.</h2>
        <div className="form-grid">
          <label>
            Full name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Phone / WhatsApp
            <input
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="03XX XXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label>
            Email for your confirmation (optional)
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            City
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </label>
          <label>
            Vehicle
            <input
              value={form.vehicle}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              placeholder="e.g. Honda Civic 2022"
            />
          </label>
          <label>
            Current tyre size
            <input
              value={form.tyreSize}
              onChange={(e) => setForm({ ...form, tyreSize: e.target.value })}
              placeholder="e.g. 215/55 R17"
            />
          </label>
          <label className="wide">
            Approximate budget
            <input
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              placeholder="e.g. Rs. 150,000–200,000"
            />
          </label>
          <label className="wide">
            What do you need?
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tyres, rims, complete package, driving preference, brands you like…"
            />
          </label>
        </div>
        {error && <div className="form-error">{error}</div>}
        <button className="place-order" disabled={busy}>
          {busy ? "Sending request…" : "Send quote request"}
        </button>
        <p className="form-privacy">
          Your details are used only to respond to this request.
        </p>
      </form>
    </main>
  );
}

function QuoteStatus() {
  const [params] = useSearchParams();
  const [reference, setReference] = useState(params.get("id") || "");
  const [phone, setPhone] = useState(params.get("phone") || "");
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const lookup = async (event) => {
    event?.preventDefault();
    setBusy(true);
    setError("");
    try {
      setQuote(await api(`/inquiries/track/${reference.trim()}?phone=${encodeURIComponent(phone)}`));
    } catch (err) {
      setQuote(null);
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    if (reference && phone) lookup();
    // Run once for a prefilled link from the RFQ confirmation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const steps = ["new", "contacted", "quoted", "won"];
  const position = steps.indexOf(quote?.status);
  return (
    <main className="track-page quote-status-page">
      <section className="track-hero">
        <div className="eyebrow light">LIVE RATE REQUEST</div>
        <h1>Check your quotation.</h1>
        <p>Use the RFQ reference and the same phone number used in your request.</p>
      </section>
      <section className="track-card">
        <form onSubmit={lookup}>
          <label>RFQ reference<input required value={reference} onChange={(e) => setReference(e.target.value)} /></label>
          <label>Phone number<input required value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          <button disabled={busy}>{busy ? "Checking…" : "Check quote"}</button>
        </form>
        {error && <div className="form-error">{error}</div>}
        {quote && (
          <div className="tracking-result quote-result">
            <div><FaCheck /><div><small>RFQ REFERENCE</small><b>{quote.reference || quote.inquiryId}</b></div></div>
            <div className={`track-steps ${quote.status === "closed" ? "cancelled" : ""}`}>
              {quote.status === "closed" ? <b>This request has been closed</b> : steps.map((step, index) => (
                <span className={index <= position ? "done" : ""} key={step}><i><FaCheck /></i><b>{step}</b></span>
              ))}
            </div>
            <div className="quote-summary">
              <span><small>Requested</small><b>{quote.tyreSize || quote.vehicle || "Custom fitment"}</b></span>
              <span><small>Quoted rate</small><b>{quote.quotedAmount != null ? formatPrice(quote.quotedAmount) : "Being prepared"}</b></span>
              {quote.quotedItems && <div><small>ITEMS / AVAILABILITY</small><p>{quote.quotedItems}</p></div>}
              {quote.reply && <div><small>MESSAGE FROM SALES</small><p>{quote.reply}</p></div>}
            </div>
            <a className="primary quote-accept" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`I would like to accept/discuss quotation ${quote.reference || quote.inquiryId}.`)}`} target="_blank" rel="noreferrer"><FaWhatsapp /> Accept or discuss on official WhatsApp</a>
          </div>
        )}
      </section>
      <LookupGuide type="quote" />
    </main>
  );
}

function InquiryQuoteEditor({ item, onSaved }) {
  const [draft, setDraft] = useState({
    quotedAmount: item.quotedAmount ?? "",
    quotedItems: item.quotedItems || "",
    reply: item.reply || "",
    notes: item.notes || "",
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const save = async (sendReply) => {
    setBusy(true);
    setMessage("");
    try {
      const result = await api(`/inquiries/${item._id}`, { method: "PATCH", body: JSON.stringify({ ...draft, sendReply }) });
      if (!sendReply) setMessage("Draft saved.");
      else if (result.emailSent)
        setMessage("Quote saved and email delivery confirmed.");
      else if (result.emailDeliveryStatus === "not_requested")
        setMessage("Quote saved. No customer email was supplied; use WhatsApp or call.");
      else if (result.emailDeliveryStatus === "not_configured")
        setMessage("Quote saved, but SMTP is not configured. Use WhatsApp or call.");
      else
        setMessage("Quote saved, but email delivery failed. Use WhatsApp or call and check the mail settings.");
      onSaved();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };
  return <details className="quote-editor"><summary>Prepare quotation</summary><div className="quote-editor-grid">
    <label>Rate (PKR)<input type="number" min="0" value={draft.quotedAmount} onChange={(e) => setDraft({ ...draft, quotedAmount: e.target.value })} /></label>
    <label>Items, brands & availability<textarea value={draft.quotedItems} onChange={(e) => setDraft({ ...draft, quotedItems: e.target.value })} placeholder="e.g. 4 × Yokohama 195/65 R15 — in stock" /></label>
    <label>Reply to customer<textarea value={draft.reply} onChange={(e) => setDraft({ ...draft, reply: e.target.value })} placeholder="Validity, delivery and fitment details" /></label>
    <label>Private admin notes<textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></label>
    <div><button disabled={busy} onClick={() => save(false)}>Save draft</button><button className="send-quote" disabled={busy} onClick={() => save(true)}>Save & send quote</button></div>
    {message && <small>{message}</small>}
  </div></details>;
}

function EmailDeliveryBadge({ label, status }) {
  const normalized = status || "unknown";
  const copy = {
    sent: "sent",
    failed: "failed",
    not_configured: "not configured",
    not_requested: "not requested",
    pending: "pending",
    unknown: "legacy / unknown",
  }[normalized];
  return (
    <small className={`email-delivery-badge ${normalized}`}>
      {label}: {copy}
    </small>
  );
}

function InquiryEmailRetry({ item, onSaved }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const retryable = ["failed", "not_configured"];
  const needsRetry =
    retryable.includes(item.notification?.adminEmailStatus) ||
    retryable.includes(item.notification?.customerEmailStatus);
  if (!needsRetry) return null;
  const retry = async () => {
    setBusy(true);
    setMessage("");
    try {
      const result = await api(`/inquiries/${item._id}`, {
        method: "PATCH",
        body: JSON.stringify({ retryNotifications: true }),
      });
      const delivery = result.receiptDelivery;
      if (delivery?.adminEmailSent && (!item.email || delivery.customerEmailSent))
        setMessage("Receipt emails delivered.");
      else if (delivery?.adminEmailStatus === "not_configured")
        setMessage("SMTP is still not configured.");
      else setMessage("Delivery still failed; use call or WhatsApp.");
      onSaved();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="email-retry-control">
      <button type="button" disabled={busy} onClick={retry}>
        {busy ? "Retrying..." : "Retry receipt emails"}
      </button>
      {message && <small>{message}</small>}
    </div>
  );
}

function mergeUniqueInquiries(current, incoming) {
  const byId = new Map(current.map((item) => [item._id, item]));
  incoming.forEach((item) => byId.set(item._id, item));
  return [...byId.values()];
}

function Admin() {
  const [token, setToken] = useState(null);
  const [login, setLogin] = useState({
    email: "admin@wheelsandwheels.pk",
    password: "",
  });
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({});
  const [error, setError] = useState("");
  const [tab, setTab] = useState("inquiries");
  const [inquiryPage, setInquiryPage] = useState(1);
  const [inquiriesHaveMore, setInquiriesHaveMore] = useState(false);
  const [loadingMoreInquiries, setLoadingMoreInquiries] = useState(false);
  const empty = {
    title: "",
    slug: "",
    brand: "",
    category: "Tyres",
    image: "/tyre.jpg",
    price: "",
    size: "",
    vehicle: "",
    stock: "",
    description: "",
  };
  const [draft, setDraft] = useState(empty);
  const [editing, setEditing] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem("ww-admin-token"));
  }, []);
  const load = async () => {
    try {
      const [o, p, s, inquiriesResult] = await Promise.all([
        api("/orders"),
        api("/products"),
        api("/admin/summary"),
        apiWithMeta(`/inquiries?page=1&limit=${RFQ_PAGE_SIZE}`),
      ]);
      setOrders(o);
      setProducts(p);
      setSummary(s);
      setInquiries(mergeUniqueInquiries([], inquiriesResult.data));
      setInquiryPage(inquiriesResult.meta.page);
      setInquiriesHaveMore(inquiriesResult.meta.hasMore);
    } catch (e) {
      setError(e.message);
    }
  };
  const loadMoreInquiries = async () => {
    if (loadingMoreInquiries || !inquiriesHaveMore) return;
    setLoadingMoreInquiries(true);
    setError("");
    try {
      const result = await apiWithMeta(
        `/inquiries?page=${inquiryPage + 1}&limit=${RFQ_PAGE_SIZE}`,
      );
      setInquiries((current) => mergeUniqueInquiries(current, result.data));
      setInquiryPage(result.meta.page);
      setInquiriesHaveMore(result.meta.hasMore);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoadingMoreInquiries(false);
    }
  };
  useEffect(() => {
    if (token) load();
  }, [token]);
  const doLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(login),
      });
      localStorage.setItem("ww-admin-token", result.token);
      setToken(result.token);
    } catch (err) {
      setError(err.message);
    }
  };
  const status = async (id, value) => {
    await api(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: value }),
    });
    load();
  };
  const inquiryStatus = async (id, value) => {
    await api(`/inquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: value }),
    });
    load();
  };
  const create = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...draft,
        price: Number(draft.price),
        stock: Number(draft.stock),
      };
      await api(editing ? `/products/${editing}` : "/products", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setDraft(empty);
      setEditing(null);
      setTab("products");
      load();
    } catch (err) {
      setError(err.message);
    }
  };
  const edit = (p) => {
    setEditing(p._id);
    setDraft({
      title: p.title,
      slug: p.slug,
      brand: p.brand,
      category: p.category,
      image: p.image || "",
      price: p.price,
      size: p.size || "",
      vehicle: p.vehicle || "",
      stock: p.stock,
      description: p.description || "",
    });
    setTab("add");
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api(`/products/${id}`, { method: "DELETE" });
    load();
  };
  const inquiryStatusMap = Object.fromEntries(
    (summary.inquiryStatuses || []).map((statusItem) => [
      statusItem._id,
      statusItem.count,
    ]),
  );
  if (!token)
    return (
      <main className="admin-login">
        <form onSubmit={doLogin}>
          <div className="eyebrow">STORE MANAGEMENT</div>
          <h1>Admin sign in</h1>
          <label>
            Email
            <input
              type="email"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button>Sign in</button>
        </form>
      </main>
    );
  return (
    <main className="admin-page">
      <div className="admin-top">
        <div>
          <div className="eyebrow">WHEELS &amp; WHEELS</div>
          <h1>Lead dashboard</h1>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("ww-admin-token");
            setToken(null);
          }}
        >
          Sign out
        </button>
      </div>
      <div className="stats">
        <article>
          <small>Total RFQs</small>
          <b>{summary.inquiries || 0}</b>
        </article>
        <article>
          <small>New leads</small>
          <b>{inquiryStatusMap.new ?? summary.newInquiries ?? 0}</b>
        </article>
        <article>
          <small>Quoted leads</small>
          <b>{inquiryStatusMap.quoted || 0}</b>
        </article>
        <article>
          <small>Won RFQs</small>
          <b>{inquiryStatusMap.won || 0}</b>
        </article>
      </div>
      <div
        className={`admin-email-health ${summary.emailConfigured ? "ok" : "warning"}`}
        role="status"
      >
        <div>
          <b>{summary.emailConfigured ? "Email service configured" : "Email service needs configuration"}</b>
          <span>
            {summary.emailConfigured
              ? "RFQs remain stored in this dashboard even if an email provider rejects or delays a message."
              : "Add the SMTP variables in Vercel and redeploy. Until then, monitor this RFQ dashboard directly."}
          </span>
        </div>
        <strong>{summary.emailDeliveryIssues || 0} RFQs need an email check</strong>
      </div>
      <details className="admin-guide">
        <summary>How to manage the RFQ lead funnel</summary>
        <div>
          <article><b>New</b><p>Open the RFQ, contact the customer by phone or official WhatsApp, and change the status to Contacted after the first response.</p></article>
          <article><b>Contacted</b><p>Confirm the vehicle fitment, requested products, current availability and rate before preparing a quotation.</p></article>
          <article><b>Quoted</b><p>Use Prepare quotation to save the exact items, amount and reply. Save &amp; Send Quote emails the customer when an email address is available.</p></article>
          <article><b>Won or closed</b><p>Mark successful leads Won and unsuccessful or inactive requests Closed so the funnel remains useful. Online checkout and payment are currently disabled; legacy orders are retained only for earlier records.</p></article>
        </div>
      </details>
      <LeadInsights summary={summary} />
      <div className="admin-tabs">
        <button
          className={tab === "inquiries" ? "active" : ""}
          onClick={() => setTab("inquiries")}
        >
          RFQs {summary.newInquiries ? `(${summary.newInquiries})` : ""}
        </button>
        <button
          className={tab === "orders" ? "active" : ""}
          onClick={() => setTab("orders")}
        >
          Legacy orders
        </button>
        <button
          className={tab === "products" ? "active" : ""}
          onClick={() => setTab("products")}
        >
          Products
        </button>
        <button
          className={tab === "add" ? "active" : ""}
          onClick={() => {
            setEditing(null);
            setDraft(empty);
            setTab("add");
          }}
        >
          Add product
        </button>
      </div>
      {error && <div className="form-error">{error}</div>}
      {tab === "inquiries" && (
        <div className="admin-table inquiry-table">
          <div className="table-row inquiry-row head">
            <span>Customer / received</span>
            <span>Requirements</span>
            <span>Contact</span>
            <span>Pipeline</span>
          </div>
          {inquiries.map((item) => (
            <div className="table-row inquiry-row" key={item._id}>
              <span>
                <b>{item.name}</b>
                <small>
                  {item.reference || `Legacy RFQ · ${String(item._id).slice(-8).toUpperCase()}`}
                  <br />
                  {item.city || "City not provided"}
                  <br />
                  {new Date(item.createdAt).toLocaleString()}
                </small>
              </span>
              <span>
                <b>{item.vehicle || "Vehicle not provided"}</b>
                <small>
                  {item.tyreSize || "Size not provided"} ·{" "}
                  {item.budget || "No budget"}
                  <br />
                  {item.message}
                </small>
              </span>
              <span>
                <a href={`tel:${item.phone}`}>{item.phone}</a>
                <small>{item.email || "No email"}</small>
                <div className="email-delivery-list">
                  <EmailDeliveryBadge
                    label="Shop alert"
                    status={item.notification?.adminEmailStatus}
                  />
                  <EmailDeliveryBadge
                    label="Customer receipt"
                    status={item.notification?.customerEmailStatus || (item.email ? undefined : "not_requested")}
                  />
                  {item.notification?.quoteEmailStatus && (
                    <EmailDeliveryBadge
                      label="Quote email"
                      status={item.notification.quoteEmailStatus}
                    />
                  )}
                </div>
                <InquiryEmailRetry item={item} onSaved={load} />
                <a
                  className="admin-whatsapp"
                  href={`https://wa.me/${whatsappNumberFor(item.phone)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </span>
              <span>
                <select
                  value={item.status}
                  onChange={(event) =>
                    inquiryStatus(item._id, event.target.value)
                  }
                >
                  {["new", "contacted", "quoted", "won", "closed"].map(
                    (value) => (
                      <option key={value}>{value}</option>
                    ),
                  )}
                </select>
                <InquiryQuoteEditor item={item} onSaved={load} />
              </span>
            </div>
          ))}
          {!inquiries.length && (
            <div className="no-data">No quote requests yet.</div>
          )}
          {!!inquiries.length && (
            <div className="admin-pagination no-data">
              <p id="rfq-pagination-status" aria-live="polite">
                Showing {inquiries.length} of {summary.inquiries || inquiries.length} RFQs.
              </p>
              {inquiriesHaveMore ? (
                <button
                  className="place-order"
                  type="button"
                  onClick={loadMoreInquiries}
                  disabled={loadingMoreInquiries}
                  aria-busy={loadingMoreInquiries}
                  aria-describedby="rfq-pagination-status"
                >
                  {loadingMoreInquiries ? "Loading more RFQs…" : "Load more RFQs"}
                </button>
              ) : (
                <span>All RFQs are loaded.</span>
              )}
            </div>
          )}
        </div>
      )}
      {tab === "orders" && (
        <div className="admin-table">
          <div className="table-row head">
            <span>Order / customer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
          </div>
          {orders.map((o) => (
            <div className="table-row" key={o._id}>
              <span>
                <b>#{o._id.slice(-6).toUpperCase()}</b>
                <small>
                  {o.customer.name} · {o.customer.phone}
                  <br />
                  {new Date(o.createdAt).toLocaleDateString()}
                </small>
              </span>
              <span>
                {o.items.map((i) => (
                  <small key={i._id}>
                    {i.quantity}× {i.title}
                    <br />
                  </small>
                ))}
              </span>
              <span>
                <b>{formatPrice(o.total)}</b>
                <small className="payment-record">
                  {o.paymentMethod?.replaceAll("-", " ")}
                  {o.paymentReference && (
                    <>
                      <br />Ref: {o.paymentReference}
                    </>
                  )}
                </small>
              </span>
              <span>
                <select
                  value={o.status}
                  onChange={(e) => status(o._id, e.target.value)}
                >
                  {[
                    "pending",
                    "confirmed",
                    "shipped",
                    "completed",
                    "cancelled",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </span>
            </div>
          ))}
        </div>
      )}
      {tab === "products" && (
        <div className="admin-table">
          <div className="table-row product-row head">
            <span>Product</span>
            <span>Category</span>
            <span>Price / stock</span>
            <span>Action</span>
          </div>
          {products.map((p) => (
            <div className="table-row product-row" key={p._id}>
              <span>
                <b>{p.title}</b>
                <small>
                  {p.brand} · {p.size}
                </small>
              </span>
              <span>{p.category}</span>
              <span>
                {formatPrice(p.price)} · {p.stock}
              </span>
              <span className="row-actions">
                <button onClick={() => edit(p)}>Edit</button>
                <button className="danger" onClick={() => remove(p._id)}>
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
      {tab === "add" && (
        <form className="product-form" onSubmit={create}>
          <h2>
            {editing ? "Edit inventory product" : "Add inventory product"}
          </h2>
          {Object.keys(empty).map((key) =>
            key === "description" ? (
              <label className="wide" key={key}>
                {key}
                <textarea
                  value={draft[key]}
                  onChange={(e) =>
                    setDraft({ ...draft, [key]: e.target.value })
                  }
                />
              </label>
            ) : key === "category" ? (
              <label key={key}>
                Category
                <select
                  value={draft.category}
                  onChange={(e) =>
                    setDraft({ ...draft, category: e.target.value })
                  }
                >
                  <option>Tyres</option>
                  <option>Rims</option>
                  <option>Wheel Packages</option>
                </select>
              </label>
            ) : (
              <label key={key}>
                {key}
                <input
                  required={!["vehicle"].includes(key)}
                  type={["price", "stock"].includes(key) ? "number" : "text"}
                  value={draft[key]}
                  onChange={(e) =>
                    setDraft({ ...draft, [key]: e.target.value })
                  }
                />
              </label>
            ),
          )}
          <button className="place-order">
            {editing ? "Save changes" : "Create product"}
          </button>
        </form>
      )}
    </main>
  );
}

function Footer() {
  return (
    <footer id="footer">
      <div className="footer-top">
        <Link className="logo footer-logo" to="/" aria-label="Wheels & Wheels home">
          <img src="/wheels-and-wheels-logo-600.png" alt="Wheels and Wheels" width="600" height="203" loading="lazy" decoding="async" />
        </Link>
        <p>
          Premium wheels, honest advice and precise fitment — from Lahore to all
          of Pakistan.
        </p>
        <div>
          <a
            href="https://www.facebook.com/profile.php?id=61580828295960"
            target="_blank"
            rel="noreferrer"
            aria-label="Wheels and Wheels on Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/wheelsandwheels_/"
            target="_blank"
            rel="noreferrer"
            aria-label="Wheels and Wheels on Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Message Wheels and Wheels on WhatsApp"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
      <div className="footer-grid">
        <div>
          <h4>Visit our showroom</h4>
          <p>
            <FaMapMarkerAlt /> Old Tyre Market, near Rawali Cinema and Railway
            Station,
            <br />
            Aslam Khan Road, Lahore
          </p>
        </div>
        <div>
          <h4>Call & WhatsApp</h4>
          <p>
            0321 4229594
            <br />
            0339 0045836
          </p>
        </div>
        <div>
          <h4>Opening hours</h4>
          <p>
            Monday–Saturday · 12pm–9pm
            <br />
            Sunday · Closed
          </p>
        </div>
        <div>
          <h4>Find tyres</h4>
          <p className="footer-links">
            <Link to="/tyre-sizes">By tyre size</Link>
            <Link to="/vehicles">By vehicle</Link>
            <Link to="/brands">By brand</Link>
            <Link to="/tyres/japanese">Japanese tyres</Link>
            <Link to="/tyres/chinese">Chinese tyres</Link>
            <Link to="/tyres/premium">Premium tyres</Link>
            <Link to="/rims">Alloy rims</Link>
          </p>
        </div>
        <div>
          <h4>Helpful information</h4>
          <p className="footer-links">
            <Link to="/guides">Tyre blog &amp; guides</Link>
            <Link to="/guides/topics/tyre-size-and-fitment">Size &amp; fitment guides</Link>
            <Link to="/guides/topics/buying-tyres-in-pakistan">Tyre buying guides</Link>
            <Link to="/guides/topics/tyre-care-and-road-safety">Tyre care guides</Link>
            <Link to="/services">Wheel services</Link>
            <Link to="/about">About us</Link>
            <Link to="/lahore-tyre-shop">Lahore tyre shop</Link>
            <Link to="/contact">Contact & location</Link>
            <Link to="/faq">Questions & answers</Link>
            <Link to="/quote">Ask current rate</Link>
          </p>
        </div>
      </div>
      <div className="copyright">
        © {new Date().getFullYear()} Wheels &amp; Wheels{" "}
        <span>Current rates. Fitment checked before supply.</span>
      </div>
    </footer>
  );
}

function NotFound() {
  return (
    <main className="not-found-page">
      <SeoHead
        title="Page Not Found"
        description="The requested Wheels & Wheels page could not be found."
        noIndex
      />
      <section>
        <p className="eyebrow">404 · PAGE NOT FOUND</p>
        <h1>This road ends here.</h1>
        <p>
          The page may have moved or the address may be incorrect. Choose a
          useful route below.
        </p>
        <div>
          <Link className="primary" to="/">Return home</Link>
          <Link className="secondary" to="/shop">Browse tyres and rims</Link>
          <Link className="secondary" to="/contact">Contact us</Link>
        </div>
      </section>
    </main>
  );
}

export function AppShell({ initialCart = [], routeComponents = {} }) {
  const { pathname } = useLocation();
  const [cart, setCart] = useState(initialCart);
  const [cartStorageReady, setCartStorageReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState(PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  useEffect(() => {
    const needsCatalog =
      pathname === "/" ||
      pathname.startsWith("/shop") ||
      pathname.startsWith("/product/");
    if (!needsCatalog || catalogLoaded) return;
    api("/products")
      .then(setProducts)
      .catch(() => setProducts(PRODUCTS))
      .finally(() => {
        setLoading(false);
        setCatalogLoaded(true);
      });
  }, [catalogLoaded, pathname]);
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("ww-cart") || "[]");
      if (Array.isArray(savedCart)) setCart(savedCart);
    } catch {
      localStorage.removeItem("ww-cart");
    } finally {
      setCartStorageReady(true);
    }
  }, []);
  useEffect(() => {
    if (cartStorageReady) {
      localStorage.setItem("ww-cart", JSON.stringify(cart));
    }
  }, [cart, cartStorageReady]);
  const add = (p) => {
    if (!p.onRequest && p.stock < 1) return;
    const maximum = p.onRequest ? 20 : p.stock;
    setCart((c) => {
      const hit = c.find((i) => i._id === p._id);
      return hit
        ? c.map((i) =>
            i._id === p._id ? { ...i, qty: Math.min(i.qty + 1, maximum) } : i,
          )
        : [...c, { ...p, qty: 1 }];
    });
    setOpen(true);
  };
  const change = (id, n) =>
    setCart((c) =>
      c
        .map((i) =>
          i._id === id
            ? {
                ...i,
                qty: Math.min(i.onRequest ? 20 : i.stock, i.qty + n),
              }
            : i,
        )
        .filter((i) => i.qty > 0),
    );
  const clear = () => setCart([]);
  const isAdmin = pathname.startsWith("/admin");
  // The browser keeps these routes code-split. The server renderer supplies
  // eager equivalents so generated HTML contains the real page instead of a
  // Suspense loading placeholder; React then hydrates the same markup.
  const RouteDiscoveryHub = routeComponents.DiscoveryHub || DiscoveryHub;
  const RouteBrandsHub = routeComponents.BrandsHub || BrandsHub;
  const RouteVehiclesHub = routeComponents.VehiclesHub || VehiclesHub;
  const RouteTyreSizesHub = routeComponents.TyreSizesHub || TyreSizesHub;
  const RouteGuidesHub = routeComponents.GuidesHub || GuidesHub;
  const RouteGuideTopicPage = routeComponents.GuideTopicPage || GuideTopicPage;
  const RouteGuideArticle = routeComponents.GuideArticle || GuideArticle;
  const RouteCommercialLandingPage = routeComponents.CommercialLandingPage || CommercialLandingPage;
  const RouteBrandLandingPage = routeComponents.BrandLandingPage || BrandLandingPage;
  const RouteVehicleLandingPage = routeComponents.VehicleLandingPage || VehicleLandingPage;
  const RouteSizeLandingPage = routeComponents.SizeLandingPage || SizeLandingPage;
  const RouteAboutPage = routeComponents.AboutPage || AboutPage;
  const RouteContactPage = routeComponents.ContactPage || ContactPage;
  const RouteServicesPage = routeComponents.ServicesPage || ServicesPage;
  const RouteLahoreTyreShopPage = routeComponents.LahoreTyreShopPage || LahoreTyreShopPage;
  const RouteFAQPage = routeComponents.FAQPage || FAQPage;
  return (
    <>
      <RouteEffects />
      {!isAdmin && (
        <Header
          count={cart.reduce((s, i) => s + i.qty, 0)}
          openCart={() => setOpen(true)}
        />
      )}
      <Suspense fallback={<main className="route-loading" role="status">Loading tyre guide…</main>}>
      <Routes>
        <Route path="/" element={<Home add={add} products={products} />} />
        <Route path="/tyres" element={<RouteDiscoveryHub />} />
        <Route path="/tyres/japanese" element={<RouteCommercialLandingPage pageKey="japanese-tyres" />} />
        <Route path="/tyres/chinese" element={<RouteCommercialLandingPage pageKey="chinese-tyres" />} />
        <Route path="/tyres/premium" element={<RouteCommercialLandingPage pageKey="premium-tyres" />} />
        <Route path="/rims" element={<RouteCommercialLandingPage pageKey="alloy-rims" />} />
        <Route path="/brands" element={<RouteBrandsHub />} />
        <Route path="/brands/:slug" element={<RouteBrandLandingPage />} />
        <Route path="/vehicles" element={<RouteVehiclesHub />} />
        <Route path="/vehicles/:slug" element={<RouteVehicleLandingPage />} />
        <Route path="/tyre-sizes" element={<RouteTyreSizesHub />} />
        <Route path="/tyre-sizes/:slug" element={<RouteSizeLandingPage />} />
        <Route path="/guides" element={<RouteGuidesHub />} />
        <Route path="/guides/topics/:slug" element={<RouteGuideTopicPage />} />
        <Route path="/guides/:slug" element={<RouteGuideArticle />} />
        <Route path="/about" element={<RouteAboutPage />} />
        <Route path="/contact" element={<RouteContactPage />} />
        <Route path="/services" element={<RouteServicesPage />} />
        <Route path="/lahore-tyre-shop" element={<RouteLahoreTyreShopPage />} />
        <Route path="/faq" element={<RouteFAQPage />} />
        <Route
          path="/shop"
          element={<Shop add={add} products={products} loading={loading} />}
        />
        <Route
          path="/product/:id"
          element={<ProductDetail products={products} add={add} />}
        />
        <Route
          path="/checkout"
          element={
            ONLINE_CHECKOUT_ENABLED ? (
              <Checkout cart={cart} clear={clear} />
            ) : (
              <Navigate to="/quote" replace />
            )
          }
        />
        <Route
          path="/track"
          element={
            CUSTOMER_PORTAL_ENABLED ? <TrackOrder /> : <Navigate to="/" replace />
          }
        />
        <Route path="/quote" element={<QuoteRequest />} />
        <Route
          path="/quote-status"
          element={
            CUSTOMER_PORTAL_ENABLED ? <QuoteStatus /> : <Navigate to="/quote" replace />
          }
        />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      {!isAdmin && (
        <>
          <Cart
            open={open}
            close={() => setOpen(false)}
            cart={cart}
            change={change}
          />
          <FloatingWhatsApp />
          <MobileNavigation
            count={cart.reduce((sum, item) => sum + item.qty, 0)}
            openCart={() => setOpen(true)}
          />
          <Footer />
        </>
      )}
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
