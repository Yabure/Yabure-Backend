const userController = require("../controllers/user.controller")

const user = (fastify, options, next) => {
    fastify.post("/interests", userController.storeInterest);
    fastify.get("/popular", userController.gtePopularUploaders);
    next();
}

module.exports = user