import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { SERVICES } from "../Data/services.js";

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    return (
      <main className="service-page">
        <div className="service-container">
          <h1 className="service-title">Service Not Found</h1>
          <p className="service-summary">
            The service you’re looking for doesn’t exist.
          </p>
          <Link className="btn" to="/#services">
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

  const bestFor = service.bestFor ?? [];
  const bullets = service.bullets ?? [];
  const extras = service.extras ?? [];

  return (
    <main className="service-page">
      <div className="service-hero">
        {service.heroImg && (
          <img
            src={service.heroImg}
            alt={service.title}
            className="service-hero-img"
          />
        )}
        <div className="service-hero-copy">
          <button className="link-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1 className="service-title">{service.title}</h1>
          <p className="service-tagline">{service.tagline}</p>
          <p className="service-summary">{service.summary}</p>

          <div className="service-tags">
            {bestFor.map((t, i) => (
              <span className="pill" key={i}>
                {t}
              </span>
            ))}
          </div>

          <div className="service-cta-row"></div>
        </div>
      </div>

      <div className="service-sections">
        <section className="card">
          <h2>What’s Included</h2>
          <ul className="list">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Why It Matters</h2>
          <p>
            Correct service ensures safety, comfort, and tyre longevity. It
            prevents premature wear, reduces vibration, improves fuel economy,
            and protects suspension components.
          </p>
          {extras.length > 0 && (
            <>
              <h3 className="mt">Expert Advantages</h3>
              <ul className="list">
                {extras.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="card spec">
          <div>
            <h2>Estimated Time</h2>
            <p>{service.time}</p>
          </div>
          <div>
            <h2>Pricing</h2>
            <p>{service.pricing}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
