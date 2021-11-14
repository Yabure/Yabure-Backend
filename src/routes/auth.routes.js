const authController = require("../controllers/auth.controller")

const auth = (fastify, options, next) => {
    fastify.post("/register", authController.register);
    fastify.post("/login", authController.login);
    fastify.post("/verify", authController.verifyUser);
    fastify.post("/resend-token", authController.resendVerification); 
    fastify.post("/forgotPassword", authController.forgotPassword); 
    next();
}

module.exports = auth