import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  getPostComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controllers.js";
const router = Router();
router.route("/post/c/:postId").get(getPostComments);
router.route("/post/c/:postId/add-comment").post(verifyJWT, addComment);
router
  .route("/post/c/:postId/update-comment/c/:commentId")
  .patch(verifyJWT, updateComment);
router.route("/delete-comment/c/:commentId").delete(verifyJWT, deleteComment);
export default router;
