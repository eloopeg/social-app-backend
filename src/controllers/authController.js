import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { fail, ok } from "../utils/response.js";

const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
const token = (id) =>
  jwt.sign({ user: id }, process.env.JWT_SECRET || "eloop-development-secret", {
    expiresIn,
    audience: "linked-posts-client",
    issuer: "linked-posts-api",
  });
const authUser = (user) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  photo: user.photo || user.image || "",
  cover: user.cover || "",
});
export const signup = async (req, res) => {
  const { name, username, email, dateOfBirth, gender, password, rePassword } =
    req.body;
  if (!name || !username || !email || !password || password.length < 6)
    return fail(
      res,
      "name, username, email and a 6+ character password are required",
    );
  if (rePassword !== undefined && password !== rePassword)
    return fail(res, "Password and rePassword must match");
  if (dateOfBirth && Number.isNaN(Date.parse(dateOfBirth)))
    return fail(res, "dateOfBirth must be a valid date");
  if (gender && !["male", "female", "other"].includes(gender))
    return fail(res, "gender must be male, female, or other");
  const user = await User.create({
    name,
    username,
    email,
    dateOfBirth,
    gender,
    password,
  });
  ok(
    res,
    {
      token: token(user.id),
      tokenType: "Bearer",
      expiresIn,
      user: authUser(user),
    },
    "account created",
    201,
  );
};
export const signin = async (req, res) => {
  const { login, email, username, password } = req.body;
  const identifier = email || login || username;
  if (!identifier || !password)
    return fail(res, "email and password are required", 400);
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select("+password");
  if (!user || !(await user.comparePassword(password || "")))
    return fail(res, "Invalid email or password", 401);
  ok(
    res,
    {
      token: token(user.id),
      tokenType: "Bearer",
      expiresIn,
      user: authUser(user),
    },
    "success",
  );
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
