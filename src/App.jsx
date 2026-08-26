import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  FaBars,
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
import { api } from "./api";
import ServiceDetail from "./components/ServiceDetail.jsx";
import FloatingWhatsApp from "./components/FloatingWhatsApp.jsx";

const WHATSAPP = "923390045836";
const ONLINE_CHECKOUT_ENABLED = false;
const CUSTOMER_PORTAL_ENABLED = false;
const BRAND_PRIORITY = [
  "Michelin", "Pirelli", "Continental", "Dunlop", "Yokohama",
  "Bridgestone", "Toyo", "Nitto", "Falken", "APLUS", "Sailun",
  "Linglong", "Triangle", "RoadX",
];
const brandPriority = (brand) => {
  const index = BRAND_PRIORITY.indexOf(brand);
  return index === -1 ? BRAND_PRIORITY.length : index;
};
const TYRE_PROFILE_GUIDE = {
  12: [70, 80], 13: [65, 70, 80], 14: [60, 65, 70, 75],
  15: [55, 60, 65, 70], 16: [45, 50, 55, 60, 65, 70],
  17: [40, 45, 50, 55, 60, 65], 18: [35, 40, 45, 50, 55, 60],
  19: [30, 35, 40, 45, 50, 55], 20: [30, 35, 40, 45, 50, 55, 60],
  21: [30, 35, 40, 45, 50], 22: [25, 30, 35, 40, 45, 50, 55],
  23: [25, 30, 35, 40, 45], 24: [25, 30, 35, 40, 45],
};

function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const root = document.documentElement;
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
  return (
    <article className="product-card">
      <div className="product-image">
        <Link to={`/product/${product._id}`}>
          <img src={product.image} alt={product.title} />
        </Link>
        {product.badge && <span className="pill">{product.badge}</span>}
        <button
          className="quick-add"
          onClick={() => add(product)}
          aria-label={`Add ${product.title} to cart`}
        >
          <FaPlus />
        </button>
      </div>
      <div className="product-copy">
        <div className="eyebrow">
          {product.brand} · {product.category}
        </div>
        <h3>
          <Link to={`/product/${product._id}`}>{product.title}</Link>
        </h3>
        <div className="spec-row">
          <span>{product.size}</span>
          <span>{product.vehicle}</span>
        </div>
        <div className="rating">
          <FaStar /> {product.rating} <span>· {product.stock} in stock</span>
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
          Save selection <FaChevronRight />
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
            <span className="diameter-image"><img src={isRim ? "/Rim1.jpg" : "/tyre.jpg"} alt={`${diameter} inch ${isRim ? "alloy rim" : "tyre"}`} /><i>ASK US</i></span>
            <span className="diameter-copy"><small>{isRim ? "ALLOY RIM" : "TYRE FITMENT"}</small><strong>{diameter}<sup>″</sup></strong>{!isRim && <em>Profiles {TYRE_PROFILE_GUIDE[diameter].join(" · ")}</em>}<b>Check current options <FaChevronRight /></b></span>
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
            {!isRim && <p className="modal-profiles"><b>Common profiles:</b> {selected.profiles.join(", ")}. Share your full tyre size or vehicle model for an exact match.</p>}
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
  return (
    <>
      <div className="announcement">
        <span className="announcement-offer">
          Free Lahore delivery on orders over Rs. 50,000
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
        <Link className="logo" to="/">
          <img src="/wheels-and-wheels-logo.png" alt="Wheels and Wheels" />
        </Link>
        <nav className={open ? "nav-open" : ""}>
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/shop" onClick={() => setOpen(false)}>
            Shop
          </Link>
          <a href="/#services" onClick={() => setOpen(false)}>
            Services
          </a>
          <Link to="/quote" onClick={() => setOpen(false)}>
            Get a quote
          </Link>
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
            <span>Cart</span>
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
      <Link className={pathname.startsWith("/shop") || pathname.startsWith("/product") ? "active" : ""} to="/shop?category=All%20Tyres">
        <FaSearch /><span>Tyres</span>
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
  return (
    <main>
      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow light">PAKISTAN'S WHEEL SPECIALISTS</div>
          <h1>
            Own every
            <br />
            <em>turn.</em>
          </h1>
          <p>
            Premium tyres and statement rims, expertly matched to your car and
            delivered nationwide.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => navigate("/shop")}>
              Shop all products <FaChevronRight />
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
              <b>15+</b> trusted brands
            </span>
            <span>
              <b>20 years</b> fitment expertise
            </span>
            <span>
              <b>Nationwide</b> delivery
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
                onChange={(event) =>
                  setFitment({ ...fitment, width: event.target.value })
                }
              >
                {[
                  155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255,
                  265, 275, 285, 295, 305, 315, 325, 335, 345, 355,
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              PROFILE
              <select
                value={fitment.profile}
                onChange={(event) =>
                  setFitment({ ...fitment, profile: event.target.value })
                }
              >
                {[35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
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
                {Array.from({ length: 13 }, (_, index) => index + 12).map(
                  (value) => (
                    <option key={value} value={value}>
                      {value} inch
                    </option>
                  ),
                )}
              </select>
            </label>
          </div>
          <button
            onClick={() =>
              navigate(
                `/shop?category=Tyres&size=${fitment.width}%2F${fitment.profile}%20R${fitment.rim}`,
              )
            }
          >
            Show matching tyres <FaChevronRight />
          </button>
        </div>
      </section>
      <section className="trust-strip">
        <span>
          <FaTruck />
          <b>Nationwide delivery</b>
          <small>Safe, tracked shipping</small>
        </span>
        <span>
          <FaCheck />
          <b>Genuine products</b>
          <small>Official brand warranty</small>
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
          to="/shop?category=Premium%20%26%20Japanese"
          className="category japan-cat"
        >
          <span>01</span>
          <div>
            <small>PREMIUM FIRST. JAPANESE HERITAGE.</small>
            <h2>Premium &amp; Japanese</h2>
            <p>Michelin, Pirelli and Continental, followed by leading Japanese brands.</p>
            <b>
              Explore premium tyres <FaChevronRight />
            </b>
          </div>
        </Link>
        <Link
          to="/shop?category=Chinese%20Brands"
          className="category china-cat"
        >
          <span>02</span>
          <div>
            <small>VALUE. RANGE. AVAILABILITY.</small>
            <h2>Chinese brands</h2>
            <p>Trusted value-focused brands across 12–24 inch requirements.</p>
            <b>
              Explore Chinese brands <FaChevronRight />
            </b>
          </div>
        </Link>
        <Link to="/shop?category=Rims" className="category rim-cat">
          <span>03</span>
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
            <img src="/tyreinstallation.jpg" />
            <h3>Tyre installation</h3>
            <p>Safe, careful fitting with new valves and exact pressure.</p>
            <strong>
              Learn why it matters <FaChevronRight />
            </strong>
          </Link>
          <Link className="service-card" to="/services/wheel-balancing">
            <b>02</b>
            <img src="/wheelbalancing.jpg" />
            <h3>Computerised balancing</h3>
            <p>Smoother driving and even tread wear at every speed.</p>
            <strong>
              Learn why it matters <FaChevronRight />
            </strong>
          </Link>
          <Link className="service-card" to="/services/wheel-alignment">
            <b>03</b>
            <img src="/wheelalignment.jpeg" />
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
  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("category");
  const initial =
    requestedCategory === "Tyres"
      ? "All Tyres"
      : requestedCategory === "Chinese Tyres"
        ? "Chinese Brands"
        : requestedCategory === "Japanese Tyres"
          ? "Japanese Brands"
          : requestedCategory || "All Tyres";
  const [size, setSize] = useState(params.get("size") || "");
  const [category, setCategory] = useState(initial);
  const [rim, setRim] = useState("");
  const [width, setWidth] = useState("");
  const [profile, setProfile] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const profileOptions = rim
    ? TYRE_PROFILE_GUIDE[Number(rim)] || []
    : [35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85];
  const items = useMemo(
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
  return (
    <main className="shop-page">
      <div className="shop-banner">
        <div className="eyebrow light">THE COLLECTION</div>
        <h1>Find your next set.</h1>
        <p>Genuine tyres and rims, selected for Pakistan's roads.</p>
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
                  setSize("");
                }}
              >
                <option value="">Any width</option>
                {[
                  155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265,
                  275, 285, 295, 305, 315, 325, 335, 345, 355,
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            )}
            {category !== "Rims" && (
              <select
                value={profile}
                onChange={(event) => {
                  setProfile(event.target.value);
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
                if (
                  nextRim &&
                  profile &&
                  !TYRE_PROFILE_GUIDE[Number(nextRim)]?.includes(Number(profile))
                )
                  setProfile("");
                setSize("");
              }}
            >
              <option value="">12–24 inch</option>
              {Array.from({ length: 13 }, (_, index) => index + 12).map(
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
            <h2>Shopping cart</h2>
          </div>
          <button onClick={close}>
            <FaTimes />
          </button>
        </div>
        {cart.length === 0 ? (
          <div className="cart-empty">
            <FaShoppingBag />
            <h3>Your cart is empty</h3>
            <p>Explore our collection and find the perfect setup.</p>
            <Link to="/shop" onClick={close}>
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((i) => (
                <article key={i._id}>
                  <img src={i.image} />
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
  const product = products.find((p) => p._id === id) || remote;
  useEffect(() => {
    if (!products.find((p) => p._id === id))
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
      <main className="detail-page">
        <div className="empty">Product not found.</div>
      </main>
    );
  if (!product)
    return (
      <main className="detail-page">
        <div className="empty">Loading product…</div>
      </main>
    );
  return (
    <main className="detail-page">
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
          <img src={product.image} alt={product.title} />
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
            <FaStar /> {product.rating} <span>· Genuine product</span>
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
              <b>
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </b>
            </span>
          </div>
          <button
            className="detail-add"
            disabled={!product.stock}
            onClick={() => add(product)}
          >
            <FaShoppingBag /> {product.stock ? "Save to selection" : "Out of stock"}
          </button>
          <div className="detail-benefits">
            <span>
              <FaCheck /> Genuine brand warranty
            </span>
            <span>
              <FaTruck /> Nationwide tracked delivery
            </span>
            <span>
              <FaWhatsapp /> Expert fitment confirmation
            </span>
          </div>
        </div>
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

function SalesInsights({ summary }) {
  const sales = summary.dailySales || [];
  const max = Math.max(1, ...sales.map((d) => d.sales));
  const statusMap = Object.fromEntries(
    (summary.statuses || []).map((s) => [s._id, s.count]),
  );
  return (
    <section className="insights">
      <div className="sales-panel">
        <div className="panel-title">
          <div>
            <small>LAST 30 DAYS</small>
            <h2>Sales performance</h2>
          </div>
          <b>{formatPrice(sales.reduce((sum, d) => sum + d.sales, 0))}</b>
        </div>
        <div className="sales-chart">
          {sales.length ? (
            sales.map((d) => (
              <div
                className="bar-wrap"
                key={d._id}
                title={`${d._id}: ${formatPrice(d.sales)} · ${d.orders} orders`}
              >
                <span
                  style={{ height: `${Math.max(5, (d.sales / max) * 100)}%` }}
                ></span>
                <small>
                  {new Date(`${d._id}T00:00:00`).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                  })}
                </small>
              </div>
            ))
          ) : (
            <div className="no-data">
              Sales will appear after orders are placed.
            </div>
          )}
        </div>
        <div className="status-strip">
          {["pending", "confirmed", "shipped", "completed", "cancelled"].map(
            (s) => (
              <span key={s}>
                <i className={s}></i>
                <b>{statusMap[s] || 0}</b> {s}
              </span>
            ),
          )}
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
            <small>BY UNITS SOLD</small>
            <h2>Best sellers</h2>
          </div>
        </div>
        {(summary.bestSellers || []).map((p, i) => (
          <div className="seller-row" key={p._id}>
            <b>0{i + 1}</b>
            <span>
              {p.title}
              <small>{formatPrice(p.sales)} sales</small>
            </span>
            <strong>{p.units} sold</strong>
          </div>
        ))}
        {!summary.bestSellers?.length && (
          <div className="no-data">Best sellers will appear here.</div>
        )}
      </div>
    </section>
  );
}

function TrackOrder() {
  const trackParams = new URLSearchParams(window.location.search);
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
  const quoteParams = new URLSearchParams(window.location.search);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Lahore",
    vehicle: "",
    tyreSize: quoteParams.get("tyreSize") || "",
    budget: "",
    message: quoteParams.get("message") || "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
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
        <div className="order-success">
          <FaCheck />
          <div className="eyebrow">REQUEST RECEIVED</div>
          <h1>We’re preparing your options.</h1>
          <p>
            Your RFQ number is <b>{result.inquiryId}</b>. Our team will contact
            you on <b>{form.phone}</b>.
          </p>
          <button className="copy-reference" type="button" onClick={() => navigator.clipboard?.writeText(result.inquiryId)}>Copy RFQ reference</button>
          <a
            className="primary"
            href={`https://wa.me/923390045836?text=${encodeURIComponent(`Hi, I just submitted RFQ ${result.inquiryId}.`)}`}
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp /> Continue on WhatsApp
          </a>
        </div>
      </main>
    );
  return (
    <main className="quote-page">
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
            <FaCheck /> Email alert sent to our sales team
          </span>
          <span>
            <FaCheck /> Reply by phone, email or WhatsApp
          </span>
        </div>
      </section>
      <form className="quote-form" onSubmit={submit}>
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
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label>
            Email
            <input
              type="email"
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
  const params = new URLSearchParams(window.location.search);
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
            <div><FaCheck /><div><small>RFQ REFERENCE</small><b>{quote.inquiryId}</b></div></div>
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
            <a className="primary quote-accept" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`I would like to accept/discuss quotation ${quote.inquiryId}.`)}`} target="_blank" rel="noreferrer"><FaWhatsapp /> Accept or discuss on official WhatsApp</a>
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
      setMessage(sendReply ? (result.emailSent ? "Quote saved and emailed." : "Quote saved. No customer email—use WhatsApp.") : "Draft saved.");
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

function Admin() {
  const [token, setToken] = useState(localStorage.getItem("ww-admin-token"));
  const [login, setLogin] = useState({
    email: "admin@wheelsandwheels.pk",
    password: "",
  });
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({});
  const [error, setError] = useState("");
  const [tab, setTab] = useState("orders");
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
  const load = async () => {
    try {
      const [o, p, s, inquiriesResult] = await Promise.all([
        api("/orders"),
        api("/products"),
        api("/admin/summary"),
        api("/inquiries"),
      ]);
      setOrders(o);
      setProducts(p);
      setSummary(s);
      setInquiries(inquiriesResult);
    } catch (e) {
      setError(e.message);
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
          <h1>Store dashboard</h1>
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
          <small>New RFQs</small>
          <b>{summary.newInquiries || 0}</b>
        </article>
        <article>
          <small>Total orders</small>
          <b>{summary.orders || 0}</b>
        </article>
        <article>
          <small>Pending</small>
          <b>{summary.pending || 0}</b>
        </article>
        <article>
          <small>Revenue</small>
          <b>{summary.revenue ? formatPrice(summary.revenue) : "Rs. 0"}</b>
        </article>
      </div>
      <details className="admin-guide">
        <summary>How to manage orders, payments and quotations</summary>
        <div>
          <article><b>Orders</b><p>Open Orders. Verify the customer and items, then change Pending to Confirmed only after stock, fitment and payment are checked. Use Shipped when dispatched and Completed after delivery.</p></article>
          <article><b>Customer contact</b><p>Online checkout and payment are disabled. Customers send selected products through official WhatsApp or call 0321 4229594 so you can personally confirm current rate, fitment, stock and delivery.</p></article>
          <article><b>Rate requests</b><p>Open RFQs, choose Prepare quotation, enter the amount, exact products and availability, then write your response. Save Draft keeps it private. Save &amp; Send Quote changes it to Quoted and emails the customer when an email is available.</p></article>
          <article><b>Customer tracking</b><p>Customers use the full order/RFQ reference plus the same phone number they submitted. Update statuses promptly because the public pages read these values directly from the database.</p></article>
        </div>
      </details>
      <SalesInsights summary={summary} />
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
          Orders
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
                <a
                  className="admin-whatsapp"
                  href={`https://wa.me/${item.phone.replace(/\D/g, "").replace(/^0/, "92")}`}
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
        <Link className="logo footer-logo" to="/">
          <img src="/wheels-and-wheels-logo.png" alt="Wheels and Wheels" />
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
          >
            <FaInstagram />
          </a>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
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
      </div>
      <div className="copyright">
        © {new Date().getFullYear()} Wheels &amp; Wheels{" "}
        <span>Genuine products. Professional fitment.</span>
      </div>
    </footer>
  );
}

function AppShell() {
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("ww-cart") || "[]"),
  );
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState(PRODUCTS);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api("/products")
      .then(setProducts)
      .catch(() => setProducts(PRODUCTS))
      .finally(() => setLoading(false));
  }, []);
  useEffect(
    () => localStorage.setItem("ww-cart", JSON.stringify(cart)),
    [cart],
  );
  const add = (p) => {
    if (p.stock < 1) return;
    setCart((c) => {
      const hit = c.find((i) => i._id === p._id);
      return hit
        ? c.map((i) =>
            i._id === p._id ? { ...i, qty: Math.min(i.qty + 1, p.stock) } : i,
          )
        : [...c, { ...p, qty: 1 }];
    });
    setOpen(true);
  };
  const change = (id, n) =>
    setCart((c) =>
      c
        .map((i) =>
          i._id === id ? { ...i, qty: Math.min(i.stock, i.qty + n) } : i,
        )
        .filter((i) => i.qty > 0),
    );
  const clear = () => setCart([]);
  const isAdmin = window.location.pathname.startsWith("/admin");
  return (
    <>
      <RouteEffects />
      {!isAdmin && (
        <Header
          count={cart.reduce((s, i) => s + i.qty, 0)}
          openCart={() => setOpen(true)}
        />
      )}
      <Routes>
        <Route path="/" element={<Home add={add} products={products} />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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
