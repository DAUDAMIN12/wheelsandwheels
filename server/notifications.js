import nodemailer from "nodemailer";

const recipient = () =>
  process.env.NOTIFICATION_EMAIL || "wheelsandwheelsinfo@gmail.com";

let cachedTransport;

function transport() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  if (cachedTransport) return cachedTransport;
  cachedTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    pool: true,
    maxConnections: 2,
    maxMessages: 50,
    connectionTimeout: 5_000,
    greetingTimeout: 5_000,
    socketTimeout: 10_000,
  });
  return cachedTransport;
}

const escapeHtml = (value) =>
  String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
    .replaceAll("\n", "<br>");

const safeHeader = (value) => String(value || "").replace(/[\r\n]+/g, " ").trim();

export async function sendNotification({ subject, heading, fields, replyTo, to }) {
  const mailer = transport();
  if (!mailer) {
    console.warn(
      `Email notification skipped (SMTP not configured): ${subject}`,
    );
    return false;
  }
  const rows = fields
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#777">${escapeHtml(label)}</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:700">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  await mailer.sendMail({
    from: `Wheels & Wheels Website <${process.env.SMTP_USER}>`,
    to: safeHeader(to || recipient()),
    replyTo: replyTo ? safeHeader(replyTo) : undefined,
    subject: safeHeader(subject),
    text: `${heading}\n\n${fields.map(([key, value]) => `${key}: ${value || "—"}`).join("\n")}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto"><div style="background:#111;color:#fff;padding:24px"><h1 style="margin:0">${escapeHtml(heading)}</h1></div><table style="width:100%;border-collapse:collapse">${rows}</table><p style="color:#777;font-size:12px;padding:18px 8px">${to ? "Wheels & Wheels · Official WhatsApp +92 339 0045836" : "Open the Wheels & Wheels admin dashboard to manage this record."}</p></div>`,
  });
  return true;
}
