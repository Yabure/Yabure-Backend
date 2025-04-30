# Email OTP Verification Flow Design

## Current System Analysis
After analyzing the existing codebase, I've found that most components needed for OTP verification already exist:

1. **Token Generation**: `helpers.randomSixDigits()` generates 6-digit OTP codes
2. **Token Storage**: `token.service.js` has methods to store and verify tokens
3. **Email Service**: `mail.service.js` has email sending capabilities with templates
4. **User Verification**: `user.dao.js` has methods to update user verification status

## Required Changes

### 1. Update Registration Flow
- Modify `auth.service.js` to set `isVerified: false` for new users during registration
- Generate OTP token and send verification email immediately after registration
- Return appropriate response to user indicating verification needed

### 2. Update Login Flow
- Ensure login checks for `isVerified` status
- If not verified, prompt user to verify email before allowing login
- Provide option to resend verification code

### 3. Verification Endpoint
- Ensure `verifyUser` endpoint properly handles OTP verification
- Update to accept OTP code from user
- Verify OTP against stored token
- Update user's `isVerified` status upon successful verification

### 4. Email Template
- Ensure email template for OTP verification is properly configured
- Template should clearly display the OTP code
- Include instructions for using the code

## Implementation Plan
1. Modify `auth.service.js` register method to set `isVerified: false`
2. Update register method to generate and send OTP
3. Ensure `verifyUser` endpoint properly handles OTP verification
4. Check email template for OTP verification
5. Test the complete flow

## User Flow
1. User registers with email and password
2. System creates account with `isVerified: false`
3. System generates 6-digit OTP and sends to user's email
4. User receives email with OTP
5. User submits OTP through verification endpoint
6. System verifies OTP and updates `isVerified` to true
7. User can now log in successfully
