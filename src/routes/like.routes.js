import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  togglePostLike,
  toggleCommentLike,
} from "../controllers/like.controllers.js";
const router = Router();

export default router;
