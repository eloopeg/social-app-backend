import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "eloop-development-secret",
    );
    req.user = await User.findById(payload.id);
    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    next();
  } catch {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}
