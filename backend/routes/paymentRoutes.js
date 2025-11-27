import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { createSession} from "../controllers/paymentController.js";


const router = express.Router();

router.post("/create-session", isAuthenticated, createSession);



export default router;
