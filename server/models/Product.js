import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    brand: { type: String, required: true },
    category: {
      type: String,
      enum: ["Tyres", "Rims"],
      required: true,
    },
    image: String,
    images: [String],
    price: { type: Number, required: true, min: 0 },
    oldPrice: Number,
    size: String,
    origin: {
      type: String,
      enum: ["China", "Japan", "Other"],
      default: "Other",
    },
    rimDiameter: { type: Number, min: 12, max: 24 },
    width: Number,
    profile: Number,
    vehicle: String,
    rating: { type: Number, default: 5, min: 0, max: 5 },
    stock: { type: Number, default: 0, min: 0 },
    badge: String,
    description: String,
    featured: { type: Boolean, default: false },
    specifications: { type: Map, of: String },
  },
  { timestamps: true },
);
schema.index({ title: "text", brand: "text", size: "text" });
schema.index({ featured: -1, createdAt: -1 });
schema.index({ category: 1, featured: -1, createdAt: -1 });
schema.index({ category: 1, origin: 1, brand: 1 });
schema.index({ category: 1, rimDiameter: 1, width: 1, profile: 1 });
schema.index({ stock: 1 });
export default mongoose.model("Product", schema);
