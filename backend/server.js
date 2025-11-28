import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";

dotenv.config();
connectDB();

const app = express();

/* -------------------------------------------------------------------------- */
/*                                   CORS                                     */
/* -------------------------------------------------------------------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "https://shopx-omega.vercel.app", // your frontend
];

// BACKEND URL: https://ekart-1-lyec.onrender.com

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) // allow preview frontend builds
      ) {
        return callback(null, true);
      }

      console.log("❌ BLOCKED ORIGIN ->", origin);
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

/* -------------------------------------------------------------------------- */
/*                                PARSERS                                     */
/* -------------------------------------------------------------------------- */

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cookieParser());

/* -------------------------------------------------------------------------- */
/*                                WEBHOOK                                     */
/* -------------------------------------------------------------------------- */
app.use("/api", webhookRoutes);

/* -------------------------------------------------------------------------- */
/*                                 ROUTES                                     */
/* -------------------------------------------------------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/stripe", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/otp", otpRoutes);

/* -------------------------------------------------------------------------- */
/*                                SERVER START                                */
/* -------------------------------------------------------------------------- */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
