import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  getPostComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controllers.js";
const router = Router();

export default router;
