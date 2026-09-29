import "dotenv/config";
import nodemailer from "nodemailer";

const required = ["SMTP_USER", "SMTP_PASS"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(
    JSON.stringify({
      ok: false,
      status: "not-configured",
      missing,
    }),
  );
  process.exitCode = 1;
} else {
  const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 12_000,
  });
  try {
    await mailer.verify();
    console.log(JSON.stringify({ ok: true, status: "smtp-ready" }));
  } catch (error) {
    console.error(
      JSON.stringify({
        ok: false,
        status: "smtp-verification-failed",
        errorCode: error?.code || error?.name || "Error",
      }),
    );
    process.exitCode = 1;
  } finally {
    mailer.close();
  }
}
