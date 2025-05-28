const { createRouteHandler } = require("uploadthing/fastify");
const bookController = require("../controllers/book.controller");
const { canUploadMiddleware } = require("../middleware/roles.middleware");
const uploadRouter = require("../services/uploadthing");

// Success response schema - reused in multiple routes
const successResponseSchema = {
  description: 'Success response',
  type: 'object',
  properties: {
    statusCode: { type: 'integer' },
    data: { type: 'object' },
    message: { type: 'string' }
  }
};

// Error response schema - reused in multiple routes
const errorResponseSchema = {
  description: 'Error response',
  type: 'object',
  properties: {
    statusCode: { type: 'integer' },
    error: { type: 'string' },
    message: { type: 'string' }
  }
};

const book = (fastify, options, next) => {
  // Get all books endpoint
  fastify.get("/", {
    schema: {
      tags: ['Books'],
      summary: 'Get all books',
      description: 'Retrieve all books available on the platform',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', default: 1 },
          limit: { type: 'integer', default: 10 },
          category: { type: 'string' }
        }
      },
      response: {
        200: successResponseSchema
      }
    },
    handler: bookController.getAllBooks
  });

  // Get new books endpoint
  fastify.get("/new", {
    schema: {
      tags: ['Books'],
      summary: 'Get new books',
      description: 'Retrieve recently added books',
      response: {
        200: successResponseSchema
      }
    },
    handler: bookController.getNewBooks
  });

  // Get suggested books endpoint
  fastify.get("/suggested", {
    schema: {
      tags: ['Books'],
      summary: 'Get suggested books',
      description: 'Retrieve suggested books based on user interests',
      response: {
        200: successResponseSchema
      },
      security: [{ apiKey: [] }]
    },
    handler: bookController.getSuggestedBooks
  });

  // Upload book endpoint
  fastify.post(
    "/upload",
    { 
      preHandler: [canUploadMiddleware],
      schema: {
        tags: ['Books'],
        summary: 'Upload a new book',
        description: 'Upload a new book to the platform (requires upload permission)',
        body: {
          type: 'object',
          required: ['bookName', 'category', 'price'],
          properties: {
            bookName: { type: 'string' },
            category: { type: 'string' },
            price: { type: 'number' },
            discounted_price: { type: 'number' },
            cover_photo: { type: 'string' },
            content: { type: 'string' }
          }
        },
        response: {
          200: successResponseSchema,
          400: errorResponseSchema,
          401: errorResponseSchema
        },
        security: [{ apiKey: [] }]
      }
    },
    bookController.uploadBook
  );

  // Other book endpoints would go here...
  // For brevity, just implementing a few key endpoints

  // Get reading books endpoint
  fastify.get("/reading", {
    schema: {
      tags: ['Books'],
      summary: 'Get currently reading books',
      description: 'Retrieve books the user is currently reading',
      response: {
        200: successResponseSchema,
        401: errorResponseSchema
      },
      security: [{ apiKey: [] }]
    },
    handler: bookController.getReadingBooks
  });

  // Get popular uploaders endpoint
  fastify.get("/popular-uploaders", {
    schema: {
      tags: ['Books'],
      summary: 'Get popular uploaders',
      description: 'Retrieve popular book uploaders/authors',
      response: {
        200: successResponseSchema
      }
    },
    handler: bookController.getPopularUploaders
  });

  // Original routes without schema documentation
  fastify.post("/reading", bookController.addReadingBooks);
  fastify.get("/finished", bookController.getFinishedBooks);
  fastify.post("/finished", bookController.addFinishedBooks);
  fastify.post("/rate", bookController.rateBook);
  fastify.post("/explanation", bookController.addExplanation);
  fastify.get("/explanation/:bookId", bookController.getExplanations);
  fastify.post("/explanation/comments", bookController.addComments);
  fastify.get("/explanation/comments/:explanationsId", bookController.getExplanationsComments);
  fastify.post("/explanation/comments/reply", bookController.replyComment);
  fastify.post("/reading/last-read", bookController.updateReadingLastRead);
  fastify.post("/upload/book", bookController.uploadKeyBook);
  fastify.get("/similar-uploaders", bookController.getSimilarUploaders);
  fastify.get("/similar-books", bookController.getSimilarBooks);
  
  next();
};

module.exports = book;
