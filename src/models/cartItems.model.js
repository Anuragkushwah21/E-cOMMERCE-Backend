const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products", // model name should be "Product"
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart", // model name should be "Cart"
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // model name should be "User"
    required: true,
  },
  quantity: {
    type: Number,
    required:true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  discountedPrice: {
    type: Number,
    require:true
  },
}, {
  timestamps: true,
});

const CartItem = mongoose.model("cartItems", cartItemSchema);

module.exports = CartItem;
