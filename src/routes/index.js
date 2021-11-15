const auth = require("./auth.routes")
const rules = require("./rules.routes")
const interest = require("./interest.routes")
const user = require('./user.routes')
const profile = require('./profile.routes')
const account = require("./account.routes")
const book = require("./books.routes")
const search = require("./search.routes")

const routes = (fastify) => {
    fastify.register(auth, {prefix: "/v1/auth"})
    fastify.register(rules, {prefix: "/v1/"})
    fastify.register(interest, {prefix: "/v1/"})
    fastify.register(user, {prefix: "/v1/user"})
    fastify.register(profile, {prefix: "/v1/profile"})
    fastify.register(account, {prefix: "/v1/account"})
    fastify.register(book, {prefix: "/v1/books"})
    fastify.register(search, {prefix: "/v1/search"})
};

module.exports = routes;