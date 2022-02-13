const authMiddleWare = require("./auth.middleware");

const corsOptions = {
  origin: true,
  allowedHeaders: ["Content-Type", "Authorization", process.env.AUTH_NAME],
  credentials: true,
};

const Middlewares = (fastify) => {
  fastify.register(require("fastify-helmet"), { contentSecurityPolicy: false });
  fastify.register(require("fastify-cors", corsOptions));
  fastify.register(require("fastify-cookie"), {
    secret: process.env.AUTH_NAME,
  });
  fastify.register(require("fastify-multipart"), {
    attachFieldsToBody: true,
    limit: { fileSize: 5 * 1024 * 1024 },
  });
  authMiddleWare(fastify);
};

module.exports = Middlewares;
