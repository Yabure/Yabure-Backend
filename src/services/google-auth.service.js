const fastifyPassport = require('../config/passport');
const { sessionConfig } = require('../config/session');
const fp = require('fastify-plugin');

// Function to integrate Google Auth with the application
const setupGoogleAuth = async (fastify) => {
  // Register secure session for Passport
  await fastify.register(require('@fastify/secure-session'), sessionConfig);

  // Initialize Passport and session support
  await fastify.register(fastifyPassport.initialize());
  await fastify.register(fastifyPassport.secureSession());

  console.log('Google Auth strategy configured successfully');
};

// Export as a plugin that doesn't get encapsulated
module.exports = fp(setupGoogleAuth);
