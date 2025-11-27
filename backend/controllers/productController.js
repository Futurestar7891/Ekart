import Product from "../models/Product.js";
import Filter from "../models/Filter.js"

export const getProducts = async (req, res) => {
  const products = await Product.find().populate("reviews.userId",'name image');
  res.json({
    length:products.length,
    products});
};
export const getFilters=async(req,res)=>{
   const filters=await Filter.find();
   res.json({
     length:filters.length,
     filters
   })
}
export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("reviews.userId",'name image');;
  res.json(product);
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment, image } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add review
    product.reviews.push({
      userId: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      image: image || null,
    });

    // Update review count
    product.reviewCount = product.reviews.length;

    // Recalculate average rating
    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();

    // ⭐ Return all updated products
    const allProducts = await Product.find().populate("reviews.userId",'name image');

    res.json({
      success: true,
      products: allProducts,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

