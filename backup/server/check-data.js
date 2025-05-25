/**
 * Script to check data in Supabase
 */
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_KEY in .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to check data in Supabase
async function checkData() {
  try {
    console.log('Checking data in Supabase...');
    
    // Check profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
      
    if (profilesError) throw profilesError;
    console.log(`Found ${profiles?.length || 0} profiles`);
    if (profiles && profiles.length > 0) {
      console.log('Sample profile:', {
        id: profiles[0].id,
        email: profiles[0].email,
        first_name: profiles[0].first_name,
        last_name: profiles[0].last_name
      });
    }
    
    // Check courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*');
      
    if (coursesError) throw coursesError;
    console.log(`Found ${courses?.length || 0} courses`);
    
    // Check other tables
    const tables = [
      'lessons', 'enrollments', 'progress', 'quizzes', 
      'quiz_questions', 'quiz_answers', 'quiz_attempts', 'user_answers',
      'certificates', 'notifications', 'user_settings',
      'student_profiles', 'teacher_profiles'
    ];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true });
          
        if (error) {
          console.error(`Error checking ${table}:`, error.message);
        } else {
          console.log(`Table ${table}: ${data?.count || 0} records`);
        }
      } catch (err) {
        console.error(`Error checking ${table}:`, err.message);
      }
    }
    
    console.log('Data check completed!');
  } catch (error) {
    console.error('Error checking data:', error);
  }
}

// Run the data check
checkData(); 