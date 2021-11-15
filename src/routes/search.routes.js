const searchController = require("../controllers/search.controller")

const search = (fastify, options, next) => {
    fastify.get("/", searchController.search);
    next();
}

module.exports = search