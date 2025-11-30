import express from "express";
import {
	initializeCheckout,
	verifyPayment,
} from "../controllers/checkout.controller.js";
import { verifyAuthentication } from "../middleware/authentication.middleware.js";

const router = express.Router();

router.post("/create-checkout-session", verifyAuthentication, initializeCheckout);
router.get("/verify", verifyPayment);

export default router;

