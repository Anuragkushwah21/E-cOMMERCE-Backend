const reviewService = require("../services/review.services");

// ✅ Create a Review
const createReview = async (req, res) => {
  try {
    const user = req.user;
    const reqBody = req.body;

    if (!user || !user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }

    if (!reqBody.productId || !reqBody.review) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Product ID and review are required.",
        });
    }

    const review = await reviewService.createReview(reqBody, user);

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data: review,
    });
  } catch (error) {
    console.error("❌ Error creating review:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create review.",
      error: error.message,
    });
  }
};

// ✅ Get All Reviews of a Product
const getAllReview = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required." });
    }

    const reviews = await reviewService.getAllReview(productId);

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully.",
      data: reviews,
    });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews.",
      error: error.message,
    });
  }
};

module.exports = {
  createReview,
  getAllReview,
};
