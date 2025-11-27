import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    name: String,
    rating: Number,
    comment: String,
    image:String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },

    images: [
      {
        url: { type: String, required: true },
      },
    ],

    brand: String,
    stock: { type: Number, default: 0 },

    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    reviews: [reviewSchema],

    /** 👇 This gives full dynamic flexibility */
    attributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
