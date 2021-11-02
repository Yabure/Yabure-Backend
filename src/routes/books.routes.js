const bookController = require("../controllers/book.controller")

const book  = (fastify, options, next) => {
    fastify.post("/upload", bookController.uploadBook);
    fastify.get("/", bookController.getAllBooks);
    fastify.get("/new", bookController.getNewBooks);
    fastify.get("/suggested", bookController.getSuggestedBooks);
    fastify.get("/reading", bookController.getReadingBooks);
    fastify.post("/reading", bookController.addReadingBooks);
    fastify.get("/finished", bookController.getFinishedBooks);
    fastify.post("/finished", bookController.addFinishedBooks);
    fastify.post("/rate", bookController.rateBook);
    next();
}

module.exports = book