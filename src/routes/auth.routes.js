const authController = require("../controllers/auth.controller");

const auth = (fastify, options, next) => {
  // Register endpoint
  fastify.post("/register", {
    schema: {
      tags: ['Auth'],
      summary: 'Register a new user',
      description: 'Creates a new user account with profile information',
      body: {
        type: 'object',
        required: ['email', 'password', 'fullName', 'username', 'phoneNumber'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          fullName: { type: 'string' },
          username: { type: 'string' },
          phoneNumber: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Successful registration',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Invalid request',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            error: { type: 'string' },
            message: { type: 'object' },
            subscribed: { type: 'boolean' }
          }
        }
      }
    },
    handler: authController.register
  });

  // Auth0 endpoint
  fastify.post("/auth0", {
    schema: {
      tags: ['Auth'],
      summary: 'Authenticate with Auth0 [Deprecated]',
      description: 'Authenticate user with Auth0 credentials',
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
          fullName: { type: 'string' },
          picture: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Successful authentication',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { 
              type: 'object',
              properties: {
                data: { type: 'object' },
                is_new: { type: 'boolean' }
              }
            },
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Error response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: authController.auth0
  });

  // Login endpoint
  fastify.post("/login", {
    schema: {
      tags: ['Auth'],
      summary: 'User login',
      description: 'Authenticate user with email and password',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 }
        }
      },
      response: {
        200: {
          description: 'Successful login',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { type: 'object' },
            message: { type: 'string' },
            subscribed: { type: 'boolean' }
          }
        },
        400: {
          description: 'Error response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: authController.login
  });

  // Logout endpoint
  fastify.post("/logout", {
    schema: {
      tags: ['Auth'],
      summary: 'User logout',
      description: 'Log out the current user',
      response: {
        200: {
          description: 'Successfully logged out',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: authController.logOut
  });

  // Verify user endpoint
  fastify.post("/verify", {
    schema: {
      tags: ['Auth'],
      summary: 'Verify user email',
      description: 'Verify user email with token',
      body: {
        type: 'object',
        required: ['token', 'email'],
        properties: {
          token: { type: 'string' },
          email: { type: 'string', format: 'email' }
        }
      },
      response: {
        200: {
          description: 'Success response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Error response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: authController.verifyUser
  });

  // Resend verification token endpoint
  fastify.post("/resend-token", {
    schema: {
      tags: ['Auth'],
      summary: 'Resend verification token',
      description: 'Resend verification token to user email',
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' }
        }
      },
      response: {
        200: {
          description: 'Success response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Error response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: authController.resendVerification
  });

  // Forgot password endpoint
  fastify.post("/forgotPassword", {
    schema: {
      tags: ['Auth'],
      summary: 'Forgot password',
      description: 'Send password reset link to user email',
      querystring: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' }
        }
      },
      response: {
        200: {
          description: 'Success response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Error response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: authController.forgotPassword
  });

  // Reset password endpoint
  fastify.post("/resetPassword", {
    schema: {
      tags: ['Auth'],
      summary: 'Reset password',
      description: 'Reset user password with token',
      body: {
        type: 'object',
        required: ['token', 'password', 'email'],
        properties: {
          token: { type: 'string' },
          password: { type: 'string', minLength: 6 },
          email: { type: 'string', format: 'email' }
        }
      },
      response: {
        200: {
          description: 'Success response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Error response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: authController.resetPassword
  });

  next();
};

module.exports = auth;
