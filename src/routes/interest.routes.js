const interestController = require("../controllers/interest.controller")

const interest = (fastify, options, next) => {
    fastify.get("/interests", interestController.getAllInterest);
    next();
}

module.exports = interest