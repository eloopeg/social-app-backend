import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    body: { type: String, trim: true, default: "" },
    content: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    originalPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true },
);
export default mongoose.model("Post", postSchema);
