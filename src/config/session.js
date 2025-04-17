// This file configures the secure session for Passport.js
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Function to generate a secret key file if it doesn't exist
const ensureSecretKey = () => {
  const secretKeyPath = path.join(__dirname, '../../secret-key');

  if (!fs.existsSync(secretKeyPath)) {
    console.log('Generating new secret key for secure sessions...');
    // Generate a random 32-byte key
    const secretKey = crypto.randomBytes(32);
    fs.writeFileSync(secretKeyPath, secretKey);
    console.log('Secret key generated successfully.');
  }

  return secretKeyPath;
};

// Session configuration
const sessionConfig = {
  key: fs.readFileSync(ensureSecretKey()),
  cookie: {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
};

module.exports = {
  sessionConfig,
  ensureSecretKey
};
