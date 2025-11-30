import express from "express";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";
import { verifyAuthentication } from "../middleware/authentication.middleware.js";

const router = express.Router();

router.get("/", verifyAuthentication, getCoupon);
router.post("/validate", verifyAuthentication, validateCoupon);

export default router;

