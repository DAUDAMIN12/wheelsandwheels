import { app, connectDatabase } from "../server/index.js";

const databaseFailureCode = (error) => {
  const message = String(error?.message || "").toLowerCase();
  if (message.includes("mongodb_uri is required"))
    return "DATABASE_NOT_CONFIGURED";
  if (
    error?.code === 8000 ||
    error?.code === 18 ||
    message.includes("authentication failed") ||
    message.includes("bad auth")
  )
    return "DATABASE_AUTHENTICATION_FAILED";
  return "DATABASE_UNAVAILABLE";
};

export default async function handler(request, response) {
  try {
    await connectDatabase();
    return app(request, response);
  } catch (error) {
    console.error("Serverless API initialization failed", error);
    return response.status(503).json({
      message: "The service is temporarily unavailable. Please try again.",
      code: databaseFailureCode(error),
    });
  }
}
