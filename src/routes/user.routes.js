const userController = require("../controllers/user.controller")

const user = (fastify, options, next) => {
    fastify.post("/interests", userController.storeInterest);
    fastify.get("/rating", userController.getUserRating);
    fastify.post("/rate", userController.rateUser);
    next();
}

module.exports = user