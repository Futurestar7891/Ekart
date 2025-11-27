import Cart from "../models/Cart.js";
import User from "../models/User.js";

// GET CART
export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.json({ cartItems: [] });
  res.json(cart.cartItems);
};

// ADD TO CART
export const addToCart = async (req, res) => {
  const { productId, name, image, price } = req.body;

  let cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      userId: req.user._id,
      cartItems: [{ productId, name, image, price, quantity: 1 }],
    });
  } else {
    const existing = cart.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (existing) {
      existing.quantity++;
    } else {
      cart.cartItems.push({ productId, name, image, price, quantity: 1 });
    }
  }

  await cart.save();
  res.json(cart.cartItems);
};

// UPDATE QUANTITY
export const updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.json({ cartItems: [] });

  const item = cart.cartItems.find((i) => i.productId.toString() === productId);

  if (item) item.quantity = quantity;

  cart.cartItems = cart.cartItems.filter((i) => i.quantity > 0);

  await cart.save();
  res.json(cart.cartItems);
};

// DELETE ITEM
export const deleteItem = async (req, res) => {
  const { productId } = req.body;

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.json({ cartItems: [] });

  cart.cartItems = cart.cartItems.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();
  res.json(cart.cartItems);
};

// CLEAR CART
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.json({ cartItems: [] });
    }

    cart.cartItems = []; // remove all items

    await cart.save();

    res.json({ cartItems: [] });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
