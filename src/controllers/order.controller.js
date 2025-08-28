const orderService = require("../services/order.services");

// ✅ Create Order
const createOrder = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }

    const createdOrder = await orderService.createOrder(user, req.body);

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: createdOrder,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create order.",
      error: error.message,
    });
  }
};

// ✅ Get Order by ID

const findOrderById = async (req, res) => {
  try {
    const order = await orderService.findOrderById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully.",
      data: order,
    });
  } catch (error) {
    console.error("❌ Error finding order:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
      error: error.message,
    });
  }
};

// ✅ Get Order History of Logged-in User
const orderHistory = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user." });
    }

    const orders = await orderService.usersOrderHistory(user._id);

    return res.status(200).json({
      success: true,
      message: "Order history fetched successfully.",
      data: orders,
    });
  } catch (error) {
    console.error("❌ Error fetching order history:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order history.",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  findOrderById,
  orderHistory,
};
