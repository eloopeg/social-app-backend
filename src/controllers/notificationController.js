import Notification from "../models/Notification.js";
import { ok } from "../utils/response.js";
export const list = async (req, res) =>
  ok(res, {
    notifications: await Notification.find({ recipient: req.user.id })
      .populate("actor", "name username image")
      .sort("-createdAt"),
  });
export const unread = async (req, res) =>
  ok(res, {
    count: await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    }),
  });
export const read = async (req, res) =>
  ok(res, {
    notification: await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, recipient: req.user.id },
      { read: true },
      { new: true },
    ),
  });
export const readAll = async (req, res) => {
  await Notification.updateMany({ recipient: req.user.id }, { read: true });
  ok(res, {});
};
