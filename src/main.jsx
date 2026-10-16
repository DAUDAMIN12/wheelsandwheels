import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./style.css";
import App from "./App.jsx";
import VEHICLE_MAKE_SLUGS from "./Data/vehicleMakeSlugs.js";

const container = document.getElementById("root");

const loadInitialRouteComponent = async (pathname) => {
  const route = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (["/tyres", "/brands", "/vehicles", "/tyre-sizes"].includes(route)) {
    const module = await import("./components/growth/DiscoveryHub.jsx");
    return {
      DiscoveryHub: module.default,
      BrandsHub: module.BrandsHub,
      VehiclesHub: module.VehiclesHub,
      TyreSizesHub: module.TyreSizesHub,
    };
  }
  if (route === "/guides") {
    const module = await import("./components/growth/GuidesHub.jsx");
    return { GuidesHub: module.default };
  }
  if (route.startsWith("/guides/topics/")) {
    const module = await import("./components/growth/GuideTopicPage.jsx");
    return { GuideTopicPage: module.default };
  }
  if (route.startsWith("/guides/")) {
    const module = await import("./components/growth/GuideArticle.jsx");
    return { GuideArticle: module.default };
  }
  if (route === "/tools" || route.startsWith("/tools/")) {
    const module = await import("./components/growth/TyreTools.jsx");
    return {
      ToolsHub: module.ToolsHub,
      TyreSizeCalculator: module.TyreSizeCalculator,
      TyreDateCodeChecker: module.TyreDateCodeChecker,
    };
  }
  if (["/tyres/japanese", "/tyres/chinese", "/tyres/premium", "/rims"].includes(route)) {
    const module = await import("./components/growth/CommercialLandingPage.jsx");
    return { CommercialLandingPage: module.default };
  }
  if (route === "/tyre-prices-pakistan") {
    const module = await import("./components/growth/MarketPages.jsx");
    return { TyreRatesPage: module.TyreRatesPage };
  }
  if (route.startsWith("/brands/") || route.startsWith("/tyre-sizes/")) {
    const module = await import("./components/growth/SeoLandingPage.jsx");
    return {
      BrandLandingPage: module.BrandLandingPage,
      SizeLandingPage: module.SizeLandingPage,
    };
  }
  if (route.startsWith("/vehicles/")) {
    const slug = route.slice("/vehicles/".length);
    if (VEHICLE_MAKE_SLUGS.includes(slug)) {
      const module = await import("./components/growth/MarketPages.jsx");
      return { VehicleMakePage: module.VehicleMakePage };
    }
    const module = await import("./components/growth/SeoLandingPage.jsx");
    return { VehicleLandingPage: module.VehicleLandingPage };
  }
  if (["/about", "/contact", "/services", "/lahore-tyre-shop", "/faq", "/privacy"].includes(route)) {
    const module = await import("./components/growth/BusinessPages.jsx");
    return {
      AboutPage: module.AboutPage,
      ContactPage: module.ContactPage,
      ServicesPage: module.ServicesPage,
      LahoreTyreShopPage: module.LahoreTyreShopPage,
      FAQPage: module.FAQPage,
      PrivacyPage: module.PrivacyPage,
    };
  }
  return {};
};

const start = async () => {
  let routeComponents = {};
  if (container.hasChildNodes()) {
    try {
      routeComponents = await loadInitialRouteComponent(window.location.pathname);
    } catch (error) {
      console.error("Could not preload the initial route", error);
    }
  }
  const application = (
    <StrictMode>
      <App routeComponents={routeComponents} />
    </StrictMode>
  );
  if (container.hasChildNodes()) hydrateRoot(container, application);
  else createRoot(container).render(application);
};

start();
