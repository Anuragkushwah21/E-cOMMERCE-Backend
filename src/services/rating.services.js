const Rating =require("../models/rating.model")
const productService=require("./product.services")

// ✅ Create Rating
async function createRating(req, user) {
  try {
    if (!req.productId || !req.rating) {
      throw new Error("Product ID and rating are required.");
    }

    const product = await productService.findProductById(req.productId);
    if (!product) {
      throw new Error("Product not found with ID: " + req.productId);
    }

    const rating = new Rating({
      product: product._id,
      user: user._id,
      rating: req.rating,
      createdAt: new Date(),
    });

    const savedRating = await rating.save();
    return savedRating;
  } catch (error) {
    console.error("❌ Error in createRating:", error.message);
    throw new Error(error.message);
  }
}

// ✅ Get Ratings for a Product
async function getProductsRating(productId) {
  try {
    if (!productId) {
      throw new Error("Product ID is required.");
    }

    const ratings = await Rating.find({ product: productId }).populate("user", "firstName lastName");
    return ratings;
  } catch (error) {
    console.error("❌ Error in getProductsRating:", error.message);
    throw new Error(error.message);
  }
}

module.exports = {
  createRating,
  getProductsRating,
};