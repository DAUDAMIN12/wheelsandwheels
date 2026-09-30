import mongoose from "mongoose";

const deliveryStatuses = [
  "pending",
  "sent",
  "failed",
  "not_configured",
  "not_requested",
];

const schema = new mongoose.Schema(
  {
    reference: {
      type: String,
      trim: true,
      uppercase: true,
      minlength: 18,
      maxlength: 18,
      match: /^WW-\d{8}-[A-Z2-9]{6}$/,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 24 },
    email: { type: String, trim: true, lowercase: true, maxlength: 254 },
    city: { type: String, trim: true, maxlength: 100 },
    vehicle: { type: String, trim: true, maxlength: 160 },
    tyreSize: { type: String, trim: true, maxlength: 64 },
    budget: { type: String, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    source: { type: String, default: "website", maxlength: 40 },
    dedupeKey: { type: String, select: false, maxlength: 64 },
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "won", "closed"],
      default: "new",
    },
    notes: { type: String, maxlength: 4000 },
    quotedAmount: { type: Number, min: 0 },
    quotedItems: { type: String, maxlength: 4000 },
    reply: { type: String, maxlength: 4000 },
    respondedAt: Date,
    notification: {
      adminEmailStatus: { type: String, enum: deliveryStatuses },
      customerEmailStatus: { type: String, enum: deliveryStatuses },
      quoteEmailStatus: { type: String, enum: deliveryStatuses },
      attemptedAt: Date,
      adminEmailSentAt: Date,
      customerEmailSentAt: Date,
      quoteEmailAttemptedAt: Date,
      quoteEmailSentAt: Date,
    },
  },
  { timestamps: true },
);

schema.index({ createdAt: -1 });
schema.index({ status: 1, createdAt: -1 });
schema.index({ phone: 1, createdAt: -1 });
schema.index({ dedupeKey: 1, createdAt: -1 });
schema.index({ reference: 1 }, { unique: true, sparse: true });

export default mongoose.model("Inquiry", schema);
