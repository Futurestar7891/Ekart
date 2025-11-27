import express from "express";
import { login, getProfile,checkAuth, logout, changeProfile, changePassword, deleteAccount, sendRegisterOtp, verifyRegisterOtp, sendForgotOtp, verifyForgotOtp, resetPassword } from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register/send-otp", sendRegisterOtp);
router.post("/register/verify-otp", verifyRegisterOtp);
router.post("/login", login);
router.post("/forgot/send-otp",sendForgotOtp);
router.post("/forgot/verify-otp",verifyForgotOtp);
router.post("/forgot/reset-password",resetPassword);
router.get("/me", isAuthenticated, getProfile);
router.get("/check",isAuthenticated, checkAuth); 
router.post("/logout",isAuthenticated,logout);
router.put("/change-profile",isAuthenticated,changeProfile);
router.put("/change-password",isAuthenticated,changePassword);
router.delete("/delete-account", isAuthenticated, deleteAccount);

export default router;
