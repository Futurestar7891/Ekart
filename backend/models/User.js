import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  pincode: String,
  state: String,
  city: String,
  houseNo: String,
  area: String,
  landmark: String,
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    avatar: { type: String, default: "" },

    role: { type: String, default: "user" },

    addresses: [addressSchema],

    pendingEmail: {
      type: String,
      default: null,
    },

    // Stores OTP for changing email
    emailOTP: {
      type: String,
      default: null,
    },

    // OTP expire time
    emailOTPExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default mongoose.model("User", userSchema);
