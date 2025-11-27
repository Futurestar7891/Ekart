import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema(
  {
    // For register otp flow (optional)
    name: { type: String, default: null },
    password: { type: String, default: null },

    // ALWAYS required (for both signup + forgot password)
    email: { type: String, required: true },

    otp: { type: Number, required: true },
    otpExpiry: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("TempUser", tempUserSchema);
