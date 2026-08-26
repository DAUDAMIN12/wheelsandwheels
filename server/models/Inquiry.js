import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    city: String,
    vehicle: String,
    tyreSize: String,
    budget: String,
    message: { type: String, required: true, trim: true },
    source: { type: String, default: "website" },
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "won", "closed"],
      default: "new",
    },
    notes: String,
    quotedAmount: { type: Number, min: 0 },
    quotedItems: String,
    reply: String,
    respondedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Inquiry", schema);
