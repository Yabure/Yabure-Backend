const accountController = require("../controllers/account.controller")

const account = (fastify, options, next) => {
    fastify.get("/verify", accountController.verify);
    fastify.get("/banks", accountController.getBanks);
    next();
}

module.exports = account