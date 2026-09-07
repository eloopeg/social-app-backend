import mongoose from "mongoose";
import app from "../src/app.js";

let databaseConnection;

const connectDatabase = async () => {
  if (!process.env.MONGO_URI || mongoose.connection.readyState === 1) return;
  databaseConnection ||= mongoose.connect(process.env.MONGO_URI);
  await databaseConnection;
};

export default async function handler(req, res) {
  if (req.url !== "/api/health") await connectDatabase();
  return app(req, res);
}
