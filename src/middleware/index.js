const { isLoggedIn } = require("./auth.middleware");

const corsOptions = {
  origin:
    process.env.ENVIRONMENT !== "development"
      ? true
      : "https://yabure-upload.netlify.app",
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization", "auth_key", "Accept"],
  credentials: true,
};

console.log(process.env.AUTH_NAME);

const Middlewares = (fastify) => {
  fastify.register(require("fastify-cors"), corsOptions);
  fastify.register(require("fastify-helmet"), { contentSecurityPolicy: false });
  fastify.register(require("fastify-cookie"), {
    secret: process.env.AUTH_NAME,
  });
  fastify.register(require("fastify-multipart"), {
    attachFieldsToBody: true,
    limit: { fileSize: 5 * 1024 * 1024 },
  });
  isLoggedIn(fastify);
};

module.exports = Middlewares;
