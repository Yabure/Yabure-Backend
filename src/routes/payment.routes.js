const paymentController = require("../controllers/payment.controller");

const payment = (fastify, options, next) => {
  fastify.get("/", paymentController.getAll);
  fastify.post("/activate", paymentController.initializeTransaction);
  fastify.post("/save", paymentController.addPayment);
  next();
};

module.exports = payment;
