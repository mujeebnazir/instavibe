import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createShare } from "../controllers/share.controllers.js";

const router = Router();
router
  .route("/share-post/c/:postId/to/c/:recieverId")
  .post(verifyJWT, createShare);
export default router;
