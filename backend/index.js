const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Routes = require("./Routes");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", Routes);
// MongoDB Connection
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    // Start server only after DB connection
    app.listen(3000, () => {
      console.log("🚀 Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
