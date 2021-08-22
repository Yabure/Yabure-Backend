const userController = require("../controllers/user.controller")

const interest = (fastify, options, next) => {
    fastify.post("/interests", userController.storeInterest);
    next();
}

module.exports = interest