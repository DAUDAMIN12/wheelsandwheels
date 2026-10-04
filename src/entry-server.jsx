import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import DiscoveryHub, {
  BrandsHub,
  TyreSizesHub,
  VehiclesHub,
} from "./components/growth/DiscoveryHub.jsx";
import GuidesHub from "./components/growth/GuidesHub.jsx";
import GuideTopicPage from "./components/growth/GuideTopicPage.jsx";
import GuideArticle from "./components/growth/GuideArticle.jsx";
import CommercialLandingPage from "./components/growth/CommercialLandingPage.jsx";
import {
  BrandLandingPage,
  SizeLandingPage,
  VehicleLandingPage,
} from "./components/growth/SeoLandingPage.jsx";
import {
  AboutPage,
  ContactPage,
  FAQPage,
  LahoreTyreShopPage,
  ServicesPage,
} from "./components/growth/BusinessPages.jsx";

const routeComponents = {
  AboutPage,
  BrandLandingPage,
  BrandsHub,
  CommercialLandingPage,
  ContactPage,
  DiscoveryHub,
  FAQPage,
  GuideArticle,
  GuideTopicPage,
  GuidesHub,
  LahoreTyreShopPage,
  ServicesPage,
  SizeLandingPage,
  TyreSizesHub,
  VehicleLandingPage,
  VehiclesHub,
};

function findClosingDiv(html, contentStart) {
  const tags = /<\/?div\b[^>]*>/gi;
  tags.lastIndex = contentStart;
  let depth = 1;
  let match;
  while ((match = tags.exec(html))) {
    depth += match[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return match.index;
  }
  return -1;
}

function installServerLocation(requestUrl, siteUrl) {
  const hadWindow = Object.prototype.hasOwnProperty.call(globalThis, "window");
  const previousWindow = globalThis.window;
  const location = new URL(requestUrl, `${siteUrl.replace(/\/$/, "")}/`);

  // A small location shim keeps legacy render-time URL reads deterministic.
  // Browser APIs used from effects and event handlers never execute during SSR.
  globalThis.window = {
    location: {
      hash: location.hash,
      href: location.href,
      host: location.host,
      hostname: location.hostname,
      origin: location.origin,
      pathname: location.pathname,
      port: location.port,
      protocol: location.protocol,
      search: location.search,
    },
  };

  return () => {
    if (hadWindow) globalThis.window = previousWindow;
    else delete globalThis.window;
  };
}

export async function render(requestUrl, { siteUrl }) {
  const restoreWindow = installServerLocation(requestUrl, siteUrl);
  try {
    const { AppShell } = await import("./App.jsx");
    const documentHtml = renderToString(
      <StrictMode>
        <html lang="en">
          <head />
          <body>
            <div id="ssr-root">
              <StaticRouter location={requestUrl}>
                <AppShell initialCart={[]} routeComponents={routeComponents} />
              </StaticRouter>
            </div>
          </body>
        </html>
      </StrictMode>,
    );
    const rootMarker = '<div id="ssr-root">';
    const rootStart = documentHtml.indexOf(rootMarker);
    const contentStart = rootStart + rootMarker.length;
    const rootEnd = rootStart < 0 ? -1 : findClosingDiv(documentHtml, contentStart);
    if (rootStart < 0 || rootEnd < rootStart) {
      throw new Error(`Unable to extract server markup for ${requestUrl}`);
    }
    return documentHtml.slice(contentStart, rootEnd);
  } finally {
    restoreWindow();
  }
}
