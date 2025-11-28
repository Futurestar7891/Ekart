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

/**
 * Allow:
 *  - Localhost (development)
 *  - Main production domain
 *  - Vercel preview deployments (regex)
 */

const allowedOrigins = [
  "http://localhost:5173",
  "https://shopx-omega.vercel.app",
  /\.vercel\.app$/, // ANY Vercel preview deployment
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / server requests

      const allowed = allowedOrigins.some((o) =>
        typeof o === "string" ? o === origin : o.test(origin)
      );

      if (allowed) {
        return callback(null, true);
      } else {
        console.log("❌ BLOCKED ORIGIN:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // IMPORTANT for cookies
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
// Stripe webhook must come BEFORE JSON parsing for raw body.
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
