const { createRouteHandler } = require("uploadthing/fastify");
const bookController = require("../controllers/book.controller");
const { canUploadMiddleware } = require("../middleware/roles.middleware");
const uploadRouter = require("../services/uploadthing");

const book = (fastify, options, next) => {
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
          200: { $ref: '#/components/schemas/SuccessResponse' },
          400: { $ref: '#/components/schemas/ErrorResponse' },
          401: { $ref: '#/components/schemas/ErrorResponse' }
        },
        security: [{ bearerAuth: [] }]
      }
    },
    bookController.uploadBook
  );

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
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { 
              type: 'object',
              properties: {
                books: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Book' }
                },
                total: { type: 'integer' },
                page: { type: 'integer' },
                limit: { type: 'integer' }
              }
            },
            message: { type: 'string' }
          }
        }
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
        200: { 
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { 
              type: 'array',
              items: { $ref: '#/components/schemas/Book' }
            },
            message: { type: 'string' }
          }
        }
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
        200: { 
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { 
              type: 'array',
              items: { $ref: '#/components/schemas/Book' }
            },
            message: { type: 'string' }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: bookController.getSuggestedBooks
  });

  // Get reading books endpoint
  fastify.get("/reading", {
    schema: {
      tags: ['Books'],
      summary: 'Get currently reading books',
      description: 'Retrieve books the user is currently reading',
      response: {
        200: { 
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { 
              type: 'array',
              items: { 
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  bookId: { type: 'string' },
                  last_read: { type: 'string' },
                  book: { $ref: '#/components/schemas/Book' }
                }
              }
            },
            message: { type: 'string' }
          }
        },
        401: { $ref: '#/components/schemas/ErrorResponse' }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: bookController.getReadingBooks
  });

  // Add reading book endpoint
  fastify.post("/reading", {
    schema: {
      tags: ['Books'],
      summary: 'Add book to reading list',
      description: 'Add a book to user\'s currently reading list',
      body: {
        type: 'object',
        required: ['bookId'],
        properties: {
          bookId: { type: 'string' },
          last_read: { type: 'string' }
        }
      },
      response: {
        200: { $ref: '#/components/schemas/SuccessResponse' },
        400: { $ref: '#/components/schemas/ErrorResponse' },
        401: { $ref: '#/components/schemas/ErrorResponse' }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: bookController.addReadingBooks
  });

  // Get finished books endpoint
  fastify.get("/finished", {
    schema: {
      tags: ['Books'],
      summary: 'Get finished books',
      description: 'Retrieve books the user has finished reading',
      response: {
        200: { 
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { 
              type: 'array',
              items: { 
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  bookId: { type: 'string' },
                  last_read: { type: 'string' },
                  book: { $ref: '#/components/schemas/Book' }
                }
              }
            },
            message: { type: 'string' }
          }
        },
        401: { $ref: '#/components/schemas/ErrorResponse' }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: bookController.getFinishedBooks
  });

  // Add finished book endpoint
  fastify.post("/finished", {
    schema: {
      tags: ['Books'],
      summary: 'Add book to finished list',
      description: 'Mark a book as finished reading',
      body: {
        type: 'object',
        required: ['bookId'],
        properties: {
          bookId: { type: 'string' },
          last_read: { type: 'string' }
        }
      },
      response: {
        200: { $ref: '#/components/schemas/SuccessResponse' },
        400: { $ref: '#/components/schemas/ErrorResponse' },
        401: { $ref: '#/components/schemas/ErrorResponse' }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: bookController.addFinishedBooks
  });

  // Rate book endpoint
  fastify.post("/rate", {
    schema: {
      tags: ['Books'],
      summary: 'Rate a book',
      description: 'Add a rating to a book',
      body: {
        type: 'object',
        required: ['bookId', 'rating'],
        properties: {
          bookId: { type: 'string' },
          rating: { type: 'number', minimum: 1, maximum: 5 }
        }
      },
      response: {
        200: { $ref: '#/components/schemas/SuccessResponse' },
        400: { $ref: '#/components/schemas/ErrorResponse' },
        401: { $ref: '#/components/schemas/ErrorResponse' }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: bookController.rateBook
  });

  // Add explanation endpoint
  fastify.post("/explanation", {
    schema: {
      tags: ['Books'],
      summary: 'Add explanation',
      description: 'Add an explanation to a book',
      body: {
        type: 'object',
        required: ['bookId', 'explanation'],
        properties: {
          bookId: { type: 'string' },
          explanation: { type: 'string' }
        }
      },
      response: {
        200: { $ref: '#/components/schemas/SuccessResponse' },
        400: { $ref: '#/components/schemas/ErrorResponse' },
        401: { $ref: '#/components/schemas/ErrorResponse' }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: bookController.addExplanation
  });

  // Get explanations endpoint
  fastify.get("/explanation/:bookId", {
    schema: {
      tags: ['Books'],
      summary: 'Get explanations for a book',
      description: 'Retrieve all explanations for a specific book',
      params: {
        type: 'object',
        required: ['bookId'],
        properties: {
          bookId: { type: 'string' }
        }
      },
      response: {
        200: { 
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  userId: { type: 'string' },
                  bookId: { type: 'string' },
                  explanation: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: bookController.getExplanations
  });

  // Add comments endpoint
  fastify.post("/explanation/comments", {
    schema: {
      tags: ['Books'],
      summary: 'Add comment to explanation',
      description: 'Add a comment to a book explanation',
      body: {
        type: 'object',
        required: ['explanationsId', 'comment'],
        properties: {
          explanationsId: { type: 'string' },
          comment: { type: 'string' }
        }
      },
      response: {
        200: { $ref: '#/components/schemas/SuccessResponse' },
        400: { $ref: '#/components/schemas/ErrorResponse' },
        401: { $ref: '#/components/schemas/ErrorResponse' }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: bookController.addComments
  });

  // Get explanation comments endpoint
  fastify.get(
    "/explanation/comments/:explanationsId",
    {
      schema: {
        tags: ['Books'],
        summary: 'Get comments for explanation',
        description: 'Retrieve all comments for a specific explanation',
        params: {
          type: 'object',
          required: ['explanationsId'],
          properties: {
            explanationsId: { type: 'string' }
          }
        },
        response: {
          200: { 
            description: 'Successful response',
            type: 'object',
            properties: {
              statusCode: { type: 'integer' },
              data: { 
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    explanationsId: { type: 'string' },
                    comment: { type: 'string' },
                    replies: { type: 'array', items: { type: 'object' } },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                  }
                }
              },
              message: { type: 'string' }
            }
          }
        }
      }
    },
    bookController.getExplanationsComments
  );

  // Reply to comment endpoint
  fastify.post("/explanation/comments/reply", {
    schema: {
      tags: ['Books'],
      summary: 'Reply to comment',
      description: 'Add a reply to a comment',
      body: {
        type: 'object',
        required: ['commentId', 'reply'],
        properties: {
          commentId: { type: 'string' },
          reply: { type: 'string' }
        }
      },
      response: {
        200: { $ref: '#/components/schemas/SuccessResponse' },
        400: { $ref: '#/components/schemas/ErrorResponse' },
        401: { $ref: '#/components/schemas/ErrorResponse' }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: bookController.replyComment
  });

  // Update reading last read endpoint
  fastify.post("/reading/last-read", {
    schema: {
      tags: ['Books'],
      summary: 'Update last read position',
      description: 'Update the last read position for a book',
      body: {
        type: 'object',
        required: ['bookId', 'last_read'],
        properties: {
          bookId: { type: 'string' },
          last_read: { type: 'string' }
        }
      },
      response: {
        200: { $ref: '#/components/schemas/SuccessResponse' },
        400: { $ref: '#/components/schemas/ErrorResponse' },
        401: { $ref: '#/components/schemas/ErrorResponse' }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: bookController.updateReadingLastRead
  });

  // Upload book with key endpoint
  fastify.post("/upload/book", {
    schema: {
      tags: ['Books'],
      summary: 'Upload book with key',
      description: 'Upload a book using an upload key',
      body: {
        type: 'object',
        required: ['key', 'book'],
        properties: {
          key: { type: 'string' },
          book: {
            type: 'object',
            properties: {
              bookName: { type: 'string' },
              category: { type: 'string' },
              price: { type: 'number' },
              cover_photo: { type: 'string' },
              content: { type: 'string' }
            }
          }
        }
      },
      response: {
        200: { $ref: '#/components/schemas/SuccessResponse' },
        400: { $ref: '#/components/schemas/ErrorResponse' }
      }
    },
    handler: bookController.uploadKeyBook
  });

  // Get popular uploaders endpoint
  fastify.get("/popular-uploaders", {
    schema: {
      tags: ['Books'],
      summary: 'Get popular uploaders',
      description: 'Retrieve popular book uploaders/authors',
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { type: 'array', items: { type: 'object' } },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: bookController.getPopularUploaders
  });

  // Get similar uploaders endpoint
  fastify.get("/similar-uploaders", {
    schema: {
      tags: ['Books'],
      summary: 'Get similar uploaders',
      description: 'Retrieve uploaders similar to current user interests',
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { type: 'array', items: { type: 'object' } },
            message: { type: 'string' }
          }
        },
        401: { $ref: '#/components/schemas/ErrorResponse' }
      },
      security: [{ bearerAuth: [] }]
    },
    handler: bookController.getSimilarUploaders
  });

  // Get similar books endpoint
  fastify.get("/similar-books", {
    schema: {
      tags: ['Books'],
      summary: 'Get similar books',
      description: 'Retrieve books similar to user\'s interests',
      querystring: {
        type: 'object',
        properties: {
          bookId: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { type: 'array', items: { $ref: '#/components/schemas/Book' } },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: bookController.getSimilarBooks
  });

  next();
};

module.exports = book;
