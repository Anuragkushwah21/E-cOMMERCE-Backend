const ratingService = require("../services/rating.services");

// ✅ Create Product Rating
const createRating = async (req, res) => {
  try {
    const user = req.user;
    const reqBody = req.body;

    if (!user || !user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }

    const rating = await ratingService.createRating(reqBody, user);

    return res.status(201).json({
      success: true,
      message: "Rating submitted successfully.",
      data: rating,
    });
  } catch (error) {
    console.error("❌ Error creating rating:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create rating.",
      error: error.message,
    });
  }
};

// ✅ Get Ratings of a Product
const getProductsRating = async (req, res) => {
  try {
    const productId = req.params.productId;

    const ratings = await ratingService.getProductsRating(productId);

    return res.status(200).json({
      success: true,
      message: "Ratings fetched successfully.",
      data: ratings,
    });
  } catch (error) {
    console.error("❌ Error fetching ratings:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ratings.",
      error: error.message,
    });
  }
};

module.exports = {
  createRating,
  getProductsRating,
};
