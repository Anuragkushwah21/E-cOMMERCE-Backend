const razorpay = require("../connectDb/razorpayClient");
const orderService = require("../services/order.services");

const createPaymentLink = async (orderId) => {
  try {
    const order = await orderService.findOrderById(orderId);
    if (!order) {
      return { success: false, message: "Order not found." };
    }
    const paymentLinkRequest = {
      amount: order.totalPrice * 100,
      currency: "INR",
      customer: {
        name: order.user.firstName + " " + order.user.lastName,
        email: order.user.email,
        contact: order.user.mobile,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      callback_url: `http://localhost:5173/api/payments/${orderId}`,
      callback_method: "get",
    };
    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
    const paymentLinkId = paymentLink.id;
    const payment_link_url = paymentLink.short_url;

    const resData = {
      paymentLinkId: paymentLinkId,
      payment_link_url,
    };

    return resData;
  } catch (error) {
    console.log("Error creating payment link:", error.message);
    throw new error("Failed to create payment link.");
  }
};

const updatePaymentInformation = async (reqData) => {
  const paymentId = reqData.payment_id;
  const orderId = reqData.order_id;
  try {
    const order = await orderService.findOrderById(orderId);
    const paymentInfo = await razorpay.payments.fetch(paymentId);

    if (paymentInfo.status === "capture") {
      order.paymentDetails.paymentId = paymentId;
      (order.paymentDetails.status = "COMPLETED"),
        (order.orderStatus = "PLACED");
    }
    await order.save();
  } catch (error) {
    console.log("error updating payment information:", error);
    throw new error(error.message);
  }
};

module.exports = { createPaymentLink, updatePaymentInformation };
