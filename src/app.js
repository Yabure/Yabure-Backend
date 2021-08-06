const fastify = require("fastify")
const app = fastify()
const middlewares = require("./middleware")
const routes = require("./routes")


middlewares(app)
routes(app)

module.exports = app
