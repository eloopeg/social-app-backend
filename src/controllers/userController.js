import User from "../models/User.js";
import { fail, ok, page } from "../utils/response.js";
export const profile = async (req, res) => ok(res, { user: req.user });
export const list = async (req, res) => {
  const { page: number, limit } = page(req);
  const users = await User.find()
    .skip((number - 1) * limit)
    .limit(limit);
  ok(res, { users }, "success", 200, { page: number, limit });
};
export const get = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return fail(res, "User not found", 404);
  ok(res, { user });
};
export const update = async (req, res) => {
  if (req.params.id !== req.user.id)
    return fail(res, "You can only update your own profile", 403);
  const allowed = (({ name, bio, image }) => ({ name, bio, image }))(req.body);
  const user = await User.findByIdAndUpdate(req.user.id, allowed, {
    new: true,
    runValidators: true,
  });
  ok(res, { user }, "Profile updated");
};
export const follow = async (req, res) => {
  if (req.params.id === req.user.id)
    return fail(res, "You cannot follow yourself");
  const target = await User.findById(req.params.id);
  if (!target) return fail(res, "User not found", 404);
  await User.findByIdAndUpdate(req.user.id, {
    $addToSet: { following: target.id },
  });
  await User.findByIdAndUpdate(target.id, {
    $addToSet: { followers: req.user.id },
  });
  ok(res, { following: true });
};
export const unfollow = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { following: req.params.id },
  });
  await User.findByIdAndUpdate(req.params.id, {
    $pull: { followers: req.user.id },
  });
  ok(res, { following: false });
};
export const suggestions = async (req, res) => {
  const { page: number, limit } = page(req);
  const users = await User.find({
    _id: { $nin: [req.user.id, ...req.user.following] },
  })
    .skip((number - 1) * limit)
    .limit(limit);
  ok(res, { users }, "success", 200, { page: number, limit });
};
