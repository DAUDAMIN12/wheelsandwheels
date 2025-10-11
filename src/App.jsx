import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

import Nav from "./components/Nav.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import Hero from "./components/Hero.jsx";
import Products from "./components/Products.jsx";
import Services from "./Components/Services.jsx";
import Contact from "./Components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import ToTop from "./Components/ToTop.jsx";
import useScrollFX from "./hooks/useScrollFX.js";
import ServiceDetail from "./components/ServiceDetail.jsx";

// NEW: products landing page route
import ProductsLanding from "./components/ProductsLanding.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import BrandShowcase from "./components/BrandShowcase.jsx";
import FloatingWhatsApp from "./components/FloatingWhatsApp.jsx";

// Utility: smooth-scroll to an id
const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ---------------------------
   Global Layout (nav + footer)
   Adds page-enter on route change
---------------------------- */
function Layout() {
  const location = useLocation();

  // mark JS enabled (for .reveal CSS)
  useEffect(() => {
    document.documentElement.classList.add("js-enabled");
    document.documentElement.classList.remove("no-js");
  }, []);

  // Page-load fade for whole app (and on every route change)
  useEffect(() => {
    document.body.classList.add("page-enter");
    const t = setTimeout(() => {
      document.body.classList.remove("page-enter");
    }, 1500); // keep in sync with CSS
    return () => clearTimeout(t);
  }, [location.pathname]);

  // Theme state (persisted)
  const [themeLight, setThemeLight] = useState(() => {
    return localStorage.getItem("ww-theme") === "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (themeLight) root.classList.add("light");
    else root.classList.remove("light");
    localStorage.setItem("ww-theme", themeLight ? "light" : "dark");
  }, [themeLight]);

  // Sections used for nav + scrollspy (only meaningful on home)
  const sections = useMemo(
    () => ["home", "products", "services", "contact"],
    []
  );
  const [activeId, setActiveId] = useState("home");

  // Scrollspy only when we are on the homepage
  useEffect(() => {
    if (location.pathname !== "/") return;
    const targets = sections
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) setActiveId(id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, [sections, location.pathname]);

  const handleNavClick = (id) => {
    // If you're on /products page and click a home section, go home first
    if (location.pathname !== "/") {
      // naive approach: use normal navigation
      window.location.href = `/#${id}`;
      return;
    }
    scrollToId(id);
  };

  return (
    <>
      <ScrollProgress />
      <Nav
        activeId={activeId}
        sections={sections}
        onSelect={handleNavClick}
        themeLight={themeLight}
        setThemeLight={setThemeLight}
      />
      <Outlet />
      <Footer />
      <ToTop />
    </>
  );
}

/* ---------------------------
   Home page content only
---------------------------- */
function HomePage() {
  // Direction-aware scroll animations for `.reveal`
  useScrollFX();

  return (
    <main>
      <Hero />
      <Products />
      <BrandShowcase />
      <Services />
      <Contact />
      <FloatingWhatsApp />
    </main>
  );
}

/* ---------------------------
   App with routes
---------------------------- */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/products" element={<ProductsLanding />} />
          {/* Optional future detail page:
              <Route path="/products/:id" element={<ProductDetail />} /> */}
          {/* Fallback */}

          <Route path="*" element={<ErrorPage />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
