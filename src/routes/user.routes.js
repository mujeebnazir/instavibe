import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  updateUserProfilePicture,
  updateAccountDeatils,
  getCurrentUser,
  refreshAccessToken,
  getUserProfile,
} from "../controllers/user.controllers.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(
    upload.fields([{ name: "profilePicture", maxCount: 1 }, ,]),
    registerUser
  );
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").patch(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDeatils);
router
  .route("/update-profile-picture")
  .patch(verifyJWT, upload.single("profilePicture"), updateUserProfilePicture);

router.route("/user/c/:username").get(verifyJWT, getUserProfile);

export default router;
