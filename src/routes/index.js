const auth = require("./auth.routes")
const rules = require("./rules.routes")
const interest = require("./interest.routes")

const routes = (fastify) => {
    fastify.register(auth, {prefix: "/v1/auth"})
    fastify.register(rules, {prefix: "/v1/"})
    fastify.register(interest, {prefix: "/v1/"})
};

module.exports = routes;