import express from "express";
import cors from "cors";
import api from "./routes/api.js";
import errorHandler from "./middleware/error.js";
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL?.split(",") || "*" }));
app.use(express.json());
app.get("/", (req, res) =>
  res.json({
    success: true,
    message: "Eloop API is running",
    health: "/api/health",
  }),
);
app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "Eloop API is running" }),
);
app.use("/api", api);
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" }),
);
app.use(errorHandler);
export default app;
