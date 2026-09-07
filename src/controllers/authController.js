import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { fail, ok } from "../utils/response.js";

const token = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "eloop-development-secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
export const signup = async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password || password.length < 6)
    return fail(
      res,
      "name, username, email and a 6+ character password are required",
    );
  const user = await User.create({ name, username, email, password });
  ok(res, { token: token(user.id), user }, "Account created", 201);
};
export const signin = async (req, res) => {
  const { login, email, username, password } = req.body;
  const user = await User.findOne({
    $or: [
      { email: email || login || username },
      { username: login || username || email },
    ],
  }).select("+password");
  if (!user || !(await user.comparePassword(password || "")))
    return fail(res, "Invalid credentials", 401);
  ok(res, { token: token(user.id), user });
};
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.comparePassword(currentPassword || "")))
    return fail(res, "Current password is incorrect", 401);
  user.password = newPassword;
  await user.save();
  ok(res, { token: token(user.id) }, "Password changed");
};
