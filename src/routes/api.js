import { Router } from "express";
import auth from "../middleware/auth.js";
import * as authControllers from "../controllers/authController.js";
import * as userControllers from "../controllers/userController.js";
import * as postControllers from "../controllers/postController.js";
import * as commentControllers from "../controllers/commentController.js";
import * as notificationControllers from "../controllers/notificationController.js";
const router = Router();

const wrapControllers = (controllers) =>
  new Proxy(controllers, {
    get(target, property) {
      const controller = target[property];
      if (typeof controller !== "function") return controller;
      return (req, res, next) =>
        Promise.resolve(controller(req, res, next)).catch(next);
    },
  });

const a = wrapControllers(authControllers);
const u = wrapControllers(userControllers);
const p = wrapControllers(postControllers);
const c = wrapControllers(commentControllers);
const n = wrapControllers(notificationControllers);

router.post("/users/signup", a.signup);
router.post("/users/signin", a.signin);
router.patch("/users/change-password", auth, a.changePassword);
router.get("/users/profile-data", auth, u.profile);
router.get("/users/suggestions", auth, u.suggestions);
router.get("/users", u.list);
router.get("/users/:id", u.get);
router.put("/users/:id", auth, u.update);
router.post("/users/:id/follow", auth, u.follow);
router.delete("/users/:id/follow", auth, u.unfollow);
router.get("/posts", auth, p.list);
router.get("/posts/:id", auth, p.one);
router.post("/posts", auth, p.create);
router.put("/posts/:postId", auth, p.update);
router.delete("/posts/:id", auth, p.remove);
router.put("/posts/:postId/like", auth, p.like);
router.get("/posts/:postId/likes", auth, p.likes);
router.put("/posts/:postId/bookmark", auth, p.bookmark);
router.post("/posts/:postId/share", auth, p.share);
router.get("/posts/:postId/comments", auth, c.list);
router.post("/posts/:postId/comments", auth, c.create);
router.get("/posts/:postId/comments/:commentId/replies", auth, c.replies);
router.post("/posts/:postId/comments/:commentId/replies", auth, c.create);
router.put("/posts/:postId/comments/:commentId", auth, c.edit);
router.delete("/posts/:postId/comments/:commentId", auth, c.remove);
router.put("/posts/:postId/comments/:commentId/like", auth, c.like);
router.delete("/comments/:id", auth, (req, res, next) => {
  req.params.commentId = req.params.id;
  c.remove(req, res, next);
});
router.get("/notifications", auth, n.list);
router.get("/notifications/unread-count", auth, n.unread);
router.patch("/notifications/:notificationId/read", auth, n.read);
router.patch("/notifications/read-all", auth, n.readAll);
router.post("/auth/register", a.signup);
router.post("/auth/login", a.signin);
router.get("/api-health-alias", (req, res) =>
  res.json({ success: true, message: "Eloop API is running" }),
);
export default router;
