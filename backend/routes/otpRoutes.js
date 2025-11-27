import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { sendEmailOTP, verifyEmailOTP } from "../controllers/otpController.js";

const router = express.Router();

router.post("/send-otp",isAuthenticated, sendEmailOTP);
router.post("/verify-otp",isAuthenticated, verifyEmailOTP);

export default router;
