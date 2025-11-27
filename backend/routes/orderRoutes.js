import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { getMyOrders } from "../controllers/orderControllers.js";



const router = express.Router();

router.get("/my-orders", isAuthenticated, getMyOrders);



export default router;
