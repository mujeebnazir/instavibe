import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  toggleFollow,
  getUserFollowers,
  getUserFollowings,
} from "../controllers/follow.controllers.js";
const router = Router();
router.route("/follow-user/c/:userId").post(verifyJWT, toggleFollow);
router.route("/user/c/:userId/followers").get(verifyJWT, getUserFollowers);
router.route("/user/c/:userId/following").get(verifyJWT, getUserFollowings);

export default router;
