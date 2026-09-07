import mongoose from "mongoose";
import app from "../src/app.js";

let databaseConnection;

const connectDatabase = async () => {
  if (!process.env.MONGO_URI || mongoose.connection.readyState === 1) return;
  databaseConnection ||= mongoose.connect(process.env.MONGO_URI);
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
      message: "Database connection failed. Check MONGO_URI in Vercel.",
    });
  }
}
