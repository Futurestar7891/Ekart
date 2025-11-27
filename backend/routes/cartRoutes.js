import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  deleteItem,
  clearCart,
} from "../controllers/cartController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getCart);
router.post("/add", isAuthenticated, addToCart);
router.patch("/update", isAuthenticated, updateQuantity);
router.post("/delete", isAuthenticated, deleteItem);
router.post("/clearcart",isAuthenticated,clearCart);

export default router;
