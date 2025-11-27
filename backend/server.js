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
import webhookRoutes from "./routes/webhookRoutes.js"
import orderRoutes from "./routes/orderRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";

// import Product from "./models/Product.js";
// import CategoryFilter from "./models/Filter.js"

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "https://shopx-theta.vercel.app/",
    credentials: true,
  })
);

app.use(
  "/api",
 
  webhookRoutes
);


app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use(cookieParser());

// app.post("/", async (req, res) => {
//   try {
//     const products = req.body; // expecting an array

//     if (!Array.isArray(products) || products.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "Products must be a non-empty array" });
//     }

//     // Insert products in bulk
//     const savedProducts = await Product.insertMany(products);

//     res.status(201).json({
//       message: "Products created successfully",
//       count: savedProducts.length,
//       products: savedProducts,
//     });
//   } catch (error) {
//     console.error("Bulk product create error:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// app.post("/filter", async (req, res) => {
//   try {
//     const categories = req.body; // your full JSON object

//     if (!categories || typeof categories !== "object") {
//       return res.status(400).json({ message: "Invalid data format" });
//     }

//     const operations = [];

//     // Loop through categories like "beauty", "electronics"
//     for (const [categoryName, filters] of Object.entries(categories)) {
//       if (!filters || typeof filters !== "object") continue;

//       // Prepare the filters in correct schema format (Map of arrays)
//       const formattedFilters = {};
//       for (const [filterName, values] of Object.entries(filters)) {
//         formattedFilters[filterName] = values; // array of strings
//       }

//       operations.push(
//         CategoryFilter.findOneAndUpdate(
//           { category: categoryName },
//           {
//             category: categoryName,
//             filters: formattedFilters,
//           },
//           { upsert: true, new: true }
//         )
//       );
//     }

//     const savedFilters = await Promise.all(operations);

//     res.status(201).json({
//       message: "Category filters saved/updated successfully.",
//       count: savedFilters.length,
//       data: savedFilters,
//     });
//   } catch (error) {
//     console.error("Error saving category filters:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/stripe", paymentRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/otp",otpRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
