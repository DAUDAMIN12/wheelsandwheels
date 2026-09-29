import "dotenv/config";
import mongoose from "mongoose";
import { provisionDatabase } from "../server/index.js";
import Admin from "../server/models/Admin.js";
import Product from "../server/models/Product.js";

let exitCode = 0;

const safeFailureReason = (error) => {
  if (error?.message?.startsWith("MONGODB_URI is required"))
    return "MONGODB_URI is not configured";
  if (error?.message?.startsWith("ADMIN_PASSWORD is required"))
    return "ADMIN_PASSWORD is not configured";
  return "Database provisioning failed";
};

try {
  await provisionDatabase();
  const [products, administrators] = await Promise.all([
    Product.countDocuments().maxTimeMS(5000),
    Admin.countDocuments().maxTimeMS(5000),
  ]);
  console.log(
    JSON.stringify(
      {
        ok: true,
        status: "provisioned",
        counts: { products, administrators },
      },
      null,
      2,
    ),
  );
} catch (error) {
  exitCode = 1;
  console.error(
    JSON.stringify({
      ok: false,
      status: "failed",
      reason: safeFailureReason(error),
      errorType: error?.name || "Error",
    }),
  );
} finally {
  try {
    await mongoose.disconnect();
  } catch (error) {
    exitCode = 1;
    console.error(
      JSON.stringify({
        ok: false,
        status: "disconnect-failed",
        errorType: error?.name || "Error",
      }),
    );
  }
  process.exitCode = exitCode;
}
