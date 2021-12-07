const paymentController = require("../controllers/payment.controller");

const payment = (fastify, options, next) => {
    fastify.get("/", paymentController.getAll);
    fastify.post("/activate", paymentController.initializeTransaction);
    fastify.post("/confirm", paymentController.subscriptionWebhook);
    fastify.get("/confirm", paymentController.subscriptionWebhook);
    next();
}

module.exports = payment