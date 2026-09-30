import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import compression from "compression";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import Admin from "./models/Admin.js";
import Inquiry from "./models/Inquiry.js";
import {
  emailDeliveryConfigured,
  sendNotification,
} from "./notifications.js";
import {
  hashPassword,
  requireAdmin,
  signToken,
  verifyPassword,
} from "./auth.js";

mongoose.set("bufferCommands", false);
const isProductionRuntime =
  process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

export const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((value) => value.trim().replace(/\/$/, ""))
  .filter(Boolean);
app.use(
  cors((req, callback) => {
    const origin = String(req.headers.origin || "").replace(/\/$/, "");
    const requestHost = String(
      req.headers["x-forwarded-host"] || req.headers.host || "",
    )
      .split(",")[0]
      .trim();
    let sameOrigin = false;
    if (origin && requestHost) {
      try {
        sameOrigin = new URL(origin).host === requestHost;
      } catch {
        sameOrigin = false;
      }
    }
    if (!origin || sameOrigin || allowedOrigins.includes(origin))
      return callback(null, { origin: origin || false });
    const error = new Error("Origin not allowed");
    error.status = 403;
    return callback(error);
  }),
);
app.use(express.json({ limit: "64kb" }));

const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again shortly." },
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please wait 15 minutes." },
});
app.use("/api/orders", sensitiveLimiter);
app.use("/api/auth/login", loginLimiter);

const configuredCatalogTtl = Number(process.env.CATALOG_CACHE_TTL_MS);
const CATALOG_CACHE_TTL_MS = Number.isFinite(configuredCatalogTtl)
  ? Math.min(600_000, Math.max(5_000, configuredCatalogTtl))
  : 300_000;
const CATALOG_CACHE_MAX_ENTRIES = 50;
const catalogCache = new Map();
const catalogInflight = new Map();

const httpError = (status, message) =>
  Object.assign(new Error(message), { status });

const pagination = (req, defaultLimit = 250, maxLimit = 250) => {
  const rawPage = req.query.page;
  const rawLimit = req.query.limit;
  const page = rawPage === undefined ? 1 : Number(rawPage);
  const requestedLimit = rawLimit === undefined ? defaultLimit : Number(rawLimit);
  if (!Number.isInteger(page) || page < 1 || page > 1000)
    throw httpError(400, "Page must be an integer between 1 and 1000");
  if (!Number.isInteger(requestedLimit) || requestedLimit < 1)
    throw httpError(400, "Limit must be a positive integer");
  return { page, limit: Math.min(requestedLimit, maxLimit) };
};

const setPaginationHeaders = (res, page, size, hasMore) => {
  res.set({
    "X-Page": String(page),
    "X-Page-Size": String(size),
    "X-Has-More": String(hasMore),
  });
};

const setPublicCatalogCacheHeaders = (res) => {
  res.set({
    "Cache-Control": "public, max-age=0, must-revalidate",
    "Vercel-CDN-Cache-Control":
      "public, s-maxage=300, stale-while-revalidate=3600",
  });
};

const readCatalogCache = (key) => {
  const entry = catalogCache.get(key);
  if (!entry) return null;
  if (entry.expires <= Date.now()) {
    catalogCache.delete(key);
    return null;
  }
  // Refresh insertion order so frequently-used variants remain in the bounded map.
  catalogCache.delete(key);
  catalogCache.set(key, entry);
  return entry;
};

const writeCatalogCache = (key, value) => {
  catalogCache.delete(key);
  catalogCache.set(key, {
    ...value,
    expires: Date.now() + CATALOG_CACHE_TTL_MS,
  });
  while (catalogCache.size > CATALOG_CACHE_MAX_ENTRIES)
    catalogCache.delete(catalogCache.keys().next().value);
};

const clearCatalogCache = () => {
  catalogCache.clear();
};

const cleanText = (body, key, { required = false, min = 0, max }) => {
  const raw = body[key];
  if (raw === undefined || raw === null) {
    if (required) throw httpError(400, `${key} is required`);
    return "";
  }
  if (typeof raw !== "string")
    throw httpError(400, `${key} must be text`);
  const value = raw.trim();
  if (required && value.length < min)
    throw httpError(400, `${key} is too short`);
  if (max && value.length > max)
    throw httpError(400, `${key} must be ${max} characters or fewer`);
  return value;
};

const validateInquiry = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw httpError(400, "Enter valid request details");
  const allowed = new Set([
    "name",
    "phone",
    "email",
    "city",
    "vehicle",
    "tyreSize",
    "budget",
    "message",
    "website",
    "_gotcha",
  ]);
  if (Object.keys(body).some((key) => !allowed.has(key)))
    throw httpError(400, "The request contains unsupported fields");
  const honeypot = String(body.website || body._gotcha || "").trim();
  if (honeypot) return { honeypot: true };

  const name = cleanText(body, "name", { required: true, min: 2, max: 100 });
  const phone = cleanText(body, "phone", { required: true, min: 7, max: 24 });
  const email = cleanText(body, "email", { max: 254 }).toLowerCase();
  const city = cleanText(body, "city", { max: 100 });
  const vehicle = cleanText(body, "vehicle", { max: 160 });
  const tyreSize = cleanText(body, "tyreSize", { max: 64 });
  const budget = cleanText(body, "budget", { max: 80 });
  const message = cleanText(body, "message", {
    required: true,
    min: 3,
    max: 2000,
  });
  const phoneDigits = phone.replace(/\D/g, "");
  if (!/^[+()\-\s\d]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15)
    throw httpError(400, "Enter a valid phone or WhatsApp number");
  if (email && !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email))
    throw httpError(400, "Enter a valid email address");
  const dedupeKey = crypto
    .createHash("sha256")
    .update(`${phoneDigits}|${tyreSize.toLowerCase()}|${message.toLowerCase()}`)
    .digest("hex");
  return {
    name,
    phone,
    email,
    city,
    vehicle,
    tyreSize,
    budget,
    message,
    dedupeKey,
  };
};

const RFQ_REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const RFQ_REFERENCE_PATTERN = /^WW-\d{8}-[A-Z2-9]{6}$/;

const generateInquiryReference = (now = new Date()) => {
  const dateParts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Karachi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(now)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );
  const suffix = Array.from(crypto.randomBytes(6), (byte) =>
    RFQ_REFERENCE_ALPHABET[byte % RFQ_REFERENCE_ALPHABET.length],
  ).join("");
  return `WW-${dateParts.year}${dateParts.month}${dateParts.day}-${suffix}`;
};

const publicInquiryReference = (inquiry) =>
  String(inquiry.reference || inquiry._id);

const isReferenceCollision = (error) =>
  error?.code === 11000 &&
  (Boolean(error?.keyPattern?.reference) || Boolean(error?.keyValue?.reference));

const createInquiryWithReference = async (details) => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await Inquiry.create({
        ...details,
        reference: generateInquiryReference(),
      });
    } catch (error) {
      if (!isReferenceCollision(error)) throw error;
    }
  }
  throw httpError(503, "Could not create an RFQ reference. Please try again.");
};

const safeEmailFailureCode = (error) => {
  const code = String(error?.code || "").toUpperCase();
  return ["EAUTH", "ETIMEDOUT", "ECONNECTION", "EENVELOPE"].includes(code)
    ? code
    : "DELIVERY_FAILED";
};

const deliverNotification = async (options, eventName) => {
  if (!emailDeliveryConfigured())
    return { sent: false, status: "not_configured" };
  try {
    const sent = await sendNotification(options);
    return { sent, status: sent ? "sent" : "failed" };
  } catch (error) {
    console.error(`${eventName}: ${safeEmailFailureCode(error)}`);
    return { sent: false, status: "failed" };
  }
};

const sendInquiryReceiptNotifications = async (
  inquiry,
  { sendAdmin = true, sendCustomer = Boolean(inquiry.email) } = {},
) => {
  const reference = publicInquiryReference(inquiry);
  const previous = inquiry.notification || {};
  const attemptedAt = new Date();
  const adminDeliveryPromise = sendAdmin
    ? deliverNotification(
        {
          subject: `New RFQ ${reference} from ${inquiry.name}`,
          heading: "New website RFQ",
          replyTo: inquiry.email,
          fields: [
            ["RFQ reference", reference],
            ["Customer", inquiry.name],
            ["Phone", inquiry.phone],
            ["Email", inquiry.email],
            ["City", inquiry.city],
            ["Vehicle", inquiry.vehicle],
            ["Tyre size", inquiry.tyreSize],
            ["Budget", inquiry.budget],
            ["Requirements", inquiry.message],
          ],
        },
        "RFQ_ADMIN_EMAIL_FAILED",
      )
    : {
        sent: previous.adminEmailStatus === "sent",
        status: previous.adminEmailStatus || "pending",
      };
  const customerDeliveryPromise = !inquiry.email
    ? Promise.resolve({ sent: false, status: "not_requested" })
    : sendCustomer
      ? deliverNotification(
          {
            to: inquiry.email,
            replyTo:
              process.env.NOTIFICATION_EMAIL ||
              "wheelsandwheelsinfo@gmail.com",
            subject: `We received your Wheels & Wheels request - ${reference}`,
            heading: "Your rate request is safely recorded",
            fields: [
              ["RFQ reference", reference],
              ["Name", inquiry.name],
              ["Vehicle", inquiry.vehicle || "Not specified"],
              ["Requested size", inquiry.tyreSize || "Not specified"],
              ["Requirements", inquiry.message],
              [
                "Next step",
                "Our Lahore team will check current availability, fitment and rates, then contact you.",
              ],
              ["Official call", "0321 4229594"],
              ["Official WhatsApp", "+92 339 0045836"],
            ],
          },
          "RFQ_CUSTOMER_EMAIL_FAILED",
        )
      : Promise.resolve({
          sent: previous.customerEmailStatus === "sent",
          status: previous.customerEmailStatus || "pending",
        });
  const [adminDelivery, customerDelivery] = await Promise.all([
    Promise.resolve(adminDeliveryPromise),
    customerDeliveryPromise,
  ]);

  const statusUpdate = {
    "notification.adminEmailStatus": adminDelivery.status,
    "notification.customerEmailStatus": customerDelivery.status,
    "notification.attemptedAt": attemptedAt,
  };
  if (adminDelivery.sent)
    statusUpdate["notification.adminEmailSentAt"] = attemptedAt;
  if (customerDelivery.sent)
    statusUpdate["notification.customerEmailSentAt"] = attemptedAt;
  await Inquiry.updateOne({ _id: inquiry._id }, { $set: statusUpdate }).catch(
    () => console.error("RFQ_EMAIL_STATUS_UPDATE_FAILED"),
  );

  return {
    adminEmailSent: adminDelivery.sent,
    adminEmailStatus: adminDelivery.status,
    customerEmailExpected: Boolean(inquiry.email),
    customerEmailSent: customerDelivery.sent,
    customerEmailStatus: customerDelivery.status,
  };
};

app.get("/api/health", (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.set("Cache-Control", "no-store");
  return res.status(connected ? 200 : 503).json({
    ok: connected,
    database: connected ? "connected" : "disconnected",
  });
});
app.get("/api/products", async (req, res, next) => {
  try {
    const { page, limit } = pagination(req);
    const category = String(req.query.category || "").trim();
    const q = String(req.query.q || "").trim().replace(/\s+/g, " ");
    if (category && !["Tyres", "Rims"].includes(category))
      throw httpError(400, "Invalid product category");
    if (q.length > 80) throw httpError(400, "Search is too long");
    const isPublicRequest = !req.headers.authorization;
    const isCdnCacheable = isPublicRequest && !q && limit === 250;
    const cacheKey = JSON.stringify({
      category,
      q,
      page,
      limit,
    });
    const cached = isPublicRequest ? readCatalogCache(cacheKey) : null;
    if (cached) {
      if (isCdnCacheable) setPublicCatalogCacheHeaders(res);
      else res.set("Cache-Control", "private, no-store");
      setPaginationHeaders(res, page, cached.value.length, cached.hasMore);
      res.set("X-Cache", "HIT");
      return res.json(cached.value);
    }
    const loadProducts = async () => {
      const filter = {};
      if (category) filter.category = category;
      if (q) filter.$text = { $search: q };
      const productRows = await Product.find(filter)
        .select("-__v")
        .sort({ featured: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit + 1)
        .maxTimeMS(4000)
        .lean();
      return {
        value: productRows.slice(0, limit),
        hasMore: productRows.length > limit,
      };
    };
    let result;
    let cacheStatus = "MISS";
    if (isPublicRequest) {
      let query = catalogInflight.get(cacheKey);
      if (query) {
        cacheStatus = "COALESCED";
      } else {
        query = loadProducts();
        catalogInflight.set(cacheKey, query);
        query.then(
          () => {
            if (catalogInflight.get(cacheKey) === query)
              catalogInflight.delete(cacheKey);
          },
          () => {
            if (catalogInflight.get(cacheKey) === query)
              catalogInflight.delete(cacheKey);
          },
        );
      }
      result = await query;
    } else {
      result = await loadProducts();
    }
    const { value: products, hasMore } = result;
    if (isPublicRequest) {
      writeCatalogCache(cacheKey, result);
      if (isCdnCacheable) setPublicCatalogCacheHeaders(res);
      else res.set("Cache-Control", "private, no-store");
    } else {
      res.set("Cache-Control", "private, no-store");
    }
    setPaginationHeaders(res, page, products.length, hasMore);
    res.set("X-Cache", cacheStatus);
    res.json(products);
  } catch (e) {
    next(e);
  }
});
app.get("/api/products/:id", async (req, res, next) => {
  try {
    const identifier = String(req.params.id || "").trim().toLowerCase();
    const isObjectId = mongoose.isValidObjectId(identifier);
    if (!isObjectId && !/^[a-z0-9-]{2,120}$/.test(identifier))
      return res.status(404).json({ message: "Product not found" });
    const item = await Product.findOne(
      isObjectId ? { _id: identifier } : { slug: identifier },
    )
      .select("-__v")
      .maxTimeMS(4000)
      .lean();
    if (!item) {
      res.set("Cache-Control", "no-store");
      return res.status(404).json({ message: "Product not found" });
    }
    if (req.headers.authorization)
      res.set("Cache-Control", "private, no-store");
    else setPublicCatalogCacheHeaders(res);
    return res.json(item);
  } catch (e) {
    next(e);
  }
});
app.get("/api/orders/track/:id", async (req, res, next) => {
  try {
    res.set("Cache-Control", "private, no-store");
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: "Enter a valid order number" });
    const order = await Order.findOne({
      _id: req.params.id,
      "customer.phone": req.query.phone,
    }).select(
      "_id items subtotal delivery total status paymentMethod createdAt customer.name customer.city",
    );
    order
      ? res.json(order)
      : res.status(404).json({
          message: "Order not found. Check the order number and phone.",
        });
  } catch (e) {
    next(e);
  }
});

app.post("/api/inquiries", sensitiveLimiter, async (req, res, next) => {
  try {
    res.set("Cache-Control", "no-store");
    const details = validateInquiry(req.body);
    if (details.honeypot)
      return res.status(202).json({
        inquiryId: "000000000000000000000000",
        status: "new",
      });
    const { name, phone, email, city, vehicle, tyreSize, budget, message, dedupeKey } =
      details;
    const duplicate = await Inquiry.findOne({
      dedupeKey,
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
    })
      .select(
        "_id reference status name phone email city vehicle tyreSize budget message notification",
      )
      .maxTimeMS(3000)
      .lean();
    if (duplicate) {
      const reference = publicInquiryReference(duplicate);
      const retryable = (status) =>
        !status || status === "failed" || status === "not_configured";
      const shouldRetryAdmin = retryable(
        duplicate.notification?.adminEmailStatus,
      );
      const shouldRetryCustomer =
        Boolean(duplicate.email) &&
        retryable(duplicate.notification?.customerEmailStatus);
      const delivery =
        shouldRetryAdmin || shouldRetryCustomer
          ? await sendInquiryReceiptNotifications(duplicate, {
              sendAdmin: shouldRetryAdmin,
              sendCustomer: shouldRetryCustomer,
            })
          : {
              adminEmailSent:
                duplicate.notification?.adminEmailStatus === "sent",
              adminEmailStatus:
                duplicate.notification?.adminEmailStatus || "pending",
              customerEmailExpected: Boolean(duplicate.email),
              customerEmailSent:
                duplicate.notification?.customerEmailStatus === "sent",
              customerEmailStatus:
                duplicate.notification?.customerEmailStatus ||
                (duplicate.email ? "pending" : "not_requested"),
            };
      res.set("X-Deduplicated", "true");
      return res.json({
        inquiryId: reference,
        reference,
        status: duplicate.status,
        deduplicated: true,
        emailSent: delivery.adminEmailSent,
        ...delivery,
      });
    }
    const inquiry = await createInquiryWithReference({
      name,
      phone,
      email,
      city,
      vehicle,
      tyreSize,
      budget,
      message,
      dedupeKey,
      notification: {
        adminEmailStatus: "pending",
        customerEmailStatus: email ? "pending" : "not_requested",
      },
    });
    const reference = publicInquiryReference(inquiry);
    const delivery = await sendInquiryReceiptNotifications(inquiry);
    res.status(201).json({
      inquiryId: reference,
      reference,
      status: inquiry.status,
      emailSent: delivery.adminEmailSent,
      ...delivery,
    });
  } catch (e) {
    next(e);
  }
});

app.get("/api/inquiries/track/:id", sensitiveLimiter, async (req, res, next) => {
  try {
    res.set("Cache-Control", "private, no-store");
    const phone = String(req.query.phone || "").replace(/\D/g, "");
    if (!phone) return res.status(400).json({ message: "Phone number is required" });
    const requestedReference = String(req.params.id || "").trim().toUpperCase();
    const lookup = RFQ_REFERENCE_PATTERN.test(requestedReference)
      ? { reference: requestedReference }
      : mongoose.isValidObjectId(req.params.id)
        ? { _id: req.params.id }
        : null;
    if (!lookup)
      return res.status(404).json({ message: "RFQ not found. Check the reference and phone number." });
    const inquiry = await Inquiry.findOne(lookup).lean();
    const savedPhone = String(inquiry?.phone || "").replace(/\D/g, "");
    if (!inquiry || savedPhone.slice(-10) !== phone.slice(-10))
      return res.status(404).json({ message: "RFQ not found. Check the reference and phone number." });
    const reference = publicInquiryReference(inquiry);
    res.json({
      inquiryId: reference,
      reference,
      name: inquiry.name,
      vehicle: inquiry.vehicle,
      tyreSize: inquiry.tyreSize,
      requirements: inquiry.message,
      status: inquiry.status,
      quotedAmount: inquiry.quotedAmount,
      quotedItems: inquiry.quotedItems,
      reply: inquiry.reply,
      respondedAt: inquiry.respondedAt,
      createdAt: inquiry.createdAt,
    });
  } catch (e) {
    if (e.name === "CastError") return res.status(404).json({ message: "RFQ not found. Check the reference and phone number." });
    next(e);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    res.set("Cache-Control", "private, no-store");
    const admin = await Admin.findOne({ email: req.body.email?.toLowerCase() });
    if (
      !admin ||
      !verifyPassword(req.body.password || "", admin.salt, admin.passwordHash)
    )
      return res.status(401).json({ message: "Invalid email or password" });
    res.json({
      token: signToken(admin),
      admin: { name: admin.name, email: admin.email },
    });
  } catch (e) {
    next(e);
  }
});
app.get("/api/admin/summary", requireAdmin, async (_req, res, next) => {
  try {
    res.set("Cache-Control", "private, no-store");
    const since = new Date();
    since.setDate(since.getDate() - 29);
    since.setHours(0, 0, 0, 0);
    const [
      products,
      orders,
      pending,
      revenue,
      lowStock,
      outOfStock,
      bestSellers,
      dailySales,
      statuses,
      inquiries,
      newInquiries,
      inquiryStatuses,
      emailDeliveryIssues,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Product.find({ stock: { $gt: 0, $lte: 5 } })
        .select("title stock image")
        .sort({ stock: 1 }),
      Product.find({ stock: 0 }).select("title stock image"),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            title: { $first: "$items.title" },
            units: { $sum: "$items.quantity" },
            sales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { units: -1 } },
        { $limit: 5 },
      ]),
      Order.aggregate([
        {
          $match: { createdAt: { $gte: since }, status: { $ne: "cancelled" } },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            sales: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: "new" }),
      Inquiry.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Inquiry.countDocuments({
        $or: [
          {
            "notification.adminEmailStatus": {
              $in: ["failed", "not_configured"],
            },
          },
          {
            "notification.customerEmailStatus": {
              $in: ["failed", "not_configured"],
            },
          },
          {
            "notification.quoteEmailStatus": {
              $in: ["failed", "not_configured"],
            },
          },
        ],
      }),
    ]);
    res.json({
      products,
      orders,
      pending,
      revenue: revenue[0]?.total || 0,
      lowStock,
      outOfStock,
      bestSellers,
      dailySales,
      statuses,
      inquiries,
      newInquiries,
      inquiryStatuses,
      emailConfigured: emailDeliveryConfigured(),
      emailDeliveryIssues,
    });
  } catch (e) {
    next(e);
  }
});
app.post("/api/products", requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    clearCatalogCache();
    res.status(201).json(product);
  } catch (e) {
    next(e);
  }
});
app.put("/api/products/:id", requireAdmin, async (req, res, next) => {
  try {
    const item = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    clearCatalogCache();
    item
      ? res.json(item)
      : res.status(404).json({ message: "Product not found" });
  } catch (e) {
    next(e);
  }
});
app.delete("/api/products/:id", requireAdmin, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    clearCatalogCache();
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});
app.get("/api/orders", requireAdmin, async (req, res, next) => {
  try {
    const { page, limit } = pagination(req, 250, 500);
    const rows = await Order.find()
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit + 1)
      .maxTimeMS(5000)
      .lean();
    const hasMore = rows.length > limit;
    const orders = rows.slice(0, limit);
    res.set("Cache-Control", "private, no-store");
    setPaginationHeaders(res, page, orders.length, hasMore);
    res.json(orders);
  } catch (e) {
    next(e);
  }
});
app.get("/api/inquiries", requireAdmin, async (req, res, next) => {
  try {
    const { page, limit } = pagination(req, 250, 500);
    const rows = await Inquiry.find()
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit + 1)
      .maxTimeMS(5000)
      .lean();
    const hasMore = rows.length > limit;
    const inquiries = rows.slice(0, limit);
    res.set("Cache-Control", "private, no-store");
    setPaginationHeaders(res, page, inquiries.length, hasMore);
    res.json(inquiries);
  } catch (e) {
    next(e);
  }
});
app.patch("/api/inquiries/:id", requireAdmin, async (req, res, next) => {
  try {
    const allowed = ["new", "contacted", "quoted", "won", "closed"];
    if (req.body.status && !allowed.includes(req.body.status))
      return res.status(400).json({ message: "Invalid inquiry status" });
    const isResponse = req.body.sendReply === true;
    const retryNotifications = req.body.retryNotifications === true;
    const quotedAmount =
      req.body.quotedAmount === "" || req.body.quotedAmount == null
        ? undefined
        : Number(req.body.quotedAmount);
    if (req.body.quotedAmount !== undefined && req.body.quotedAmount !== "" && (!Number.isFinite(quotedAmount) || quotedAmount < 0))
      return res.status(400).json({ message: "Quoted amount must be a valid positive number" });
    if (
      isResponse &&
      (!String(req.body.reply || "").trim() ||
        (quotedAmount === undefined && !String(req.body.quotedItems || "").trim()))
    )
      return res.status(400).json({
        message:
          "Add a customer reply and either quoted items or a quoted amount before sending",
      });
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.status ? { status: req.body.status } : isResponse ? { status: "quoted" } : {}),
        ...(typeof req.body.notes === "string"
          ? { notes: req.body.notes }
          : {}),
        ...(req.body.quotedAmount !== undefined ? { quotedAmount } : {}),
        ...(typeof req.body.quotedItems === "string" ? { quotedItems: req.body.quotedItems } : {}),
        ...(typeof req.body.reply === "string" ? { reply: req.body.reply } : {}),
        ...(isResponse ? { respondedAt: new Date() } : {}),
      },
      { new: true, runValidators: true },
    );
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    let receiptDelivery;
    if (retryNotifications) {
      receiptDelivery = await sendInquiryReceiptNotifications(inquiry, {
        sendAdmin: true,
        sendCustomer: Boolean(inquiry.email),
      });
    }
    let emailSent = false;
    let emailDeliveryStatus = isResponse ? "not_requested" : undefined;
    if (isResponse && inquiry.email) {
      const reference = publicInquiryReference(inquiry);
      const delivery = await deliverNotification(
        {
          to: inquiry.email,
          replyTo:
            process.env.NOTIFICATION_EMAIL ||
            "wheelsandwheelsinfo@gmail.com",
          subject: `Your Wheels & Wheels quotation - ${reference}`,
          heading: "Your requested rates are ready",
          fields: [
            ["RFQ reference", reference],
            ["Quoted items", inquiry.quotedItems],
            [
              "Quoted amount",
              inquiry.quotedAmount != null
                ? `Rs. ${inquiry.quotedAmount.toLocaleString("en-PK")}`
                : "Contact us",
            ],
            ["Sales reply", inquiry.reply],
            ["Official call", "0321 4229594"],
            ["Official WhatsApp", "+92 339 0045836"],
          ],
        },
        "CUSTOMER_QUOTE_EMAIL_FAILED",
      );
      emailSent = delivery.sent;
      emailDeliveryStatus = delivery.status;
    }
    if (isResponse) {
      const attemptedAt = new Date();
      const emailUpdate = {
        "notification.quoteEmailStatus": emailDeliveryStatus,
        "notification.quoteEmailAttemptedAt": attemptedAt,
      };
      if (emailSent)
        emailUpdate["notification.quoteEmailSentAt"] = attemptedAt;
      await Inquiry.updateOne({ _id: inquiry._id }, { $set: emailUpdate }).catch(
        () => console.error("QUOTE_EMAIL_STATUS_UPDATE_FAILED"),
      );
    }
    res.json({
      inquiry,
      emailSent,
      emailDeliveryStatus,
      receiptDelivery,
    });
  } catch (e) {
    next(e);
  }
});
app.patch("/api/orders/:id/status", requireAdmin, async (req, res, next) => {
  try {
    const allowed = [
      "pending",
      "confirmed",
      "shipped",
      "completed",
      "cancelled",
    ];
    if (!allowed.includes(req.body.status))
      return res.status(400).json({ message: "Invalid order status" });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "cancelled" && req.body.status !== "cancelled")
      return res.status(409).json({
        message:
          "A cancelled order cannot be reopened; create a new order instead",
      });
    if (req.body.status === "cancelled" && !order.stockRestored) {
      await Product.bulkWrite(
        order.items.map((line) => ({
          updateOne: {
            filter: { _id: line.product },
            update: { $inc: { stock: line.quantity } },
          },
        })),
      );
      order.stockRestored = true;
    }
    order.status = req.body.status;
    await order.save();
    clearCatalogCache();
    res.json(order);
  } catch (e) {
    next(e);
  }
});

app.post("/api/orders", async (_req, res) => {
  return res.status(410).json({
    message:
      "Online ordering is currently unavailable. Call 0321 4229594 or WhatsApp 0339 0045836 to confirm your order.",
  });
  /* Legacy order workflow retained for future activation.
  const reserved = [];
  try {
    const {
      customer,
      items,
      paymentMethod = "cash-on-delivery",
      paymentReference,
    } = req.body;
    const paymentMethods = ["cash-on-delivery", "jazzcash", "meezan-bank"];
    if (!paymentMethods.includes(paymentMethod))
      throw Object.assign(new Error("Invalid payment method"), { status: 400 });
    if (paymentMethod !== "cash-on-delivery" && !String(paymentReference || "").trim())
      throw Object.assign(new Error("Transaction/reference ID is required for advance payment"), { status: 400 });
    if (
      !customer?.name ||
      !customer?.phone ||
      !customer?.address ||
      !customer?.city ||
      !items?.length
    )
      throw Object.assign(
        new Error("Name, phone, city, address and items are required"),
        { status: 400 },
      );
    const ids = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: ids } });
    const lines = items.map((i) => {
      const product = products.find((p) => String(p._id) === String(i.product));
      const quantity = Math.max(1, Number(i.quantity) || 1);
      if (!product)
        throw Object.assign(new Error("A product no longer exists"), {
          status: 400,
        });
      return {
        product: product._id,
        title: product.title,
        price: product.price,
        quantity,
      };
    });
    for (const line of lines) {
      const updated = await Product.findOneAndUpdate(
        { _id: line.product, stock: { $gte: line.quantity } },
        { $inc: { stock: -line.quantity } },
      );
      if (!updated)
        throw Object.assign(new Error(`Not enough stock for ${line.title}`), {
          status: 409,
        });
      reserved.push(line);
    }
    const subtotal = lines.reduce((s, i) => s + i.price * i.quantity, 0);
    const delivery =
      subtotal >= 50000 && customer.city.toLowerCase() === "lahore" ? 0 : 1500;
    const created = await Order.create({
      customer,
      items: lines,
      subtotal,
      delivery,
      total: subtotal + delivery,
      paymentMethod,
      paymentReference: String(paymentReference || "").trim(),
    });
    clearCatalogCache();
    sendNotification({
      subject: `New order #${String(created._id).slice(-8).toUpperCase()} — Rs. ${created.total.toLocaleString("en-PK")}`,
      heading: "New website order",
      replyTo: customer.email,
      fields: [
        ["Order ID", created._id],
        ["Customer", customer.name],
        ["Phone", customer.phone],
        ["Email", customer.email],
        ["City", customer.city],
        ["Address", customer.address],
        [
          "Items",
          lines.map((line) => `${line.quantity}× ${line.title}`).join(", "),
        ],
        ["Payment", paymentMethod],
        ["Payment reference", paymentReference],
        ["Total", `Rs. ${created.total.toLocaleString("en-PK")}`],
        ["Notes", customer.notes],
      ],
    }).catch((error) => console.error("Order email failed", error.message));
    res.status(201).json({
      orderId: created._id,
      status: created.status,
      total: created.total,
    });
  } catch (e) {
    if (reserved.length)
      await Product.bulkWrite(
        reserved.map((line) => ({
          updateOne: {
            filter: { _id: line.product },
            update: { $inc: { stock: line.quantity } },
          },
        })),
      );
    next(e);
  }
  */
});

app.use("/api", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(404).json({ message: "API route not found" });
});

if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  const projectRoot = path.resolve(
    fileURLToPath(new URL("..", import.meta.url)),
  );
  const frontend = path.join(projectRoot, "dist");
  app.use(
    "/assets",
    express.static(path.join(frontend, "assets"), {
      maxAge: "1y",
      immutable: true,
      index: false,
    }),
  );
  app.use(express.static(frontend, { maxAge: "1h", index: false }));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    const relativePath = req.path.replace(/^\/+/, "");
    const prerendered = path.resolve(frontend, relativePath, "index.html");
    if (
      prerendered.startsWith(`${path.resolve(frontend)}${path.sep}`) &&
      fs.existsSync(prerendered)
    ) {
      res.set("Cache-Control", "public, max-age=0, must-revalidate");
      return res.sendFile(prerendered);
    }
    if (/^\/product\/[a-z0-9-]{2,120}$/i.test(req.path)) {
      res.set("Cache-Control", "public, max-age=0, must-revalidate");
      return res.sendFile(path.join(frontend, "product-fallback.html"));
    }
    const notFound = path.join(frontend, "404.html");
    res.set("Cache-Control", "public, max-age=0, must-revalidate");
    if (fs.existsSync(notFound)) return res.status(404).sendFile(notFound);
    return res.status(404).send("Page not found");
  });
}

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const requestId = String(req.headers["x-vercel-id"] || crypto.randomUUID());
  let status = Number(error.status) || 500;
  let message = error.message || "Something went wrong";
  if (error.code === 11000)
    return res.status(409).json({ message: "That value already exists" });
  if (error.type === "entity.too.large") {
    status = 413;
    message = "Request body is too large";
  } else if (error.name === "ValidationError") {
    status = 400;
    message = "Enter valid request data";
  } else if (error.name === "CastError") {
    status = 400;
    message = "Enter a valid reference";
  }
  if (status < 400 || status > 599) status = 500;
  console.error({
    requestId,
    method: req.method,
    path: req.path,
    status,
    error: error.message,
    ...(isProductionRuntime ? {} : { stack: error.stack }),
  });
  res.set("X-Request-Id", requestId);
  if (isProductionRuntime && status >= 500)
    message = "The service could not complete this request. Please try again.";
  return res.status(status).json({ message, requestId });
});

const mongoState = globalThis.__wheelsAndWheelsMongo || {
  promise: null,
  listenersAttached: false,
};
globalThis.__wheelsAndWheelsMongo = mongoState;

if (!mongoState.listenersAttached) {
  mongoose.connection.on("disconnected", () => {
    mongoState.promise = null;
  });
  mongoose.connection.on("error", () => {
    if (mongoose.connection.readyState === 0) mongoState.promise = null;
  });
  mongoState.listenersAttached = true;
}

const boundedNumber = (value, fallback, minimum, maximum) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.trunc(Math.min(maximum, Math.max(minimum, parsed)));
};

export function connectDatabase() {
  if (mongoose.connection.readyState === 1)
    return Promise.resolve(mongoose.connection);
  if (mongoose.connection.readyState === 2 && mongoState.promise)
    return mongoState.promise;
  if (mongoose.connection.readyState === 0) mongoState.promise = null;
  if (mongoState.promise) return mongoState.promise;

  const uri = process.env.MONGODB_URI;
  if (!uri)
    throw new Error("MONGODB_URI is required. Copy .env.example to .env");

  mongoState.promise = mongoose
    .connect(uri, {
      maxPoolSize: boundedNumber(process.env.MONGO_POOL_SIZE, 10, 2, 50),
      minPoolSize: 0,
      maxConnecting: boundedNumber(process.env.MONGO_MAX_CONNECTING, 2, 1, 10),
      maxIdleTimeMS: boundedNumber(
        process.env.MONGO_MAX_IDLE_TIME_MS,
        30_000,
        5_000,
        120_000,
      ),
      waitQueueTimeoutMS: boundedNumber(
        process.env.MONGO_WAIT_QUEUE_TIMEOUT_MS,
        5_000,
        1_000,
        30_000,
      ),
      connectTimeoutMS: 10_000,
      serverSelectionTimeoutMS: 5_000,
    })
    .then(() => mongoose.connection)
    .catch((error) => {
      mongoState.promise = null;
      throw error;
    });

  return mongoState.promise;
}

export async function provisionDatabase() {
  await connectDatabase();
  if ((await Product.countDocuments()) === 0) {
    const { seedProducts } = await import("./seedData.js");
    await Product.insertMany(seedProducts);
  }
  if ((await Admin.countDocuments()) === 0) {
    const password = process.env.ADMIN_PASSWORD;
    if (!password)
      throw new Error("ADMIN_PASSWORD is required for the first admin");
    const { salt, hash } = hashPassword(password);
    await Admin.create({
      name: process.env.ADMIN_NAME || "Store Admin",
      email: process.env.ADMIN_EMAIL || "admin@wheelsandwheels.pk",
      salt,
      passwordHash: hash,
    });
  }
}

async function bootstrap() {
  await connectDatabase();
  if (!isProductionRuntime || process.env.AUTO_PROVISION === "true")
    await provisionDatabase();
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () =>
    console.log(`Wheels & Wheels API: http://localhost:${port}`),
  );
  const shutdown = async (signal) => {
    console.log(`${signal}: finishing active requests`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

const isDirectRun = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isDirectRun)
  bootstrap().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
