const { supabase } = require('./index');
const bcrypt = require('bcryptjs');

class User {
  constructor(user) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.password = user.password;
    this.googleId = user.googleId || null;
    this.profilePicture = user.profilePicture || null;
    this.isVerified = user.isVerified || false;
  }

  // Create a new user
  static async create(newUser) {
    try {
      // Hash the password before storing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newUser.password, salt);

      // Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
          first_name: newUser.firstName,
          last_name: newUser.lastName
          },
          emailRedirectTo: process.env.SITE_URL || 'http://localhost:5001/auth/callback'
        }
      });

      if (authError) throw authError;

      console.log('Auth user created:', authUser.user);
      console.log('Creating profile with email:', authUser.user.email);
      
      // Add a small delay to ensure auth user is fully propagated in the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a profile object to inspect before insertion
      const profileData = {
          id: authUser.user.id,
          first_name: newUser.firstName,
          last_name: newUser.lastName,
        email: authUser.user.email,
          profile_picture: newUser.profilePicture,
        is_verified: newUser.isVerified
      };
      
      console.log('Profile data to insert:', profileData);

      try {
        // Try using upsert instead of insert as it might work differently with constraints
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' });
        
        if (upsertError) {
          console.error('Error upserting profile:', upsertError);
          
          // Fall back to standard insert as a last resort
          const { error: profileError } = await supabase
            .from('profiles')
            .insert(profileData);

          if (profileError) {
            console.error('Error inserting profile:', profileError);
            throw profileError;
          }
        }
      } catch (error) {
        console.error('Error in profile creation process:', error);
        throw error;
      }

      return { id: authUser.user.id, ...newUser, password: undefined };
    } catch (error) {
      throw error;
    }
  }

  // Find a user by email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // PGRST116 means no rows returned
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Find a user by Google ID
  static async findByGoogleId(googleId) {
    try {
      // Since google_id column doesn't exist in profiles table yet,
      // always return null for now
      console.log('Warning: findByGoogleId called but google_id column does not exist in profiles table');
      return null;
      
      // Original implementation - uncomment once google_id column is added
      /*
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('google_id', googleId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // PGRST116 means no rows returned
          return null;
        }
        throw error;
      }

      return data;
      */
    } catch (error) {
      throw error;
    }
  }

  // Find a user by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, created_at, profile_picture, is_verified')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // PGRST116 means no rows returned
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Check if the password matches using Supabase Auth
  static async comparePassword(plainPassword, email) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: plainPassword
      });
      
      return !error && data?.user !== null;
    } catch (error) {
      console.error('Error in comparePassword:', error);
      return false;
    }
  }

  // Update user role
  static async updateRole(userId, role) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Update student profile details
  static async updateStudentProfile(userId, studentDetails) {
    try {
      const { grade, subjects } = studentDetails;
      
      const { error } = await supabase
        .from('student_profiles')
        .upsert({
          user_id: userId,
          grade,
          subjects,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Update teacher profile details
  static async updateTeacherProfile(userId, teacherDetails) {
    try {
      const { school, subjects, grades } = teacherDetails;
      
      const { error } = await supabase
        .from('teacher_profiles')
        .upsert({
          user_id: userId,
          school,
          subjects,
          grades,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Link a Google account to an existing user account
  static async linkGoogleAccount(userId, googleId, profilePicture) {
    try {
      console.log(`Linking Google ID ${googleId} to user ${userId}`);
      
      // Note: we can't directly update user metadata without admin access
      // So we're just updating the profile picture if provided
      
      // Update the profile record
      const updateData = {
        // Add google_id when the column exists
        // google_id: googleId
      };
      
      // Only update profile picture if it doesn't already exist
      if (profilePicture) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('profile_picture')
          .eq('id', userId)
          .single();
          
        if (!profile?.profile_picture) {
          updateData.profile_picture = profilePicture;
        }
      }
      
      // If we have data to update, proceed with the update
      if (Object.keys(updateData).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', userId);
          
        if (profileError) throw profileError;
      }
      
      return true;
    } catch (error) {
      console.error('Error linking Google account:', error);
      throw error;
    }
  }
}

module.exports = User; 