import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  getAllPosts,
  createPost,
  getThePost,
  updatePost,
  deletePost,
  togglePublishStatus,
} from "../controllers/post.controllers.js";
const router = Router();

export default router;
