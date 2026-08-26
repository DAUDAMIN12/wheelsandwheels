import { app, connectDatabase } from "../server/index.js";

export default async function handler(request, response) {
  try {
    await connectDatabase();
    return app(request, response);
  } catch (error) {
    console.error("Serverless API initialization failed", error);
    return response.status(503).json({
      message: "The service is temporarily unavailable. Please try again.",
    });
  }
}
