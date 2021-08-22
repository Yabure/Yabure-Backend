const middlewares = require("./middleware")
const routes = require("./routes")


const App = server => {
    middlewares(server)
    routes(server)
}

module.exports = App
