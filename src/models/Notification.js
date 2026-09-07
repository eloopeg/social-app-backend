import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: String,
    entityId: mongoose.Schema.Types.ObjectId,
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export default mongoose.model("Notification", schema);
