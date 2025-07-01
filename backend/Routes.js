const express = require("express");
const router = express.Router();
const Product = require("./productSchema");
const Cart = require("./cartSchema");
const Stripe = require("stripe");
const transporter=require("./Email");
require("dotenv").config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

router.post("/checkout-session", async (req, res) => {
  console.log("Request Body:", req.body); // Log the entire body
  const { cartItems, email } = req.body;
  console.log("Email:", email); // Confirm email is extracted

  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.name,
        images: [item.image],
        description: item.description,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cart",
    });

    const orderSummary = cartItems
      .map(
        (item) =>
          `${item.name} - ₹${item.price} (${item.quantity} x ₹${(
            item.price / item.quantity
          ).toFixed(2)})`
      )
      .join("\n");

    await transporter.sendMail({
      from: `"Ekart Store" <${process.env.GMAIL}>`,
      to: email,
      subject: "Your Order Summary - Ekart",
      text: `Hi, thanks for your order!\n\nHere is your order summary:\n\n${orderSummary}\n\nTotal: ₹${cartItems
        .reduce((a, b) => a + b.price, 0)
        .toFixed(2)}\n\nTeam Ekart`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe or Email error:", err);
    res.status(500).json({ error: "Checkout or email failed" });
  }
});


router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET user cart
router.get("/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json({ cart: cart?.cartarray || [] });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// ADD item to cart
router.post("/additem", async (req, res) => {
  try {
    const { userId, item } = req.body;
    let cartexist = await Cart.findOne({ userId });

    if (!cartexist) {
      cartexist = new Cart({ userId, cartarray: [item] });
    } else {
      const exists = cartexist.cartarray.some((p) => p.id === item.id);
      if (!exists) {
        cartexist.cartarray.unshift(item);
      }
    }

   
    await Product.updateOne({ id: item.id }, { $set: { addedAlready: true } });

    await cartexist.save();
    res.status(200).json({ cart: cartexist.cartarray });
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart" });
  }
});

// DELETE item from cart
router.delete("/deleteitem/:userId/:productid", async (req, res) => {
  try {
    const { userId, productid } = req.params;
    const cartexist = await Cart.findOne({ userId });

    if (cartexist) {
      cartexist.cartarray = cartexist.cartarray.filter(
        (item) => item.id !== productid
      );
      await cartexist.save();
    }

    // ✅ Update product schema to mark not added
    await Product.updateOne(
      { id: productid },
      { $set: { addedAlready: false } }
    );

    res.status(200).json({ cart: cartexist?.cartarray || [] });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item" });
  }
});

// UPDATE item quantity
router.patch("/updatequantity/:userId/:productid", async (req, res) => {
  try {
    const { userId, productid } = req.params;
    const { quantity } = req.body;

    const cartexist = await Cart.findOne({ userId });

    if (cartexist) {
      const item = cartexist.cartarray.find((item) => item.id === productid);
      if (item && quantity >= 1) {
        const unitPrice = item.price / item.quantity;
        item.quantity = quantity;
        item.price = unitPrice * quantity;
        await cartexist.save();
      }
    }

    res.status(200).json({ cart: cartexist?.cartarray || [] });
  } catch (err) {
    res.status(500).json({ message: "Error updating quantity" });
  }
});

module.exports = router;
