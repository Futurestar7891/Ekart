import User from "../models/User.js";
import { sendOTP } from "../Email.js";


export const sendEmailOTP = async (req, res) => {
  try {
    const { newEmail, password } = req.body;

    if (!newEmail)
      return res
        .status(400)
        .json({ success: false, message: "New email is required" });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: newEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered",
      });
    }

    // Fetch current user
    const user = await User.findById(req.user._id).select("+password");

    // Verify password
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.pendingEmail = newEmail;
    user.emailOTP = otp;
    user.emailOTPExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const sent = await sendOTP(newEmail, otp);

    if (!sent)
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP" });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const verifyEmailOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    const user = await User.findById(req.user._id);

    if (!user.emailOTP || !user.pendingEmail) {
      return res.status(400).json({
        success: false,
        message: "No pending email change",
      });
    }

    // Wrong OTP
    if (user.emailOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    // Expired OTP
    if (user.emailOTPExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Check again if someone registered using pendingEmail while OTP was sent
    const existingEmail = await User.findOne({ email: user.pendingEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered to another account",
      });
    }

    // Update email
    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.emailOTP = undefined;
    user.emailOTPExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Email changed successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
