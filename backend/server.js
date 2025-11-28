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


app.use(
  cors({
    origin: "https://shopx-omega.vercel.app",
    credentials: true,
  })
);


/* ------------------------ PARSERS ------------------------ */
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cookieParser());

/* ------------------------ WEBHOOK (must come BEFORE stripe JSON parsing) ------------------------ */
app.use("/api", webhookRoutes);
// ⚠️ This must stay above other routes but after JSON parser

/* ------------------------ ROUTES ------------------------ */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/stripe", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/otp", otpRoutes);

/* ------------------------ SERVER ------------------------ */
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
