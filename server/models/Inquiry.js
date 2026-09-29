import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
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
  },
  { timestamps: true },
);

schema.index({ createdAt: -1 });
schema.index({ status: 1, createdAt: -1 });
schema.index({ phone: 1, createdAt: -1 });
schema.index({ dedupeKey: 1, createdAt: -1 });

export default mongoose.model("Inquiry", schema);
