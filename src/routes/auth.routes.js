const authController = require("../controllers/auth.controller");

const auth = (fastify, options, next) => {
  fastify.post("/register", authController.register);
  fastify.post("/auth0", authController.auth0);
  fastify.post("/login", authController.login);
  fastify.post("/logout", authController.logOut);
  fastify.post("/verify", authController.verifyUser);
  fastify.post("/resend-token", authController.resendVerification);
  fastify.post("/forgotPassword", authController.forgotPassword);
  fastify.post("/resetPassword", authController.resetPassword);
  next();
};

module.exports = auth;
