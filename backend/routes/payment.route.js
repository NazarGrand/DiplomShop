import express from "express";
import { verifyAuthentication } from "../middleware/authentication.middleware.js";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", verifyAuthentication, createCheckoutSession);
router.post("/checkout-success", verifyAuthentication, checkoutSuccess);

export default router;
