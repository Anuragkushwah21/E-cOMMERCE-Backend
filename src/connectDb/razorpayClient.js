const Razorpay = require("razorpay");

const apiKey = "rzp_test_R9EMc4OrD5lJrd";
const apiSecret = "sli2v50UxWArtqJQsFfFXJTG";

const razorpay = new Razorpay({
  key_id: apiKey,
  key_secret: apiSecret,
});

module.exports = razorpay;
