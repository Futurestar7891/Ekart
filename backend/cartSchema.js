const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String, 
    required: true,
    unique: true, 
  },
  cartarray: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
