const cartItemService = require("../services/cartItem.services");

// ✅ Update Cart Item
async function updateCartItem(req, res) {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }

    const updatedCartItem = await cartItemService.updateCartItem(
      user._id.toString(),
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully.",
      data: updatedCartItem,
    });
  } catch (err) {
    console.error("❌ Error updating cart item:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update cart item.",
      error: err.message,
    });
  }
}
// ✅ Remove Cart Item
async function removeCartItem(req, res) {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }

    await cartItemService.removeCartItem(user._id.toString(), req.params.id);

    return res.status(200).json({
      success: true,
      message: "Cart item removed successfully.",
    });
  } catch (err) {
    console.error("❌ Error removing cart item:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to remove cart item.",
      error: err.message,
    });
  }
}

module.exports = {
  updateCartItem,
  removeCartItem,
};
