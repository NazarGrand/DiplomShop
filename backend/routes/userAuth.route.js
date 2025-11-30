import express from "express";
import {
  registerUser,
  authenticateUser,
  signOut,
  renewAccessToken,
  getUserProfile,
} from "../controllers/userAuth.controller.js";
import { verifyAuthentication } from "../middleware/authentication.middleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", authenticateUser);
router.post("/logout", signOut);
router.get("/refresh", renewAccessToken);
router.get("/profile", verifyAuthentication, getUserProfile);

export default router;

