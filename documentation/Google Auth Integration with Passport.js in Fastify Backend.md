# Google Auth Integration with Passport.js in Fastify Backend

This document provides instructions for setting up and using Google OAuth authentication in the Yabure-Backend application.

## Overview

The integration uses the following packages:
- `@fastify/passport`: Passport.js integration for Fastify
- `passport-google-oauth20`: Google OAuth 2.0 strategy for Passport.js
- `@fastify/secure-session`: Session management for Fastify

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your `.env` file:

```
# Google OAuth credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/v1/auth/google/callback
```

### 2. Google Developer Console Setup

1. Go to the [Google Developer Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add your application name
7. Add authorized JavaScript origins (e.g., `http://localhost:3000`)
8. Add authorized redirect URIs (e.g., `http://localhost:3000/v1/auth/google/callback`)
9. Click "Create" and note your Client ID and Client Secret

### 3. Secret Key Generation

The application uses a secret key for secure sessions. Generate it with:

```bash
mkdir -p /path/to/your/app
cd /path/to/your/app
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" > secret-key
```

## Authentication Flow

1. User initiates Google login by accessing `/v1/auth/google`
2. User is redirected to Google's authentication page
3. After successful authentication, Google redirects to `/v1/auth/google/callback`
4. The application creates or updates the user in the database
5. A JWT token is generated and set as a cookie
6. The user is now authenticated and can access protected routes

## Implementation Details

### Files Added/Modified

1. **src/config/passport.js**: Configures Passport.js with Google OAuth strategy
2. **src/config/session.js**: Sets up secure session configuration
3. **src/services/google-auth.service.js**: Service for integrating Google Auth with Fastify
4. **src/routes/google-auth.routes.js**: Routes for Google authentication
5. **src/middleware/index.js**: Modified to include Google Auth setup
6. **src/routes/index.js**: Modified to register Google Auth routes

### Authentication Routes

- **GET /v1/auth/google**: Initiates Google OAuth authentication
- **GET /v1/auth/google/callback**: Callback URL for Google OAuth

## Testing

To test the Google authentication:

1. Start the application with `npm run dev`
2. Navigate to `http://localhost:3000/v1/auth/google` in your browser
3. You should be redirected to Google's login page
4. After successful login, you'll be redirected back to the application
5. Check the browser cookies to verify that the authentication token is set

## Troubleshooting

- **Invalid Redirect URI**: Ensure the callback URL in your code matches exactly what's configured in the Google Developer Console
- **Authentication Errors**: Check the server logs for detailed error messages
- **Session Issues**: Verify that the secret key is properly generated and accessible

## Security Considerations

- Keep your Google Client ID and Secret secure
- Use HTTPS in production environments
- Consider implementing CSRF protection
- Regularly rotate your secret key
