const { createRouteHandler } = require("uploadthing/fastify");
const bookController = require("../controllers/book.controller");
const { canUploadMiddleware } = require("../middleware/roles.middleware");
const uploadRouter = require("../services/uploadthing");

const book = (fastify, options, next) => {
  fastify.post(
    "/upload",
    { preHandler: [canUploadMiddleware] },
    bookController.uploadBook
  );
  fastify.get("/", bookController.getAllBooks);
  fastify.get("/new", bookController.getNewBooks);
  fastify.get("/suggested", bookController.getSuggestedBooks);
  fastify.get("/reading", bookController.getReadingBooks);
  fastify.post("/reading", bookController.addReadingBooks);
  fastify.get("/finished", bookController.getFinishedBooks);
  fastify.post("/finished", bookController.addFinishedBooks);
  fastify.post("/rate", bookController.rateBook);

  fastify.post("/explanation", bookController.addExplanation);
  fastify.get("/explanation/:bookId", bookController.getExplanations);
  fastify.post("/explanation/comments", bookController.addComments);
  fastify.get(
    "/explanation/comments/:explanationsId",
    bookController.getExplanationsComments
  );
  fastify.post("/explanation/comments/reply", bookController.replyComment);
  fastify.post("/reading/last-read", bookController.updateReadingLastRead);

  fastify.post("/upload/book", bookController.uploadKeyBook);
  fastify.get("/popular-uploaders", bookController.getPopularUploaders);
  fastify.get("/similar-uploaders", bookController.getSimilarUploaders);
  fastify.get("/similar-books", bookController.getSimilarBooks);
  next();
};

module.exports = book;
