const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'pathfinder_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

// User registration
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Passwords do not match' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already in use' 
      });
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password
    });

    // Save user to database
    const user = await User.create(newUser);

    // Generate token
    const token = generateToken(user.id);

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in signup:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration',
      error: error.message
    });
  }
};

// User login
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check if password matches
    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in signin:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login',
      error: error.message
    });
  }
};

// Google OAuth signin/signup
exports.googleAuth = async (req, res) => {
  try {
    const { googleId, email, firstName, lastName, profilePicture } = req.body;

    // Validate required fields
    if (!googleId || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Google ID and email are required' 
      });
    }

    // Check if user exists by Google ID
    let user = await User.findByGoogleId(googleId);
    
    // If not found by Google ID, check by email
    if (!user) {
      user = await User.findByEmail(email);
    }

    // If user exists, update Google ID if needed
    if (user) {
      // If user exists but doesn't have Google ID linked, we could update it here
      // For simplicity, we'll just proceed with login
      const token = generateToken(user.id);
      
      return res.status(200).json({
        success: true,
        message: 'Google login successful',
        token,
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          profilePicture: user.profile_picture,
          role: user.role
        }
      });
    }

    // Create new user if not exists
    const newUser = new User({
      firstName: firstName || 'Google',
      lastName: lastName || 'User',
      email,
      // Generate a random secure password since they're using Google OAuth
      password: Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10),
      googleId,
      profilePicture,
      isVerified: true, // Google accounts are considered verified
      role: 'student' // Assuming a default role
    });

    // Save user to database
    const createdUser = await User.create(newUser);

    // Generate token
    const token = generateToken(createdUser.id);

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Google registration successful',
      token,
      user: {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        profilePicture: createdUser.profilePicture,
        role: createdUser.role
      }
    });
  } catch (error) {
    console.error('Error in Google auth:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during Google authentication',
      error: error.message
    });
  }
};

// Update user profile with role information
exports.updateProfile = async (req, res) => {
  try {
    const { role, studentDetails, teacherDetails } = req.body;
    
    // Get user ID from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication token is required' 
      });
    }
    
    // Verify token and get user ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid authentication token' 
      });
    }
    
    // Validate required fields
    if (!role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Role is required' 
      });
    }
    
    // Update user role in database
    await User.updateRole(userId, role);
    
    // Store additional profile details based on role
    if (role === 'student' && studentDetails) {
      await User.updateStudentProfile(userId, studentDetails);
    } else if (role === 'teacher' && teacherDetails) {
      await User.updateTeacherProfile(userId, teacherDetails);
    }
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      role
    });
    
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating profile',
      error: error.message
    });
  }
}; 