const paymentService = require("../services/payment.services");

const createPaymentLink = async (req, res) => {
  try {
    const paymentLink = await paymentService.createPaymentLink(req.params.id);
    return res.status(201).send(paymentLink);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const updatePaymentInformation = async (req, res) => {
  try {
    await paymentService.updatePaymentInformation(req.query);
    return res.status(201).send({
      message: "payment information updated successfully ",
      status: true,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


module.exports={createPaymentLink,updatePaymentInformation}