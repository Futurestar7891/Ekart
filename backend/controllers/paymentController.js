import PendingOrder from "../models/PendingOrder.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createSession = async (req, res) => {
  try {
    const { cartItems, address } = req.body;

    // 1️⃣ Create Pending Order in DB
    const pending = await PendingOrder.create({
      userId: req.user._id,
      cartItems,
      address,
    });

    // 2️⃣ Create Stripe line-items
  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [], // ⭐ ADDED
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));


    // 3️⃣ Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        userId: req.user._id.toString(),
        pendingOrderId: pending._id.toString(), // ✅ ONLY the ID
      },
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Stripe session failed" });
  }
};

