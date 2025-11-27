import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true, unique: true },
    items: [
      {
        productId: String,
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: Number,
    address: Object,
    paymentId: String, // stripe session/payment ID
    paymentStatus: { type: String, default: "paid" },
    orderStatus: { type: String, default: "confirmed" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
