const dashboardController = require("../controllers/dashboard.controller")

const dashboard = (fastify, options, next) => {
    fastify.get("/dashboard/popular-uploaders", dashboardController.popularUploaders);
    next();
}

module.exports = dashboard