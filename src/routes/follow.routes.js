import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  toggleFollow,
  getUserFollowers,
  getUserFollowings,
} from "../controllers/follow.controllers.js";
const router = Router();

export default router;
