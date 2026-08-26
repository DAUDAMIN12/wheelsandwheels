import "dotenv/config";
import mongoose from "mongoose";
import Admin from "../server/models/Admin.js";
import { hashPassword } from "../server/auth.js";

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD are required");
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);
const admin = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });
if (!admin) {
  console.error(`No admin exists for ${ADMIN_EMAIL}`);
  await mongoose.disconnect();
  process.exit(1);
}
const { salt, hash } = hashPassword(ADMIN_PASSWORD);
admin.salt = salt;
admin.passwordHash = hash;
await admin.save();
await mongoose.disconnect();
console.log(`Admin password updated for ${ADMIN_EMAIL}`);
