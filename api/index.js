import mongoose from "mongoose";
import app from "../src/app.js";

let databaseConnection;

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");
  databaseConnection ||= mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  await databaseConnection;
};

export default async function handler(req, res) {
  const requestUrl = req.url || "/";
  const isPublicHealth =
    requestUrl === "/" ||
    requestUrl.startsWith("/api/health") ||
    requestUrl.startsWith("/health");

  try {
    if (!isPublicHealth) await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Eloop serverless request failed:", error.message);
    return res.status(500).json({
      success: false,
      message:
        "Database connection failed. Check MONGO_URI and MongoDB Atlas network access.",
    });
  }
}
