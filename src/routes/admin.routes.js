const adminAuthController = require("../controllers/admin/auth.admin.controller");

const auth = (fastify, options, next) => {
  fastify.post("/auth/register", adminAuthController.register);
  // fastify.post("/login", authController.login);
  // fastify.post("/logout", authController.logOut);
  // fastify.post("/verify", authController.verifyUser);
  // fastify.post("/resend-token", authController.resendVerification);
  // fastify.post("/forgotPassword", authController.forgotPassword);
  // fastify.post("/resetPassword", authController.resetPassword);
  next();
};

module.exports = auth;
