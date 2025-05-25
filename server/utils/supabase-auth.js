/**
 * Supabase authentication utilities
 */
const jwt = require('jsonwebtoken');
const { supabase } = require('../models');

/**
 * Get a Supabase authentication token for the client
 * This creates a session using the service role key (server-side only)
 * and returns a token the client can use
 */
async function getSupabaseToken(userId) {
  try {
    // This uses the admin API to create a session
    const { data, error } = await supabase.auth.admin.createSession({
      user_id: userId
    });
    
    if (error) throw error;
    
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at
    };
  } catch (error) {
    console.error('Error generating Supabase token:', error);
    throw error;
  }
}

/**
 * Create a JWT that includes Supabase session info
 * This allows the front end to get both our custom JWT and Supabase tokens
 */
async function createAuthToken(user) {
  try {
    // Get Supabase tokens
    const supabaseTokens = await getSupabaseToken(user.id);
    
    // Create JWT payload with user info and Supabase tokens
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role || 'user',
      supabase: supabaseTokens
    };
    
    // Sign the JWT
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );
    
    return token;
  } catch (error) {
    console.error('Error creating auth token:', error);
    throw error;
  }
}

module.exports = {
  getSupabaseToken,
  createAuthToken
}; 