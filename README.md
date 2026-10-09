# Wheels & Wheels

Lead-focused tyre and alloy-rim website for Wheels & Wheels Lahore. The public site is built with React and Vite; the API and private sales dashboard use Express and MongoDB.

Customers can discover tyres by size, brand, or vehicle, build a quote list, and ask for the current rate. Online payment and customer order tracking are intentionally disabled. A sale is confirmed by the team through the official contact channels:

- Call: `0321 4229594` or `0339 0045836`
- WhatsApp and RFQ: `0339 0045836`
- Email: `wheelsandwheelsinfo@gmail.com`

## Requirements

- Node.js 22.12 or newer
- MongoDB locally or a MongoDB Atlas connection string

## Local development

1. Install packages:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and replace every placeholder. Never commit `.env`.

3. Provision the catalogue and first administrator once:

   ```bash
   npm run db:provision
   ```

4. Start the API:

   ```bash
   npm run server
   ```

5. In a second terminal, start Vite:

   ```bash
   npm run dev
   ```

Open `http://localhost:5173`. The private dashboard is at `http://localhost:5173/admin`.

## How the lead workflow works

1. A visitor selects a complete tyre size, such as `195/65 R15`, or browses by brand/vehicle.
2. Product and size actions add the requirement to a quote list or open the rate-request form.
3. Submitting the form stores the RFQ in MongoDB, attempts a sales-inbox alert, and sends a receipt to the customer when an email address was supplied.
4. The confirmation screen reports customer-email delivery separately from database storage. The administrator can see the shop-alert, customer-receipt and quotation-email states for each RFQ and retry failed receipt emails.
5. The administrator signs in at `/admin`, opens **RFQs**, updates the lead status, adds products/rate/notes, and can email a quotation when the customer supplied an email address.
6. The sales team closes the deal by phone or official WhatsApp. The website does not collect money.

If email delivery is unavailable, the RFQ is still stored and visible in the dashboard. Check the dashboard regularly; email is an alert, not the source of truth.

## Administrator tasks

- New production database: `npm run db:provision`
- Change an existing admin password after updating `ADMIN_PASSWORD`: `npm run admin:sync-password`
- Import/update the controlled catalogue: `npm run catalog:migrate`
- Build and generate crawlable SEO pages: `npm run build`
- Validate the generated sitemap, metadata, JSON-LD and no-index pages: `npm run validate:build`
- Test a running production server: `npm run test:smoke -- http://127.0.0.1:5000`
- Test SMTP acceptance and email HTML escaping without contacting a real provider: `npm run test:email`
- Verify SMTP credentials without sending an email: `npm run email:verify`
- Lint the codebase: `npm run lint`

No default password is published in this repository. The values in `.env` or the Vercel environment are authoritative.

## Deploying to Vercel

1. Push this repository to GitHub and import it into Vercel.
2. Select Node.js 22.x in the Vercel project settings.
3. Add the production variables from `.env.example` under **Project Settings → Environment Variables**. Set `VITE_SITE_URL` to the final public origin, for example `https://wheelsandwheels.pk`, with no trailing slash.
4. Set `CLIENT_URL` to the same public origin. During a temporary Vercel-domain launch, use that exact `https://...vercel.app` origin.
5. Use MongoDB Atlas for `MONGODB_URI`; allow connections from Vercel and use a restricted database user.
6. Provision the production database once from a trusted local terminal with the production variables loaded:

   ```bash
   npm run db:provision
   ```

7. Deploy or redeploy. Vercel runs `npm run build`, which creates the static SEO routes, sitemap, robots file, 404 page, and frontend assets.
8. In the Vercel project, enable **Analytics** and **Speed Insights**. Their official React components are already installed in the app; the dashboards begin collecting production visits and real-user Core Web Vitals after the deployment receives traffic.
9. After attaching the final domain, update `VITE_SITE_URL` and `CLIENT_URL`, redeploy, then submit `/sitemap.xml` in Google Search Console.

For Gmail notifications, enable two-step verification and use a Gmail App Password as `SMTP_PASS`; do not use the normal Gmail password. `SMTP_USER`, `SMTP_PASS`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, and `NOTIFICATION_EMAIL` must all be available to the Vercel Production environment. Changing an environment variable does not update an existing deployment, so redeploy afterward.

After deployment, submit one clearly labelled test RFQ with an email address and verify all three results: the record appears at `/admin`, the sales inbox receives the alert, and the customer inbox receives the confirmation. Check Spam/Junk as well. The admin dashboard shows non-secret delivery states and offers a retry action when receipt delivery fails. An SMTP `sent` state means the mail server accepted the message; final inbox placement still depends on the receiving provider and the sender domain's SPF, DKIM and DMARC configuration.

## Production notes

- Public catalogue responses use CDN caching and server-side request coalescing.
- Protected routes use signed admin tokens, strict validation, security headers, query limits, and rate limits.
- Vercel serves pre-rendered marketing pages and real no-index 404/fallback pages rather than a site-wide soft 404.
- The local load test is useful for regression checks, but a claim of 5,000 simultaneous users requires a staged distributed load test against the production-like deployment. A shared rate limiter, CAPTCHA/WAF, and durable email queue are recommended before a high-volume campaign.

## Main routes

- `/shop`, `/tyres`, `/tyre-sizes/:size`, `/brands/:brand`
- `/vehicles/:vehicle`, `/product/:slug`
- `/quote`, `/services`, `/guides`, `/about`, `/contact`, `/faq`
- `/lahore-tyre-shop`
- `/admin` (private, no-index)

API health is available at `/api/health`. Public order creation currently returns HTTP `410 Gone` by design.
