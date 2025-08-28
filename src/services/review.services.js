const Review = require("../models/reviews.model.js");
const productService = require("../services/product.services.js");

// ✅ Create a new review
async function createReview(reqData, user) {
  try {
    if (!reqData.productId || !reqData.review) {
      throw new Error("Product ID and review text are required.");
    }

    const product = await productService.findProductById(reqData.productId);
    if (!product) {
      throw new Error("Product not found with ID:", reqData.productId);
    }

    const review = new Review({
      user: user._id,
      product: product._id,
      review: reqData.review,
      createdAt: new Date(),
    });

    const savedReview = await review.save();
    return savedReview;
  } catch (error) {
    console.error("❌ Error in createReview:", error.message);
    throw new Error(error.message);
  }
}

// ✅ Get all reviews for a product
async function getAllReview(productId) {
  try {
    if (!productId) {
      throw new Error("Product ID is required.");
    }

    const product = await productService.findProductById(productId);
    if (!product) {
      throw new Error("Product not found with ID:", productId);
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "firstName lastName")
      .lean();
    return reviews;
  } catch (error) {
    console.error("❌ Error in getAllReview:", error.message);
    throw new Error(error.message);
  }
}

module.exports = {
  createReview,
  getAllReview,
};
