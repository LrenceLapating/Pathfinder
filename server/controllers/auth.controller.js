const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { supabase } = require('../models/index');

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
    
    console.log('Signup attempt with:', { firstName, lastName, email });

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
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
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
      password,
      isVerified: false // Set verification status to false by default
    });

    // Save user to database
    const user = await User.create(newUser);

    // Generate token
    const token = generateToken(user.id);

    // Return success response with verification status
    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: false // Include verification status in response
      },
      requiresVerification: true // Flag to indicate verification is required
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

    // Use Supabase Auth directly for signin
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
    
      // Check for email confirmation issues
      if (authError.message.includes('Email not confirmed')) {
        return res.status(401).json({
          success: false,
          message: 'Please confirm your email address before signing in.'
        });
      }
      
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return res.status(500).json({
        success: false, 
        message: 'Error fetching user profile'
      });
    }

    // Check if email is verified
    const isVerified = authData.user.email_confirmed_at !== null || profile.is_verified;

    // Generate token
    const token = generateToken(profile.id);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        role: profile.role,
        isVerified: isVerified
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
      
      // If user exists with this email but not linked to Google
      if (user && !user.googleId) {
        console.log('Found existing user with email but no Google ID, linking accounts');
        
        // Update the user record to link it with the Google ID
        await User.linkGoogleAccount(user.id, googleId, profilePicture);
        
        // Continue with sign in using the updated user
        const token = generateToken(user.id);
        
        return res.status(200).json({
          success: true,
          message: 'Google account linked and login successful',
          token,
          user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            profilePicture: user.profile_picture || profilePicture,
            role: user.role
          }
        });
      }
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
      // Generate a random secure password with minimum length 10 characters
      password: Math.random().toString(36).substring(2, 12),
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

// Email verification
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }
    
    // Verify the token with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });
    
    if (error) {
      console.error('Email verification error:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }
    
    // Update the user's verification status in the profiles table
    if (data && data.user) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', data.user.id);
      
      if (updateError) {
        console.error('Error updating verification status:', updateError);
      }
    }
    
    // Redirect to the frontend with a success message
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}?verified=true`);
    
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during email verification',
      error: error.message
    });
  }
};

// Resend verification email
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Check if user exists
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is already verified
    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }
    
    // Resend verification email through Supabase
    // Using standard auth API instead of admin API which may not be available in all plans
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: process.env.SITE_URL || 'http://localhost:8080?verified=true'
      }
    });
    
    if (resendError) {
      console.error('Error resending verification email:', resendError);
      return res.status(500).json({
        success: false,
        message: 'Failed to resend verification email: ' + resendError.message
      });
    }
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Verification email resent successfully'
    });
    
  } catch (error) {
    console.error('Error in resendVerification:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while resending verification email',
      error: error.message
    });
  }
};

// Forgot password - send reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Check if user exists
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }
    
    // Use the correct frontend URL with port 5001
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5001';
    
    // Send password reset email through Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${frontendUrl}/reset-password`
    });
    
    if (error) {
      console.error('Error sending password reset email:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email: ' + error.message
      });
    }
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });
    
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
      error: error.message
    });
  }
};

// Reset password with token
exports.resetPassword = async (req, res) => {
  try {
    const { password, refresh_token } = req.body;
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1] || null;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Authentication token is required'
      });
    }
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    console.log('Attempting to reset password with Supabase');
    
    // Update password through Supabase
    const { data, error } = await supabase.auth.updateUser({
      password: password
    }, {
      // Pass the access token for authentication
      auth: {
        persistSession: false,
        access_token: token,
        refresh_token: refresh_token
      }
    });
    
    if (error) {
      console.error('Error resetting password:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to reset password: ' + error.message
      });
    }
    
    console.log('Password reset successful:', data ? 'User data received' : 'No user data');
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });
    
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while resetting your password',
      error: error.message
    });
  }
}; 