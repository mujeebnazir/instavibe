import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createStorie,
  getActiveStories,
  deleteStorie,
} from "../controllers/storie.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router
  .route("/create-storie")
  .post(verifyJWT, upload.single("content"), createStorie);
router.route("/active-stories").get(verifyJWT, getActiveStories);
router.route("/delete-storie").delete(verifyJWT, deleteStorie);

export default router;
