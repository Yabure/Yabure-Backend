const authController = require("../controllers/auth.controller")

const auth = (fastify, options, next) => {
    fastify.post("/register", authController.register);
    fastify.post("/login", authController.login);
    fastify.post("/verify", authController.verifyUser);
    next();
}

module.exports = auth