/**
 * Migration script to verify Supabase tables
 */
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Important: Use service role key for migrations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to verify tables in Supabase
async function verifyTables() {
  try {
    console.log('Starting migration to Supabase...');
    console.log('Verifying existing tables...');

    // List of required tables
    const requiredTables = [
      'profiles', 'courses', 'lessons', 'enrollments', 
      'progress', 'quizzes', 'quiz_questions', 'quiz_answers',
      'quiz_attempts', 'user_answers', 'certificates', 'notifications',
      'user_settings', 'student_profiles', 'teacher_profiles'
    ];
    
    // Check each table
    for (const tableName of requiredTables) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
          
        if (error) {
          console.log(`❌ Table '${tableName}' verification failed:`, error.message);
        } else {
          console.log(`✅ Table '${tableName}' exists`);
        }
      } catch (err) {
        console.log(`❌ Table '${tableName}' verification failed:`, err.message);
      }
    }
    
    console.log('Migration/verification completed!');
    console.log('You can now proceed with data migration using: node server/scripts/migrate-data.js');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

// Execute the verification
verifyTables(); 