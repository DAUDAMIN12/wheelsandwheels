import React from "react";

const brands = [
  { src: "/Yokohama-Logo.jpg", alt: "Yokohama" },
  { src: "/pirelli.jpg", alt: "Pirelli" },
  { src: "/michelin.png", alt: "Michelin" },
  { src: "/kumho.png", alt: "Kumho" },

  { src: "/GTRadial.jpg", alt: "GT Radial" },
  { src: "/Goodyear-Logo.jpg", alt: "Goodyear" },
  { src: "/Dunlop.jpg", alt: "Dunlop" },
  { src: "/continental.jpg", alt: "Continental" }, // ✅ you have this

  { src: "/bridgestone.jpg", alt: "Bridgestone" }, // ✅ you have this
  { src: "/Nexen.jpg", alt: "Nexen" },
  { src: "/nankang.jpg", alt: "Nankang" },
  { src: "/hankook.jpg", alt: "Hankook" },

  // Add more any time; grid will auto-fit
  // { src: "/somebrand.jpg", alt: "Some Brand" },
];

export default function BrandShowcase() {
  return (
    <section className="brand-showcase reveal" aria-labelledby="brand-title">
      <div className="brand-wrap">
        {/* Left copy block */}
        <div className="brand-copy">
          <h2 id="brand-title">
            Premium Brands <span>at WHEELS AND WHEELS</span>
          </h2>
          <p>
            At WHEELS AND WHEELS , we offer a selection of premium tyre brands,
            ensuring quality, durability, and performance for every vehicle
            type.
          </p>
          x{" "}
        </div>

        {/* Right logo grid */}
        <div className="brand-grid" role="list">
          {brands.map((b, i) => (
            <div className="brand-card" role="listitem" key={i}>
              <img className="brand-logo" src={b.src} alt={b.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
