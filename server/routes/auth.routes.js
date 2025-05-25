const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// User registration route
router.post('/signup', authController.signup);

// User login route
router.post('/signin', authController.signin);

// Google OAuth route
router.post('/google', authController.googleAuth);

// Update user profile with role
router.post('/profile', authController.updateProfile);

// Email verification route
router.get('/verify-email', authController.verifyEmail);

// Resend verification email
router.post('/resend-verification', authController.resendVerification);

// Forgot password - request password reset
router.post('/forgot-password', authController.forgotPassword);

// Reset password with token
router.post('/reset-password', authController.resetPassword);

module.exports = router; 