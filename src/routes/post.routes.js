import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllPosts,
  createPost,
  getThePost,
  updatePost,
  deletePost,
  togglePublishStatus,
} from "../controllers/post.controllers.js";
const router = Router();

router.route("/all-posts").get(verifyJWT, getAllPosts);
router.route("/user/create-post").post(verifyJWT, createPost);
router.route("/c/:postId").get(verifyJWT, getThePost);
router.route("/post/c/:postId/update").post(verifyJWT, updatePost);
router.route("/post/c/:postId/delete").delete(verifyJWT, deletePost);
router
  .route("/post/c/:postId/toggle-publish")
  .post(verifyJWT, togglePublishStatus);

export default router;
