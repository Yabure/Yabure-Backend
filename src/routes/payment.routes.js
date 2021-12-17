const paymentController = require("../controllers/payment.controller");

const payment = (fastify, options, next) => {
    fastify.get("/", paymentController.getAll);
    fastify.post("/activate", paymentController.initializeTransaction);
    next();
}

module.exports = payment