const cartService = require("./cart.services.js");
const Address = require("../models/address.model.js");
const Order = require("../models/oder.model.js");
const OrderItems = require("../models/orderItems.model.js");


async function createOrder(user, shippedAddress) {
  try {
    let address;

    // ✅ 1. Address Check or Save
    if (shippedAddress._id) {
      address = await Address.findById(shippedAddress._id);
      if (!address) {
        throw new Error("Shipping address not found");
      }
    } else {
      address = new Address(shippedAddress);
      address.user = user;
      await address.save();

      user.addresses.push(address);
      await user.save();
    }

    // ✅ 2. Get User's Cart
    const cart = await cartService.findUserCart(user._id);

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      throw new Error("Cart is empty, cannot place order");
    }

    const orderItems = [];

    // ✅ 3. Create OrderItems
    for (const item of cart.cartItems) {
      const orderItem = new OrderItems({
        price: item.price,
        product: item.product, // make sure it's ObjectId
        quantity: item.quantity,
        size: item.size,
        userId: item.userId,
        discountedPrice: item.discountedPrice,
      });

      const createdOrderItem = await orderItem.save();
      orderItems.push(createdOrderItem); // push only ObjectId
    }

    // ✅ 4. Create Order
    const createdOrder = new Order({
      user,
      orderItems,
      totalPrice: cart.totalPrice,
      totalDiscountedPrice: cart.totalDiscountedPrice,
      discount: cart.discount,
      totalItem: cart.totalItem,
      shippingAddress: address ,
    });

    const savedOrder = await createdOrder.save();

    return savedOrder;
  } catch (error) {
    console.error("❌ Error in createOrder:", error.message);
    throw new Error(error.message);
  }
}

// 🔍 Helper function to find order

async function findOrderById(orderId) {
  const order = await Order.findById(orderId)
    .populate("user")
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("shippingAddress");

  if (!order) {
    throw new Error(`Order not found with ID: ${orderId}`);
  }

  return order;
}

// 🟢 Place Order
async function placedOrder(orderId) {
  try {
    const order = await findOrderById(orderId);
    order.orderStatus = "PLACED";
    order.paymentDetails = { ...order.paymentDetails, status: "COMPLETED" };
    return order.save();
  } catch (error) {
    console.error("Error in placedOrder:", error.message);
    throw new Error(error.message);
  }
}

// ✅ Confirm Order
async function confirmedOrder(orderId) {
  try {
    const order = await findOrderById(orderId);
    order.orderStatus = "CONFIRMED";
    return order.save();
  } catch (error) {
    console.error("Error in confirmedOrder:", error.message);
    throw new Error(error.message);
  }
}

// 🚚 Ship Order
async function shipOrder(orderId) {
  try {
    const order = await findOrderById(orderId);
    order.orderStatus = "SHIPPED";
    return order.save();
  } catch (error) {
    console.error("Error in shipOrder:", error.message);
    throw new Error(error.message);
  }
}

// 📦 Deliver Order
async function deliveredOrder(orderId) {
  try {
    const order = await findOrderById(orderId);
    order.orderStatus = "DELIVERED";
    return order.save();
  } catch (error) {
    console.error("Error in deliveredOrder:", error.message);
    throw new Error(error.message);
  }
}

// ❌ Cancel Order
async function cancelledOrder(orderId) {
  try {
    const order = await findOrderById(orderId);
    order.orderStatus = "CANCELLED";
    return order.save();
  } catch (error) {
    console.error("Error in cancelledOrder:", error.message);
    throw new Error(error.message);
  }
}

async function usersOrderHistory(userId) {
  try {
    const orders = await Order.find({
      user: userId,
      orderStatus: "PLACED",
    }) // You can customize
      //   orderStatus: { $in: ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"] }, // You can customize

      .populate({
        path: "orderItems",
        populate: { path: "product" },
      })
      .lean();

    return orders;
  } catch (error) {
    console.error("❌ Error in usersOrderHistory:", error.message);
    throw new Error("User order history fetch failed.");
  }
}

async function getAllOrders() {
  try {
    const orders = await Order.find()
      .populate({
        path: "orderItems",
        populate: { path: "product" },
      })
      .populate("user")
      .populate("shippingAddress")
      .lean();

    return orders;
  } catch (error) {
    console.error("❌ Error in getAllOrders:", error.message);
    throw new Error("Fetching all orders failed.");
  }
}

async function deleteOrder(orderId) {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error(`Order not found with ID: ${orderId}`);
    }

    await Order.findByIdAndDelete(orderId);
    return { message: "Order deleted successfully", orderId };
  } catch (error) {
    console.error("❌ Error in deleteOrder:", error.message);
    throw new Error("Failed to delete order.");
  }
}

// ✅ Get all orders by user ID
async function getOrdersByUser (userId){
  try {
    const orders = await Order.find({ user: userId })
      .populate({
        path: "orderItems",
        populate: { path: "product" },
      })
      .populate("user")
      .populate("shippingAddress")
      .lean();

    return orders;
  } catch (error) {
    console.error("❌ Error in getOrdersByUserService:", error.message);
    throw new Error("Fetching user orders failed.");
  }
};


module.exports = {
  createOrder,
  placedOrder,
  confirmedOrder,
  shipOrder,
  deliveredOrder,
  cancelledOrder,
  findOrderById,
  usersOrderHistory,
  deleteOrder,
  getAllOrders,
  getOrdersByUser
};
