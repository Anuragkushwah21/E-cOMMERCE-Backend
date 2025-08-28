const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
   
  },
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orderItems",

    },
  ],
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "addresses",
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
  },
  paymentDetails: {
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentId: {
      type: String,
      
    },
  },
  orderStatus: {
    type: String,
    enum: ["Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    default: "Placed",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  totalDiscountedPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  totalItem: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
