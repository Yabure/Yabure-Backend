const interestController = require("../controllers/interest.controller")

const interest = (fastify, options, next) => {
    fastify.get("/interests", interestController.getAllInterest);
    // fastify.post("/login", authController.login);
    // fastify.post("/verify", authController.verifyUser);
    next();
}

module.exports = interest