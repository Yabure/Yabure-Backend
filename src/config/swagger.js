// Simple Swagger configuration for Fastify 4.x
const swaggerOptions = {
  swagger: {
    info: {
      title: 'Yabure API Documentation',
      description: 'API documentation for the Yabure backend service',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Auth', description: 'Authentication related endpoints' },
      { name: 'Books', description: 'Book management endpoints' },
      { name: 'User', description: 'User related operations' },
      { name: 'Profile', description: 'User profile operations' },
      { name: 'Payment', description: 'Payment and subscription endpoints' },
      { name: 'Admin', description: 'Admin operations' }
    ],
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  }
};

const swaggerUiOptions = {
  routePrefix: '/documentation',
  exposeRoute: true
};

module.exports = { swaggerOptions, swaggerUiOptions };
