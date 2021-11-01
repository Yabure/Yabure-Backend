const ruleController = require("../controllers/rules.controller")

const rule = (fastify, options, next) => {
    fastify.get("/rules", ruleController.getRules);
    next();
}

module.exports = rule