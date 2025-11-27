import User from "../models/User.js";
import TempUser from "../models/Temp.js";
import { sendOTP } from "../Email.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char

export const sendRegisterOtp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    let errors = {};

    // NAME
    if (!name || name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    // EMAIL
    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format";
    }

    // PASSWORD
    if (!password) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Password must be 8+ chars, include uppercase, lowercase, number & special character";
    }

    // CONFIRM PASSWORD
    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // If frontend validation fails
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Check if real user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        errors: { email: "Email already exists" },
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Clear previous OTP session
    await TempUser.findOneAndDelete({ email });

    // Save temp signup request
    await TempUser.create({
      name,
      email,
      password,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000, // 10 min
    });

    const sent = await sendOTP(email, otp);
    if (!sent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    console.error("sendRegisterOtp error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


/* =========================================================
   2) VERIFY OTP & CREATE USER
   ========================================================= */
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please sign up again.",
      });
    }

    if (tempUser.otp !== Number(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (tempUser.otpExpiry < Date.now()) {
      await TempUser.deleteOne({ email });
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please sign up again.",
      });
    }

    // Create user
    const user = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password, // pre-save hook hashes this
    });

    await TempUser.deleteOne({ email });

    const token = user.getJWTToken();
    user.password = undefined;

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      
        maxAge: 5 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true, user });
  } catch (err) {
    console.error("verifyRegisterOtp error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let errors = {};

    if (!email) errors.email = "Email is required";

    if (!password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        errors: { email: "User not found" },
      });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).json({
        success: false,
        errors: { password: "Incorrect password" },
      });
    }

    const token = user.getJWTToken();
    user.password = undefined;

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
      })
      .status(200)
      .json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const sendForgotOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Remove previous temp entry
    await TempUser.findOneAndDelete({ email });

    // Save OTP
    await TempUser.create({
      email,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000, // 10 min
    });

    const mailed = await sendOTP(email, otp);
    if (!mailed) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    console.error("sendForgotOtp error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
export const verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const temp = await TempUser.findOne({ email });

    if (!temp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Request new OTP.",
      });
    }

    if (temp.otp !== Number(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (temp.otpExpiry < Date.now()) {
      await TempUser.deleteOne({ email });
      return res.status(400).json({
        success: false,
        message: "OTP expired. Request new OTP.",
      });
    }

    // OTP success
    return res.status(200).json({
      success: true,
      message: "OTP verified",
    });
  } catch (err) {
    console.error("verifyForgotOtp error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8+ chars, include uppercase, lowercase, number & special character",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // update password
    user.password = newPassword;
    await user.save();

    // remove temp entry
    await TempUser.deleteOne({ email });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

export const checkAuth = async (req, res) => {
  try {
    return res.json({
      success: true,
      loggedIn: true,
      user: req.user,
    });
  } catch (err) {
    return res.json({
      success: false,
      loggedIn: false,
      user: null,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0), // Immediately expire
      })
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE PROFILE (name, email, image)
export const changeProfile = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { image },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase, number & special char",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    const match = await user.comparePassword(currentPassword);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE ACCOUNT
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    // clear cookie
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
