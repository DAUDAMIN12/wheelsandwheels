import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import PRODUCTS_DATA from "../Data/productsData";
import ContactModal from "./ContactModal";

const PAGE_SIZE = 24;

export default function ProductsLanding() {
  const [query, setQuery] = useState("");
  const [serverQuery, setServerQuery] = useState("");
  const [loading] = useState(false);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null); // <-- modal state

  const navigate = useNavigate();
  const location = useLocation();

  const [category, setCategory] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "";
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category") || "";
    setCategory(cat);
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    const t = setTimeout(() => setServerQuery(query.trim()), 450);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setErr("");
    const term = serverQuery.toLowerCase();
    const filtered = PRODUCTS_DATA.filter((p) => {
      const inCategory = !category || p.category === category;
      if (!inCategory) return false;
      if (!term) return true;
      return (
        (p.title || "").toLowerCase().includes(term) ||
        (p.category || "").toLowerCase().includes(term) ||
        (p.desc || "").toLowerCase().includes(term)
      );
    });

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setItems(filtered.slice(start, end));
    setHasMore(end < filtered.length);
  }, [serverQuery, page, category]);

  const onSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setServerQuery(query.trim());
  };

  const skeletonCount = useMemo(() => 8, []);

  return (
    <main className="shop-page" aria-busy={loading}>
      {loading && <LoadingPage text="Loading products..." />}

      <div className="back-container reveal inview enter-down">
        <button
          className="btn btn-ghost back-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>

      <section className="shop-hero reveal inview enter-down">
        <h1>Find Your Perfect Fit</h1>
        <p className="muted">
          Browse tyres, rims, and alloy wheels. Filter instantly.
        </p>
      </section>

      <section className="shop-toolbar reveal inview enter-down">
        <form onSubmit={onSubmit} className="shop-search">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, category, or tags…"
            aria-label="Search products"
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>
      </section>

      <section className="shop-results">
        {err && (
          <div className="shop-error reveal inview enter-down">{err}</div>
        )}

        {loading ? (
          <div className="shop-grid" aria-hidden="true">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <div className="shop-card skeleton" key={i}>
                <div className="skeleton-img" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="shop-grid">
              {items.map((p) => (
                <article
                  className="shop-card reveal inview enter-up"
                  key={p._id}
                >
                  <div className="shop-card__imgwrap">
                    <img
                      src={p.image || "/placeholder-product.jpg"}
                      alt={p.title || "Product"}
                      loading="lazy"
                    />
                    {p.category && <span className="badge">{p.category}</span>}
                  </div>
                  <div className="shop-card__body">
                    <h3>{p.title}</h3>
                    {p.desc && <p className="muted">{p.desc}</p>}
                    <div className="shop-card__meta">
                      <span className="price">Contact for Designs</span>
                      <button
                        className="btn btn-ghost"
                        onClick={() => setSelected(p)} // <-- open modal
                      >
                        View
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="shop-pager reveal inview enter-up">
              <button
                className="btn btn-ghost"
                disabled={page <= 1}
                onClick={() => setPage((n) => Math.max(1, n - 1))}
              >
                ← Prev
              </button>
              <span className="muted">Page {page}</span>
              <button
                className="btn btn-ghost"
                disabled={!hasMore}
                onClick={() => setPage((n) => n + 1)}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </section>

      {/* Modal lives at the end so it overlays everything */}
      <ContactModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        productTitle={selected?.title || ""}
      />
    </main>
  );
}
