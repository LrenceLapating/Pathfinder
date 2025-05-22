const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Update user profile with role and details
router.post('/profile', authController.updateProfile);

module.exports = router; 