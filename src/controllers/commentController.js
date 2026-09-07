import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { fail, ok, page } from "../utils/response.js";
export const list = async (req, res) => {
  const { page: number, limit } = page(req);
  const comments = await Comment.find({ post: req.params.postId, parent: null })
    .populate("author", "name username image")
    .sort("-createdAt")
    .skip((number - 1) * limit)
    .limit(limit);
  ok(res, { comments }, "success", 200, { page: number, limit });
};
export const create = async (req, res) => {
  if (!(await Post.exists({ _id: req.params.postId })))
    return fail(res, "Post not found", 404);
  if (!req.body.content) return fail(res, "Comment content is required");
  const comment = await Comment.create({
    content: req.body.content,
    image: req.body.image || "",
    author: req.user.id,
    post: req.params.postId,
    parent: req.body.parent || null,
  });
  ok(
    res,
    { comment: await comment.populate("author", "name username image") },
    "Comment created",
    201,
  );
};
export const replies = async (req, res) =>
  ok(res, {
    comments: await Comment.find({
      post: req.params.postId,
      parent: req.params.commentId,
    }).populate("author", "name username image"),
  });
export const edit = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return fail(res, "Comment not found", 404);
  if (comment.author.toString() !== req.user.id)
    return fail(res, "Only the comment owner can edit it", 403);
  comment.content = req.body.content || comment.content;
  await comment.save();
  ok(res, { comment }, "Comment updated");
};
export const remove = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId).populate("post");
  if (!comment) return fail(res, "Comment not found", 404);
  if (
    comment.author.toString() !== req.user.id &&
    comment.post.author.toString() !== req.user.id
  )
    return fail(res, "You cannot delete this comment", 403);
  await comment.deleteOne();
  ok(res, {}, "Comment deleted");
};
export const like = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return fail(res, "Comment not found", 404);
  const liked = comment.likes.some((id) => id.toString() === req.user.id);
  comment.likes = liked
    ? comment.likes.filter((id) => id.toString() !== req.user.id)
    : [...comment.likes, req.user.id];
  await comment.save();
  ok(res, { liked: !liked, likesCount: comment.likes.length });
};
