const mongoose = require("mongoose");

// Sub-schema for ordered items
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    
  },
  price: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
});

const OrderItem = mongoose.model("orderItems", orderItemSchema);

module.exports = OrderItem;
