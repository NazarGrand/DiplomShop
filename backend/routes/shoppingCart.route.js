import express from "express";
import {
	fetchCartItems,
	addItemToCart,
	clearCartItems,
	changeItemQuantity,
} from "../controllers/shoppingCart.controller.js";
import { verifyAuthentication } from "../middleware/authentication.middleware.js";

const router = express.Router();

router.get("/", verifyAuthentication, fetchCartItems);
router.post("/", verifyAuthentication, addItemToCart);
router.delete("/", verifyAuthentication, clearCartItems);
router.put("/:id", verifyAuthentication, changeItemQuantity);

export default router;

