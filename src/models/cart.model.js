const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // assumes a User model
    required: true,
  },
  cartItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cartItems",
      require: true,
    },
  ],
  totalItem: {
    type: Number,
    default: 0,
    require:true
  },
  totalPrice: {
    type: Number,
    default: 0,
    require:true
  },
  totalDiscountedPrice: {
    type: Number,
    default: 0,
    require:true
  },
  discount: {
    type: Number,
    default: 0,
    require:true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
