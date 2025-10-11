import React from "react";
import { useNavigate } from "react-router-dom";
import { SERVICES } from "../Data/services.js";

export default function Services() {
  const navigate = useNavigate();
  const go = (slug) => navigate(`/services/${slug}`);

  return (
    <section id="services">
      <h2 className="reveal">Our Services</h2>

      {/* keep your original layout/classes */}
      <div className="products">
        {SERVICES.map((s) => (
          <div
            key={s.slug}
            className="card reveal"
            role="button"
            tabIndex={0}
            onClick={() => go(s.slug)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") go(s.slug);
            }}
            style={{
              cursor: "pointer",
            }} /* optional: keeps the same visual feel */
          >
            <h3>
              {s.icon ?? "🛠️"} {s.title}
            </h3>
            <p>{s.tagline ?? s.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
