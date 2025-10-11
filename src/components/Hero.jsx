import React, { useEffect, useRef } from "react";
import Ripple from "./Ripple.jsx";

export default function Hero() {
  const heroRef = useRef(null);

  // Parallax background
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const y = Math.min(60, window.scrollY * 0.1);
      hero.style.backgroundPosition = `center calc(50% + ${y}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero" id="home" data-parallax ref={heroRef}>
      <div className="hero-content reveal">
        <h2>Welcome to WHEELS AND WHEELS</h2>
        <p>Your trusted shop for tyres, rims, and wheels.</p>
        <p>We deliver all over Pakistan.</p>
        <Ripple
          as="a"
          href="#products"
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById("products");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="btn btn-primary"
          data-ripple="true"
        >
          Explore Products
        </Ripple>
      </div>
    </section>
  );
}
