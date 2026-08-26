# Wheels & Wheels — Production Structure

## Customer journey

```text
Home
├── Shop
│   ├── Chinese tyre brands (12–24 inch)
│   ├── Japanese tyre brands (12–24 inch)
│   ├── Alloy rims (12–24 inch)
│   └── Product detail → zoom → cart → checkout
├── Request current rates
│   ├── Submit vehicle, size and requirements
│   ├── Receive private RFQ reference
│   ├── Check quotation status (reference + phone)
│   └── Accept/discuss on official WhatsApp
├── Track order (order reference + phone)
└── Services
    ├── Tyre installation
    ├── Computerised balancing
    └── Wheel alignment
```

## Sales and fulfilment journey

```text
New RFQ → Contacted → Quoted → Won → Closed
              │          │
              │          ├── rate, products, availability, validity
              │          ├── automatic customer email
              │          └── official WhatsApp follow-up
              └── private admin notes

New order → Pending → Confirmed → Shipped → Completed
                         └── stock deducted and visible in dashboard
```

## Current deployable repository

```text
wheels/
├── public/                 # logo, product/service images, PWA files
├── scripts/                # migration, admin and load-test utilities
├── server/
│   ├── models/             # Admin, Product, Order, Inquiry schemas
│   ├── auth.js             # admin password hashing and signed sessions
│   ├── notifications.js    # staff and customer email delivery
│   ├── seedData.js         # controlled catalogue seeding
│   └── index.js            # API, security, validation, static production app
├── src/
│   ├── components/         # reusable page sections
│   ├── Data/               # frontend fallback catalogue
│   ├── api.js              # same-origin API client
│   ├── App.jsx             # routes and current page modules
│   └── style.css            # responsive visual system
├── .env                    # private deployment configuration (never commit)
└── package.json
```

## Recommended next modular split

As features grow, move the existing working modules without changing behavior:

```text
src/
├── app/                    # router, providers, route effects
├── features/
│   ├── catalogue/          # shop, filters, product detail, zoom
│   ├── cart-checkout/      # cart, order placement, order tracking
│   ├── quotations/         # RFQ request and customer quote status
│   └── admin/              # analytics, inventory, orders, RFQ desk
├── components/             # header, footer, buttons, shared forms
└── styles/                 # tokens, layout, components, responsive rules

server/
├── config/                 # environment and database configuration
├── middleware/             # auth, rate limits, validation, errors
├── modules/
│   ├── products/           # model, service, controller, routes
│   ├── orders/             # stock-safe transactions and fulfilment
│   ├── quotations/         # quote workflow, privacy and notifications
│   └── analytics/          # sales and stock summaries
└── index.js                # small application bootstrap only
```

## Production boundaries

- MongoDB is the source of truth; the browser never receives admin-only fields.
- Public order and RFQ lookup require both a reference and matching phone number.
- SMTP sends new leads to sales and completed quotations to customers.
- Prices requested through RFQ remain human-approved because fitment, stock and import rates change.
- Admin credentials, database credentials and SMTP app passwords remain only in deployment environment variables.
- A reverse proxy/domain should enforce HTTPS, while the API keeps Helmet, compression and rate limits enabled.
