const ruleController = require("../controllers/rules.controller")

const rule = (fastify, options, next) => {
    fastify.get("/rules", ruleController.getRules);
    // fastify.post("/login", authController.login);
    // fastify.post("/verify", authController.verifyUser);
    next();
}

module.exports = rule