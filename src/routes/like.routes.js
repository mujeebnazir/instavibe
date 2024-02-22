import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  togglePostLike,
  toggleCommentLike,
} from "../controllers/like.controllers.js";
const router = Router();
router.route("/like-post/c/:postId").post(verifyJWT, togglePostLike);
router.route("/like-comment/c/:commentId").post(verifyJWT, toggleCommentLike);

export default router;
