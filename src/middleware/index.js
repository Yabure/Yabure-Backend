const Middlewares = (fastify) => {
    fastify.register(require("fastify-helmet"), {contentSecurityPolicy: false});
    fastify.register(require("fastify-cors"));
    fastify.register(require("fastify-cookie"), { secret: process.env.AUTH_NAME })
}

module.exports = Middlewares