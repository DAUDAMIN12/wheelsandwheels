import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import compression from "compression";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import Admin from "./models/Admin.js";
import Inquiry from "./models/Inquiry.js";
import { sendNotification } from "./notifications.js";
import {
  hashPassword,
  requireAdmin,
  signToken,
  verifyPassword,
} from "./auth.js";
import { seedProducts } from "./seedData.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((value) => value.trim());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      callback(new Error("Origin not allowed"));
    },
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

let catalogCache = { key: "", expires: 0, value: null };
const clearCatalogCache = () => {
  catalogCache = { key: "", expires: 0, value: null };
};

app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  }),
);
app.get("/api/products", async (req, res, next) => {
  try {
    const cacheKey = JSON.stringify({
      category: req.query.category || "",
      q: req.query.q || "",
    });
    if (
      catalogCache.value &&
      catalogCache.key === cacheKey &&
      catalogCache.expires > Date.now()
    ) {
      res.set("X-Cache", "HIT");
      return res.json(catalogCache.value);
    }
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.q) filter.$text = { $search: req.query.q };
    const products = await Product.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .lean();
    catalogCache = {
      key: cacheKey,
      expires: Date.now() + 30_000,
      value: products,
    };
    res.set("Cache-Control", "public, max-age=15, stale-while-revalidate=60");
    res.set("X-Cache", "MISS");
    res.json(products);
  } catch (e) {
    next(e);
  }
});
app.get("/api/products/:id", async (req, res, next) => {
  try {
    const item = await Product.findById(req.params.id);
    item
      ? res.json(item)
      : res.status(404).json({ message: "Product not found" });
  } catch (e) {
    next(e);
  }
});
app.get("/api/orders/track/:id", async (req, res, next) => {
  try {
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
    const { name, phone, email, city, vehicle, tyreSize, budget, message } =
      req.body;
    if (!name || !phone || !message)
      return res
        .status(400)
        .json({ message: "Name, phone and requirements are required" });
    const inquiry = await Inquiry.create({
      name,
      phone,
      email,
      city,
      vehicle,
      tyreSize,
      budget,
      message,
    });
    sendNotification({
      subject: `New RFQ from ${name}`,
      heading: "New website RFQ",
      replyTo: email,
      fields: [
        ["RFQ ID", inquiry._id],
        ["Customer", name],
        ["Phone", phone],
        ["Email", email],
        ["City", city],
        ["Vehicle", vehicle],
        ["Tyre size", tyreSize],
        ["Budget", budget],
        ["Requirements", message],
      ],
    }).catch((error) => console.error("RFQ email failed", error.message));
    res.status(201).json({ inquiryId: inquiry._id, status: inquiry.status });
  } catch (e) {
    next(e);
  }
});

app.get("/api/inquiries/track/:id", sensitiveLimiter, async (req, res, next) => {
  try {
    const phone = String(req.query.phone || "").replace(/\D/g, "");
    if (!phone) return res.status(400).json({ message: "Phone number is required" });
    const inquiry = await Inquiry.findById(req.params.id).lean();
    const savedPhone = String(inquiry?.phone || "").replace(/\D/g, "");
    if (!inquiry || savedPhone.slice(-10) !== phone.slice(-10))
      return res.status(404).json({ message: "RFQ not found. Check the reference and phone number." });
    res.json({
      inquiryId: inquiry._id,
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
app.get("/api/orders", requireAdmin, async (_req, res, next) => {
  try {
    res.json(await Order.find().sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
});
app.get("/api/inquiries", requireAdmin, async (_req, res, next) => {
  try {
    res.json(await Inquiry.find().sort({ createdAt: -1 }));
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
    const quotedAmount = req.body.quotedAmount === "" ? undefined : Number(req.body.quotedAmount);
    if (req.body.quotedAmount !== undefined && req.body.quotedAmount !== "" && (!Number.isFinite(quotedAmount) || quotedAmount < 0))
      return res.status(400).json({ message: "Quoted amount must be a valid positive number" });
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
    let emailSent = false;
    if (isResponse && inquiry.email) {
      emailSent = await sendNotification({
        to: inquiry.email,
        replyTo: process.env.NOTIFICATION_EMAIL || "wheelsandwheelsinfo@gmail.com",
        subject: `Your Wheels & Wheels quotation – ${inquiry._id}`,
        heading: "Your requested rates are ready",
        fields: [
          ["RFQ reference", inquiry._id],
          ["Quoted items", inquiry.quotedItems],
          ["Quoted amount", inquiry.quotedAmount != null ? `Rs. ${inquiry.quotedAmount.toLocaleString("en-PK")}` : "Contact us"],
          ["Sales reply", inquiry.reply],
          ["Official WhatsApp", "+92 339 0045836"],
        ],
      }).catch((error) => {
        console.error("Customer quote email failed", error.message);
        return false;
      });
    }
    res.json({ inquiry, emailSent });
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

if (process.env.NODE_ENV === "production") {
  const projectRoot = path.resolve(
    fileURLToPath(new URL("..", import.meta.url)),
  );
  const frontend = path.join(projectRoot, "dist");
  app.use(
    express.static(frontend, { maxAge: "1y", immutable: true, index: false }),
  );
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(frontend, "index.html"));
  });
}

app.use((error, _req, res, _next) => {
  void _next;
  console.error(error);
  if (error.code === 11000)
    return res.status(409).json({ message: "That value already exists" });
  res
    .status(error.status || 500)
    .json({ message: error.message || "Something went wrong" });
});

async function bootstrap() {
  const uri = process.env.MONGODB_URI;
  if (!uri)
    throw new Error("MONGODB_URI is required. Copy .env.example to .env");
  await mongoose.connect(uri, {
    maxPoolSize: Number(process.env.MONGO_POOL_SIZE || 50),
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });
  if ((await Product.countDocuments()) === 0)
    await Product.insertMany(seedProducts);
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
bootstrap().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
