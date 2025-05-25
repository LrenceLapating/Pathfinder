const { createClient } = require('@supabase/supabase-js');
const supabaseConfig = require('../config/supabase.config');

// Create a Supabase client
const supabase = createClient(
  supabaseConfig.SUPABASE_URL,
  supabaseConfig.SUPABASE_KEY
);

// Test the connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) throw error;
    
    console.log('Supabase connection established successfully!');
    return true;
  } catch (error) {
    console.error('Error connecting to Supabase:', error.message);
    return false;
  }
}

// Initialize the database by ensuring necessary tables exist
async function initializeDatabase() {
  try {
    // Verify that key tables exist
    const { data: tables, error } = await supabase
      .rpc('get_tables', { schema_name: supabaseConfig.SCHEMA });
      
    if (error) throw error;
    
    const requiredTables = [
      'profiles', 'courses', 'lessons', 'enrollments', 
      'progress', 'quizzes', 'quiz_questions', 'quiz_answers'
    ];
    
    const existingTables = tables.map(table => table.table_name);
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.warn('Missing required tables:', missingTables.join(', '));
      console.warn('Please run the migration script to create all required tables.');
    } else {
      console.log('All required tables exist in the database.');
    }
    
    console.log('Database initialization completed!');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    throw error;
  }
}

module.exports = {
  supabase,
  testConnection,
  initializeDatabase
}; 