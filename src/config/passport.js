const { Authenticator } = require('@fastify/passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../data-access/user.dao');
const jwtUtils = require('../utils/token.utils');
const addDateToCurrentDate = require('../utils/date');

// Initialize Passport
const fastifyPassport = new Authenticator();

// Configure Google OAuth Strategy
fastifyPassport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Extract user information from Google profile
    const email = profile.emails[0].value.toLowerCase();
    const firstName = profile.name.givenName;
    const lastName = profile.name.familyName;
    const googleId = profile.id;

    // Check if user exists in database
    let user = await User.findByEmail(email);

    if (!user) {
      // Create new user if not exists
      const userData = {
        email,
        firstName,
        lastName,
        googleId,
        isVerified: true, // Google accounts are already verified
        subscribed: false,
        role: 'USER',
        expire: addDateToCurrentDate(7),
        password: Math.random().toString(36).slice(-8) // Random password for Google users
      };

      user = await User.insert(userData);
    } else {
      // Update existing user with Google ID if not already set
      if (!user.googleId) {
        await User.updateByEmail(email, {
          googleId,
          isVerified: true
        });
      }
    }

    return done(null, user);
  } catch (error) {
    console.error('Error in Google authentication strategy:', error);
    return done(error, null);
  }
}));

// Serialize user to session
fastifyPassport.registerUserSerializer(async (user) => {
  // Store only necessary user information in session
  return { id: user.id, email: user.email };
});

// Deserialize user from session
fastifyPassport.registerUserDeserializer(async (serializedUser) => {
  // Retrieve full user object from database
  try {
    const user = await User.findById(serializedUser.id);
    return user;
  } catch (error) {
    console.error('Error deserializing user:', error);
    return null;
  }
});

module.exports = fastifyPassport;
