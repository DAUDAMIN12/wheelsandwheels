import { API_URL } from "../api.js";

const STORAGE_KEY = "ww-lead-attribution-v1";
const EVENT_TYPES = new Set([
  "call_click",
  "whatsapp_click",
  "quote_start",
  "size_search",
]);

const text = (value, max = 160) => String(value || "").trim().slice(0, max);

function safeReferrer(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return text(`${url.hostname}${url.pathname === "/" ? "" : url.pathname}`, 240);
  } catch {
    return "";
  }
}

function deviceClass() {
  if (typeof window === "undefined") return "unknown";
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1100) return "tablet";
  return "desktop";
}

function readStored() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

export function initLeadAttribution() {
  if (typeof window === "undefined") return {};
  const stored = readStored();
  if (stored.landingPath) return stored;
  const params = new URLSearchParams(window.location.search);
  const attribution = {
    landingPath: text(window.location.pathname || "/", 200),
    referrer: safeReferrer(document.referrer),
    utmSource: text(params.get("utm_source"), 80),
    utmMedium: text(params.get("utm_medium"), 80),
    utmCampaign: text(params.get("utm_campaign"), 120),
    utmContent: text(params.get("utm_content"), 120),
    utmTerm: text(params.get("utm_term"), 120),
    deviceClass: deviceClass(),
  };
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution is helpful, but never allowed to interrupt the enquiry flow.
  }
  return attribution;
}

export function getLeadAttribution(context = {}) {
  return {
    ...initLeadAttribution(),
    contextType: text(context.contextType, 40),
    contextValue: text(context.contextValue, 180),
  };
}

export function trackLeadEvent(eventType, context = {}) {
  if (typeof window === "undefined" || !EVENT_TYPES.has(eventType)) return;
  const payload = {
    eventType,
    ...getLeadAttribution(context),
    currentPath: text(window.location.pathname || "/", 200),
  };
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon) {
      const accepted = navigator.sendBeacon(
        `${API_URL}/events`,
        new Blob([body], { type: "application/json" }),
      );
      if (accepted) return;
    }
    fetch(`${API_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => {});
  } catch {
    // Measurement must never block calling, WhatsApp or an RFQ submission.
  }
}
