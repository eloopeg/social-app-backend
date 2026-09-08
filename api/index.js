import mongoose from "mongoose";
import app from "../src/app.js";
import docsPage from "../src/docsPage.js";

let databaseConnection;

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");
  if (!databaseConnection) {
    databaseConnection = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      })
      .catch((error) => {
        databaseConnection = undefined;
        throw error;
      });
  }
  await databaseConnection;
};

export default async function handler(req, res) {
  const requestUrl = req.url || "/";
  const isPublicHealth =
    requestUrl === "/" ||
    requestUrl.startsWith("/docs") ||
    requestUrl.startsWith("/api/health") ||
    requestUrl.startsWith("/health");

  try {
    if (requestUrl === "/docs" || requestUrl === "/api/docs") {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(docsPage());
    }
    if (!isPublicHealth) await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Eloop serverless request failed:", error.message);
    return res.status(503).json({
      success: false,
      message:
        "Database connection failed. Check MONGO_URI and MongoDB Atlas network access.",
    });
  }
}
