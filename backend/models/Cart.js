import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  cartItems: [
    {
      productId: { type: mongoose.Schema.ObjectId, ref: "Product" },
      name: String,
      image: String,
      price: Number,
      quantity: { type: Number, default: 1 },
    },
  ],
});

export default mongoose.model("Cart", cartSchema);
