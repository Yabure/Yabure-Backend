const auth = require("./auth.routes")

const routes = (fastify) => {
    fastify.register(auth, {prefix: "/v1/auth"})
};

module.exports = routes;