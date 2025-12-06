import express from "express";
import {
  fetchAllItems,
  getPromotedItems,
  addNewItem,
  removeItem,
  getRecommendedItems,
  getItemById,
  getItemsByCategory,
  togglePromotedItem,
  updateItem,
} from "../controllers/item.controller.js";
import { verifyAuthentication, requireAdminAccess } from "../middleware/authentication.middleware.js";

const router = express.Router();

router.get("/", verifyAuthentication, requireAdminAccess, fetchAllItems);
router.get("/featured", getPromotedItems);
router.get("/category/:category", getItemsByCategory);
router.get("/recommendations", getRecommendedItems);
router.get("/:id", getItemById);
router.post("/", verifyAuthentication, requireAdminAccess, addNewItem);
router.put("/:id", verifyAuthentication, requireAdminAccess, updateItem);
router.patch("/:id", verifyAuthentication, requireAdminAccess, togglePromotedItem);
router.delete("/:id", verifyAuthentication, requireAdminAccess, removeItem);

export default router;

