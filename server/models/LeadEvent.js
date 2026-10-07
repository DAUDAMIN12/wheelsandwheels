import mongoose from "mongoose";

const EVENT_TYPES = [
  "call_click",
  "whatsapp_click",
  "quote_start",
  "size_search",
];

const schema = new mongoose.Schema(
  {
    eventType: { type: String, enum: EVENT_TYPES, required: true, index: true },
    currentPath: { type: String, trim: true, maxlength: 200 },
    landingPath: { type: String, trim: true, maxlength: 200 },
    referrer: { type: String, trim: true, maxlength: 240 },
    utmSource: { type: String, trim: true, maxlength: 80 },
    utmMedium: { type: String, trim: true, maxlength: 80 },
    utmCampaign: { type: String, trim: true, maxlength: 120 },
    utmContent: { type: String, trim: true, maxlength: 120 },
    utmTerm: { type: String, trim: true, maxlength: 120 },
    deviceClass: {
      type: String,
      enum: ["mobile", "tablet", "desktop", "unknown", ""],
      default: "unknown",
    },
    contextType: { type: String, trim: true, maxlength: 40 },
    contextValue: { type: String, trim: true, maxlength: 180 },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true },
);

schema.index({ createdAt: -1 });
schema.index({ eventType: 1, createdAt: -1 });
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export { EVENT_TYPES };
export default mongoose.model("LeadEvent", schema);
