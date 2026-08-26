# Wheels & Wheels

A professional tyre and rims storefront for Wheels & Wheels Lahore. The frontend is React + Vite; the API is Express + MongoDB.

## Local setup

```bash
npm install
npm run dev
```

## Run the API

The included local `.env` connects to the installed MongoDB service. Start the API in a second terminal:

```bash
npm run server
```

API routes: `GET /api/health`, `GET /api/products`, `GET /api/products/:id`, and `POST /api/orders`.

Open the storefront at `http://localhost:5173` and the admin dashboard at `http://localhost:5173/admin`.

Local admin credentials:

- Email: `admin@wheelsandwheels.pk`
- Password: `ChangeMe123!`

Change `ADMIN_PASSWORD` and `JWT_SECRET` before deploying. The initial admin is created only when the admin collection is empty; changing the environment value afterward does not change an existing database password.

## Implemented backend

- MongoDB product, order and admin collections
- Automatic first-run inventory seeding
- Signed, expiring admin authentication
- Product listing and protected product CRUD
- Customer checkout with server-side prices and stock checks
- Server-controlled pricing and guarded stock reduction
- Cash-on-delivery and bank-transfer orders
- Protected order listing and status management
- Admin dashboard summary and revenue reporting

For production, use MongoDB Atlas, HTTPS, a long random `JWT_SECRET`, a strong admin password, and a hosted image service such as Cloudinary or S3.
