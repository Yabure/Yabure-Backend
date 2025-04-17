# OTP Verification Implementation Documentation

## Overview
This document outlines the implementation of 6-digit OTP verification for both user registration and password reset in the Yabure-Backend application.

## 1. Email Verification Implementation

### Modified Files:
- **src/services/auth.service.js**: Updated to implement OTP verification during registration
- **src/views/token.handlebars**: Redesigned to display only the 6-digit OTP code

### Key Changes:
- User accounts are now created with `isVerified: false`
- 6-digit OTP is generated and sent to user's email during registration
- Users must verify their email by entering the OTP before they can log in
- Email template displays only the OTP code without any URL links

### Verification Flow:
1. User registers with email and password
2. System creates account with `isVerified: false`
3. System generates 6-digit OTP and sends to user's email
4. User receives email with OTP
5. User submits OTP through verification endpoint
6. System verifies OTP and updates `isVerified` to true
7. User can now log in successfully

## 2. Password Reset Implementation

### Modified Files:
- **src/services/auth.service.js**: Updated forgotPassword and resetPassword methods
- **src/services/mail.service.js**: Added sendPasswordResetOTP method
- **src/views/password-reset.handlebars**: New template for password reset OTP

### Key Changes:
- Password reset now uses 6-digit OTP instead of UUID
- forgotPassword generates OTP and sends email
- resetPassword verifies OTP before allowing password change
- New email template displays only the OTP code

### Password Reset Flow:
1. User requests password reset with their email
2. System generates 6-digit OTP and sends to user's email
3. User receives email with OTP
4. User submits email, OTP, and new password
5. System verifies OTP
6. If valid, system updates user's password
7. User can now log in with new password

## Technical Implementation Details

### OTP Generation
The system uses the existing `randomSixDigits()` function in `helpers.js`:
```javascript
helper.randomSixDigits = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};
```

### Token Storage and Verification
The system uses the existing token service methods:
```javascript
token.generateVerificationToken = async (email) => {
    const userToken = await Token.findByEmail(email)
    if(userToken) await Token.remove(userToken.email)
    const tokenDigits = helper.randomSixDigits();
    const data = {
        email, 
        token: tokenDigits
    }
    await Token.insert(data)
    return tokenDigits
}

token.verifyUserToken = async (email, token) => {
    const userToken = await Token.findByEmail(email)
    if(userToken && userToken.token === token) {
        await Token.remove(email)
        return true
    }
    return false
}
```

### Email Templates
Both email templates (verification and password reset) follow the same design pattern:
- Clean, modern layout
- Prominent display of the 6-digit code
- Clear instructions for using the code
- No URL links, only the pure OTP code

## Security Considerations
- OTP codes expire after use (removed from database)
- Verification required before login is allowed
- Password reset requires valid OTP verification
- Email templates instruct users not to share their codes
