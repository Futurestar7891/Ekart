import mongoose from "mongoose";

const pendingOrderSchema = new mongoose.Schema(
  {
    userId: String,
    cartItems: Array,
    address: Object,
  },
  { timestamps: true }
);

export default mongoose.model("PendingOrder", pendingOrderSchema);
