const subscriptionController = require("../_webhook/subscription/subscription.controller");

const webhook = (fastify, options, next) => {
    fastify.post("/subscription/confirm", subscriptionController.subscriptionWebhook);
    next();
}

module.exports = webhook