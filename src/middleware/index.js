const authMiddleWare = require("./auth.middleware")


const corsOptions = {
    origin: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization', process.env.AUTH_NAME],
    credentials: true,
  };

const Middlewares = (fastify) => {
    fastify.register(require("fastify-helmet"), {contentSecurityPolicy: false});
    fastify.register(require("fastify-cors", corsOptions));
    fastify.register(require("fastify-cookie"), { secret: process.env.AUTH_NAME })
    authMiddleWare(fastify)
}

module.exports = Middlewares 