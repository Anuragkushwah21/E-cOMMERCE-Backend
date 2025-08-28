const userService = require("../services/user.services");
const CartItem = require("../models/cartItems.model");
const Product = require("../models/product.model");

async function createCartItem(cartItemData) {
  try {
    // Fetch full product details
    const product = await Product.findById(cartItemData.product);
    if (!product) {
      throw new Error(`Product not found with ID: ${cartItemData.product}`);
    }

    // Build cart item
    const cartItem = new CartItem({
      ...cartItemData,
      quantity: 1,
      price: product.price * 1,
      discountedPrice: product.discountedPrice * 1,
    });

    const createdCartItem = await cartItem.save();
    return createdCartItem;
  } catch (error) {
    console.error("❌ Error in createCartItem:", error.message);
    throw new Error(error.message);
  }
}
async function updateCartItem(userId, cartItemId, cartItemData) {
  try {
    const item = await findCartItemById(cartItemId);

    if (!item) {
      throw new Error(`Cart item not found with id: ${cartItemId}`);
    }

    const user = await userService.findUserById(item.userId);

    if (!user) {
      throw new Error(`User not found with id: ${userId}`);
    }

    if (user._id.toString() === userId.toString()) {
      item.quantity = cartItemData.quantity;
      item.price = item.quantity * item.product.price;
      item.discountedPrice = item.quantity * item.product.discountedPrice;

      const updatedCartItem = await item.save();
      return updatedCartItem;
    } else {
      throw new Error(
        `Unauthorized: You can't update another user's cart item`
      );
    }
  } catch (error) {
    console.error("Error in updateCartItem:", error.message);
    throw new Error(error.message);
  }
}
async function removeCartItem(userId, cartItemId) {
  try {
    // 1. Find the cart item
    const cartItem = await findCartItemById(cartItemId);
    if (!cartItem) {
      throw new Error(`Cart item not found: ${cartItemId}`);
    }

    // 2. Find the owner of the cart item
    const ownerUser = await userService.findUserById(cartItem.userId);
    if (!ownerUser) {
      throw new Error(`Owner user not found for cart item: ${cartItemId}`);
    }

    // 3. Find the requesting user
    const reqUser = await userService.findUserById(userId);
    if (!reqUser) {
      throw new Error(`Requesting user not found: ${userId}`);
    }

    // 4. Check if requesting user owns this cart item
    if (ownerUser._id.toString() !== reqUser._id.toString()) {
      throw new Error("❌ You can't remove another user's cart item");
    }

    // 5. Delete the cart item
    await CartItem.findByIdAndDelete(cartItemId);

    return { message: "✅ Cart item removed successfully" };
  } catch (error) {
    console.error("❌ Error in removeCartItem:", error.message);
    throw new Error(error.message);
  }
}
async function findCartItemById(cartItemId) {
  try {
    const cartItem = await CartItem.findById(cartItemId).populate("product");

    if (!cartItem) {
      throw new CartItemException(`CartItem not found with id: ${cartItemId}`);
    }

    return cartItem;
  } catch (error) {
    // If CartItemException is not defined, fallback to generic Error
    if (error instanceof CartItemException) {
      throw error;
    }
    console.error("❌ Error in findCartItemById:", error.message);
    throw new Error(error.message);
  }
}

module.exports = {
  createCartItem,
  updateCartItem,
  removeCartItem,
  findCartItemById,
};
