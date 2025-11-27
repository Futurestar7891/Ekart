import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  addReview,
  getFilters,
} from "../controllers/productController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/filters",getFilters);
router.get("/:id", getProduct);

router.post("/", createProduct);

router.post("/:id/review", isAuthenticated, addReview);

export default router;
