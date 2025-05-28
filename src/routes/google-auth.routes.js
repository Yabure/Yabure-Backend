const fastifyPassport = require('../config/passport');
const Response = require('../utils/errorResponse');

// Google Auth routes
const googleAuthRoutes = (fastify, options, next) => {
  // Route to initiate Google OAuth authentication
  fastify.get('/google', {
    preValidation: fastifyPassport.authenticate('google', {
      scope: ['profile', 'email']
    }),
    schema: {
      tags: ['Auth'],
      summary: 'Google Authentication',
      description: 'Initiate Google authentication process',
      response: {
        200: {
          description: 'Successful authentication',
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    // This route handler won't be called as the authentication middleware
    // will redirect to Google's authentication page
  });

  // Callback route that Google will redirect to after authentication
  fastify.get('/google/callback', {
    preValidation: fastifyPassport.authenticate('google', {
      failureRedirect: '/login',
      authInfo: false
    })
  }, async (request, reply) => {
    // Generate JWT token for the authenticated user
    const user = request.user;
    const authToken = require('../utils/token.utils').generateToken({
      id: user.id,
      subscribed: user.subscribed,
      expire: user.expire,
      role: user.role,
    });

    // Set cookie with the JWT token
    reply.setCookie(process.env.SESSION_NAME, authToken, {
      path: '/',
      secure: process.env.ENVIRONMENT !== 'development',
      httpOnly: true,
      sameSite: 'Lax'
    });

    // Return success response
    return Response.SUCCESS({
      response: reply,
      data: {
        subscribed: user.subscribed,
        profile: user.profile,
        isVerified: user.isVerified,
        role: user.role,
        can_upload: user.can_upload
      },
      message: 'Google Authentication Successful'
    });
  });

  next();
};

module.exports = googleAuthRoutes;
