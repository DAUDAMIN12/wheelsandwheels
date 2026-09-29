# Wheels & Wheels production structure

## Customer journey

```text
Home
├── Shop and tyre finder
│   ├── Exact size (width / profile / rim)
│   ├── Japanese, premium and Chinese brands
│   ├── Vehicle discovery pages
│   └── 12–24 inch tyres and rims
├── Product or fitment page
│   ├── Inspect image and specification
│   ├── Add requirement to quote list
│   └── Ask the current rate
├── Rate request
│   ├── Submit contact, vehicle, size and requirement
│   └── Receive an RFQ reference
└── Sales confirmation
    ├── Call 0321 4229594 or 0339 0045836
    └── WhatsApp 0339 0045836
```

The website is a lead-generation catalogue. It does not accept payment, promise live stock, or let a customer complete an order online.

## Sales workflow

```text
New RFQ → Contacted → Quoted → Won → Closed
    │          │          │
    │          │          └── record final outcome
    │          └── add current amount, items, availability and response
    └── dashboard record + best-effort email notification
```

MongoDB is the source of truth. Email alerts can fail or be delayed, so the administrator should use the RFQ dashboard as the authoritative queue.

## Search architecture

```text
/tyres                       tyre discovery hub
/tyre-sizes/:size            exact-size intent pages
/brands/:brand               tyre brand pages
/vehicles/:make-model        vehicle discovery pages
/product/:slug               product detail pages
/services/:service           service detail pages
/guides/:slug                original educational content
/lahore-tyre-shop            local Lahore landing page
/about /contact /faq         trust and business information
```

The production build pre-renders indexable routes with unique titles, descriptions, canonicals, visible HTML, structured data, and internal links. `sitemap.xml` contains only indexable canonical pages. Admin, quote utility pages, unknown products, and 404 pages are no-index.

Vehicle and tyre-size pages are discovery aids, not fitment guarantees. The team verifies the complete tyre marking, load/speed rating, wheel specification, and vehicle requirements before confirming a sale.

## Repository

```text
wheels/
├── api/                     Vercel serverless API entry
├── public/                  optimized brand and catalogue assets
├── scripts/                 provisioning, migration, SEO and load utilities
├── server/
│   ├── models/              Admin, Product, Inquiry and legacy Order schemas
│   ├── auth.js              password hashing and signed admin sessions
│   ├── notifications.js     staff/customer email attempts
│   ├── seedData.js          controlled starter catalogue
│   └── index.js             API, validation, caching and local production host
├── src/
│   ├── components/growth/   SEO, trust and business pages
│   ├── Data/                catalogue and search landing-page content
│   ├── api.js               same-origin API client
│   ├── App.jsx              router, shop, RFQ and admin experiences
│   └── style.css            responsive design system
├── vercel.json              Vercel routes, cache and security headers
└── package.json
```

## Runtime boundaries

- Vercel/CDN serves static pages and immutable hashed assets.
- Express handles `/api/*`; MongoDB Atlas persists products, administrators and RFQs.
- Public catalogue reads are projected, bounded, cached at the edge, and coalesced per warm API instance.
- Admin endpoints are private/no-store and require a signed token.
- Credentials, database URLs and SMTP secrets exist only in local `.env` or deployment environment variables.
- `npm run db:provision` is an explicit one-time operation; production serverless startup never creates an administrator or seeds records automatically.
- The disabled legacy order model remains available for a future, separately reviewed commerce phase, but public order creation returns `410` today.

## Scale boundary

The current architecture removes obvious single-instance bottlenecks and passed local burst testing, but concurrency capacity is an end-to-end property of Vercel limits, MongoDB Atlas tier/indexes, geography, email delivery, and traffic shape. Before a campaign targeting thousands of simultaneous visitors, run a distributed staging test and add:

- shared Redis/Upstash rate limiting;
- CAPTCHA or bot protection on RFQ/login endpoints;
- a durable transactional-email provider/queue;
- production monitoring, alerting and database performance dashboards;
- a rollback-tested Vercel preview-to-production release process.
