import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createShare } from "../controllers/share.controllers.js";

const router = Router();

export default router;
