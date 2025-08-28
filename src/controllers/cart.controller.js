const cartService = require("../services/cart.services");

const findUserCart = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated." });
    }

    const cart = await cartService.findUserCart(user.id);

    if (!cart) {
      return res.status(200).json({ items: [], total: 0 }); // or return 404 if that's preferred
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching user cart:", error);
    return res.status(500).json({ message: "Failed to get user cart.", error: error.message });
  }
};


const addItemToCart = async (req, res) => {
  try {
    const user = req.user;
    console.log("User Id:", user)
    await cartService.addCartItem(user._id.toString(), req.body);

    res
      .status(202)
      .json({ message: "Item Added To Cart Successfully", status: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add item to cart.", error: error.message });
  }
};

module.exports = { findUserCart, addItemToCart };
