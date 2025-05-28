/**
 * Swagger schema definitions for common data models in OpenAPI 3.0 format
 */

// These schemas will be directly accessible in the components.schemas section
module.exports = {
  User: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      email: { type: 'string', format: 'email' },
      devices: { type: 'array', items: { type: 'string' } },
      average_rating: { type: 'number', format: 'float' },
      sales: { type: 'number', format: 'float' },
      balance: { type: 'number', format: 'float' },
      boughtBooks: { type: 'array', items: { type: 'string' } },
      subscribed: { type: 'boolean' },
      can_upload: { type: 'boolean' },
      role: { type: 'string', enum: ['USER', 'ADMIN', 'MODERATOR'] },
      isVerified: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  Profile: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      fullName: { type: 'string' },
      username: { type: 'string' },
      picture: { type: 'string' },
      bio: { type: 'string' },
      phoneNumber: { type: 'string' },
      notes: { type: 'integer' },
      streams: { type: 'integer' },
      views: { type: 'array', items: { type: 'string' } },
      likes: { type: 'array', items: { type: 'string' } },
      dislikes: { type: 'array', items: { type: 'string' } },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  Book: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      author: { type: 'string', format: 'uuid' },
      bookName: { type: 'string' },
      bookNumber: { type: 'string' },
      category: { type: 'string' },
      cover_photo: { type: 'string' },
      price: { type: 'number', format: 'float' },
      discounted_price: { type: 'number', format: 'float' },
      rating: { type: 'object' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  Account: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      accountNumber: { type: 'string' },
      bank: { type: 'string' },
      accountName: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  Comment: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      explanationsId: { type: 'string', format: 'uuid' },
      comment: { type: 'string' },
      replies: { type: 'array', items: { type: 'object' } },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  // Auth schemas
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 }
    }
  },
  RegisterRequest: {
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
  SuccessResponse: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer' },
      data: { type: 'object' },
      message: { type: 'string' },
      subscribed: { type: 'boolean' }
    }
  },
  ErrorResponse: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer' },
      error: { type: 'string' },
      message: { type: 'string' }
    }
  }
};
