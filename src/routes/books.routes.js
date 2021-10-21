const bookController = require("../controllers/book.controller")

const book  = (fastify, options, next) => {
    fastify.post("/upload", bookController.uploadPdf);
    fastify.get("/", bookController.getAllBooks);
    fastify.get("/suggested", bookController.getSuggestedBooks);
    fastify.post("/rate", bookController.rateBook);
    next();
}

module.exports = book