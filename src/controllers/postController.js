import Post from "../models/Post.js";
import { fail, ok, page } from "../utils/response.js";
const populated = (query) =>
  query.populate("author", "name username image").populate("originalPost");
export const list = async (req, res) => {
  const { page: number, limit } = page(req);
  const posts = await populated(
    Post.find()
      .sort("-createdAt")
      .skip((number - 1) * limit)
      .limit(limit),
  );
  ok(res, { posts }, "success", 200, { page: number, limit });
};
export const one = async (req, res) => {
  const post = await populated(Post.findById(req.params.id));
  if (!post) return fail(res, "Post not found", 404);
  ok(res, { post });
};
export const create = async (req, res) => {
  const body = req.body.body ?? req.body.content ?? "";
  if (!body && !req.body.image)
    return fail(res, "Post body or image is required");
  const post = await populated(
    Post.create({
      body,
      content: body,
      image: req.body.image || "",
      author: req.user.id,
    }),
  );
  ok(res, { post }, "Post created", 201);
};
export const update = async (req, res) => {
  const post = await Post.findById(req.params.postId || req.params.id);
  if (!post) return fail(res, "Post not found", 404);
  if (post.author.toString() !== req.user.id)
    return fail(res, "Only the post owner can update it", 403);
  Object.assign(post, {
    body: req.body.body ?? req.body.content ?? post.body,
    content: req.body.body ?? req.body.content ?? post.content,
    image: req.body.image ?? "",
  });
  await post.save();
  ok(res, { post }, "Post updated");
};
export const remove = async (req, res) => {
  const post = await Post.findById(req.params.postId || req.params.id);
  if (!post) return fail(res, "Post not found", 404);
  if (post.author.toString() !== req.user.id)
    return fail(res, "Only the post owner can delete it", 403);
  await post.deleteOne();
  ok(res, {}, "Post deleted");
};
export const like = async (req, res) => {
  const post = await Post.findById(req.params.postId || req.params.id);
  if (!post) return fail(res, "Post not found", 404);
  const liked = post.likes.some((id) => id.toString() === req.user.id);
  post.likes = liked
    ? post.likes.filter((id) => id.toString() !== req.user.id)
    : [...post.likes, req.user.id];
  await post.save();
  ok(res, { liked: !liked, likesCount: post.likes.length });
};
export const likes = async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return fail(res, "Post not found", 404);
  const users = await (
    await import("../models/User.js")
  ).default.find({ _id: { $in: post.likes } });
  ok(res, { users });
};
export const bookmark = async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return fail(res, "Post not found", 404);
  const exists = post.bookmarks.some((id) => id.toString() === req.user.id);
  post.bookmarks = exists
    ? post.bookmarks.filter((id) => id.toString() !== req.user.id)
    : [...post.bookmarks, req.user.id];
  await post.save();
  ok(res, { bookmarked: !exists });
};
export const share = async (req, res) => {
  const original = await Post.findById(req.params.postId);
  if (!original) return fail(res, "Post not found", 404);
  const post = await populated(
    Post.create({
      body: req.body.body || "",
      content: req.body.body || "",
      author: req.user.id,
      originalPost: original.id,
    }),
  );
  ok(res, { post }, "Post shared", 201);
};
