const {
  getAllSubscription,
  initializeTransaction,
  addpayment,
} = require("../services/payment.service");
const Response = require("../utils/errorResponse");
const validateErrorFormatter = require("../utils/validateErrorFormatter");

const paymentController = {};

paymentController.getAll = async (req, res) => {
  try {
    const data = await getAllSubscription();
    return Response.SUCCESS({ response: res, data });
  } catch (err) {
    const errors = await validateErrorFormatter(err);
    return Response.INVALID_REQUEST({ response: res, errors });
  }
};

paymentController.initializeTransaction = async (req, res) => {
  try {
    const data = await initializeTransaction(req.body);
    return Response.SUCCESS({ response: res, data });
  } catch (err) {
    const errors = await validateErrorFormatter(err);
    return Response.INVALID_REQUEST({ response: res, errors });
  }
};

paymentController.addPayment = async (req, res) => {
  try {
    await addpayment(req);
    return Response.SUCCESS({
      response: res,
      message: "Request successful",
      data: { subscribed: true },
    });
  } catch (err) {
    const errors = await validateErrorFormatter(err);
    return Response.INVALID_REQUEST({
      response: res,
      errors,
      subscribed: false,
    });
  }
};

module.exports = paymentController;
