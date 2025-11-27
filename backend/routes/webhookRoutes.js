import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import PendingOrder from "../models/PendingOrder.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ⚠️ DO NOT ADD express.raw() here, apply it ONLY in app.js
router.post("/stripe-webhook", express.raw({ type: "application/json" }), async (req, res) => {
  console.log("🔥 Webhook HIT!");

  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // PROCESS SUCCESSFUL PAYMENT
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const pendingOrderId = session.metadata.pendingOrderId;

      // 1️⃣ Fetch pending order
      const pending = await PendingOrder.findById(pendingOrderId);

      if (!pending) {
        console.log("❌ Pending Order Not Found");
        return res.json({ received: true });
      }

      // 2️⃣ Create final order
      const order = await Order.create({
        userId: pending.userId,
        orderId: "ORD-" + Date.now(),
        items: pending.cartItems,
        totalAmount: session.amount_total / 100,
        address: pending.address,
        paymentId: session.id,
        paymentStatus: "paid",
        orderStatus: "confirmed",
      });

      console.log("✅ Order Created:", order._id);

      // 3️⃣ Clear Cart
      await Cart.findOneAndUpdate(
        { userId: pending.userId },
        { $set: { cartItems: [] } }
      );

      console.log("🧹 Cart Cleared");

      // 4️⃣ Delete pending order
      await PendingOrder.findByIdAndDelete(pendingOrderId);

      console.log("🗑 Pending Order Deleted");
    }

    res.json({ received: true });
  } catch (err) {
    console.log("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default router;
