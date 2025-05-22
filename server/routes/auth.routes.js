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

module.exports = router; 