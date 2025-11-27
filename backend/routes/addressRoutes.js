import express from "express";
import { addAddress, deleteAddress } from "../controllers/addressController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", isAuthenticated, addAddress);
router.delete("/delete/:id", isAuthenticated, deleteAddress);

export default router;
