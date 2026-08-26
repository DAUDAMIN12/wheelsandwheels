import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: String,
      city: { type: String, required: true },
      address: { type: String, required: true },
      notes: String,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: String,
        price: Number,
        quantity: Number,
      },
    ],
    subtotal: Number,
    delivery: Number,
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "completed", "cancelled"],
      default: "pending",
    },
    stockRestored: { type: Boolean, default: false },
    paymentMethod: {
      type: String,
      enum: ["cash-on-delivery", "jazzcash", "meezan-bank", "bank-transfer"],
      default: "cash-on-delivery",
    },
    paymentReference: { type: String, trim: true },
  },
  { timestamps: true },
);
export default mongoose.model("Order", schema);
