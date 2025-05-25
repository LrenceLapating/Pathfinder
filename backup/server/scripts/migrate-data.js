/**
 * Data migration script to move data from MySQL to Supabase
 * Run this script after setting up your Supabase schema
 */
const { createClient } = require('@supabase/supabase-js');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// MySQL configuration
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pathfinder',
  port: process.env.DB_PORT || 3306
};

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Important: Use service role key for migrations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to verify table access
async function verifyTableAccess() {
  const requiredTables = [
    'profiles', 'courses', 'lessons', 'enrollments', 
    'progress', 'quizzes', 'quiz_questions', 'quiz_answers',
    'quiz_attempts', 'user_answers', 'certificates', 'notifications',
    'user_settings', 'student_profiles', 'teacher_profiles'
  ];
  
  let hasErrors = false;
  
  console.log('Verifying Supabase table access...');
  
  for (const tableName of requiredTables) {
    try {
      const { error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        console.error(`❌ Cannot access table '${tableName}':`, error.message);
        hasErrors = true;
      } else {
        console.log(`✅ Table '${tableName}' is accessible`);
      }
    } catch (error) {
      console.error(`❌ Error accessing table '${tableName}':`, error.message);
      hasErrors = true;
    }
  }
  
  if (hasErrors) {
    console.error('Table access verification failed. Please make sure all tables exist in Supabase.');
    return false;
  }
  
  console.log('All tables are accessible!');
  return true;
}

// Main migration function
async function migrateData() {
  // First, verify table access
  const tablesAccessible = await verifyTableAccess();
  if (!tablesAccessible) {
    console.error('Cannot proceed with migration due to table access issues.');
    process.exit(1);
  }

  // Create MySQL connection
  const mysqlConnection = await mysql.createConnection(mysqlConfig);
  console.log('Connected to MySQL database');

  try {
    // Step 1: Migrate users
    await migrateUsers(mysqlConnection);
    
    // Step 2: Migrate courses
    await migrateCourses(mysqlConnection);
    
    // Step 3: Migrate lessons
    await migrateLessons(mysqlConnection);
    
    // Step 4: Migrate enrollments
    await migrateEnrollments(mysqlConnection);
    
    // Step 5: Migrate progress
    await migrateProgress(mysqlConnection);
    
    // Step 6: Migrate quizzes and related tables
    await migrateQuizzes(mysqlConnection);
    
    // Step 7: Migrate certificates
    await migrateCertificates(mysqlConnection);
    
    // Step 8: Migrate notifications
    await migrateNotifications(mysqlConnection);
    
    // Step 9: Migrate user settings
    await migrateUserSettings(mysqlConnection);
    
    // Step 10: Migrate student profiles
    await migrateStudentProfiles(mysqlConnection);
    
    // Step 11: Migrate teacher profiles
    await migrateTeacherProfiles(mysqlConnection);
    
    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close MySQL connection
    await mysqlConnection.end();
    console.log('MySQL connection closed');
  }
}

// Function to migrate users
async function migrateUsers(mysqlConnection) {
  console.log('Migrating users...');
  
  // Get users from MySQL
  const [users] = await mysqlConnection.execute('SELECT * FROM users');
  
  // For each user:
  // 1. Create a Supabase auth user
  // 2. Create a profile record
  for (const user of users) {
    try {
      // Create auth user in Supabase
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password, // Note: You may need to set a temporary password as Supabase requires plaintext
        email_confirm: Boolean(user.is_verified), // Convert to boolean explicitly
        user_metadata: {
          first_name: user.first_name,
          last_name: user.last_name
        }
      });
      
      if (authError) throw authError;
      
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          profile_picture: user.profile_picture,
          is_verified: Boolean(user.is_verified), // Convert to boolean explicitly
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at
        });
        
      if (profileError) throw profileError;
      
      console.log(`✅ Migrated user: ${user.email}`);
    } catch (error) {
      console.error(`Error migrating user ${user.email}:`, error.message);
    }
  }
  
  console.log(`Migrated ${users.length} users`);
}

// Function to migrate courses
async function migrateCourses(mysqlConnection) {
  console.log('Migrating courses...');
  
  // Get courses from MySQL
  const [courses] = await mysqlConnection.execute('SELECT * FROM courses');
  
  // User ID mapping
  const userIdMap = await getUserIdMapping(mysqlConnection);
  
  // Course ID mapping to store for later use
  const courseIdMap = {};
  
  for (const course of courses) {
    try {
      // Get the new instructor ID from the mapping
      const newInstructorId = course.instructor_id ? userIdMap[course.instructor_id] : null;
      
      // Insert course into Supabase
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: course.title,
          description: course.description,
          image_url: course.image_url,
          instructor_id: newInstructorId,
          created_at: course.created_at,
          updated_at: course.updated_at
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      // Store the ID mapping
      courseIdMap[course.id] = data.id;
      
      console.log(`✅ Migrated course: ${course.title}`);
    } catch (error) {
      console.error(`Error migrating course ${course.title}:`, error.message);
    }
  }
  
  // Store the course ID mapping for later use
  global.courseIdMap = courseIdMap;
  
  console.log(`Migrated ${courses.length} courses`);
}

// Function to migrate lessons
async function migrateLessons(mysqlConnection) {
  console.log('Migrating lessons...');
  
  // Get lessons from MySQL
  const [lessons] = await mysqlConnection.execute('SELECT * FROM lessons');
  
  // Course ID mapping
  const courseIdMap = global.courseIdMap;
  
  // Lesson ID mapping to store for later use
  const lessonIdMap = {};
  
  for (const lesson of lessons) {
    try {
      // Get the new course ID from the mapping
      const newCourseId = courseIdMap[lesson.course_id];
      
      if (!newCourseId) {
        throw new Error(`No mapping found for course_id: ${lesson.course_id}`);
      }
      
      // Insert lesson into Supabase
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          course_id: newCourseId,
          title: lesson.title,
          content: lesson.content,
          video_url: lesson.video_url,
          position: lesson.position,
          created_at: lesson.created_at,
          updated_at: lesson.updated_at
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      // Store the ID mapping
      lessonIdMap[lesson.id] = data.id;
      
      console.log(`✅ Migrated lesson: ${lesson.title}`);
    } catch (error) {
      console.error(`Error migrating lesson ${lesson.title}:`, error.message);
    }
  }
  
  // Store the lesson ID mapping for later use
  global.lessonIdMap = lessonIdMap;
  
  console.log(`Migrated ${lessons.length} lessons`);
}

// Function to migrate enrollments
async function migrateEnrollments(mysqlConnection) {
  console.log('Migrating enrollments...');
  
  // Get enrollments from MySQL
  const [enrollments] = await mysqlConnection.execute('SELECT * FROM enrollments');
  
  // Get ID mappings
  const userIdMap = await getUserIdMapping(mysqlConnection);
  const courseIdMap = global.courseIdMap;
  
  for (const enrollment of enrollments) {
    try {
      // Get the new IDs from the mappings
      const newUserId = userIdMap[enrollment.user_id];
      const newCourseId = courseIdMap[enrollment.course_id];
      
      if (!newUserId || !newCourseId) {
        throw new Error(`Invalid mapping: user_id=${enrollment.user_id}, course_id=${enrollment.course_id}`);
      }
      
      // Insert enrollment into Supabase
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: newUserId,
          course_id: newCourseId,
          enrolled_at: enrollment.enrolled_at,
          completed: enrollment.completed,
          completion_date: enrollment.completion_date
        });
        
      if (error) throw error;
      
      console.log(`✅ Migrated enrollment: User ${enrollment.user_id} in Course ${enrollment.course_id}`);
    } catch (error) {
      console.error(`Error migrating enrollment:`, error.message);
    }
  }
  
  console.log(`Migrated ${enrollments.length} enrollments`);
}

// Helper function to get user ID mapping (MySQL ID to Supabase ID)
async function getUserIdMapping(mysqlConnection) {
  // Get all users from MySQL
  const [mysqlUsers] = await mysqlConnection.execute('SELECT id, email FROM users');
  
  // Get all profiles from Supabase
  const { data: supabaseProfiles, error } = await supabase
    .from('profiles')
    .select('id, email');
    
  if (error) throw error;
  
  // Create mapping of MySQL user ID to Supabase user ID
  const userIdMap = {};
  
  for (const mysqlUser of mysqlUsers) {
    const matchingProfile = supabaseProfiles.find(profile => profile.email === mysqlUser.email);
    if (matchingProfile) {
      userIdMap[mysqlUser.id] = matchingProfile.id;
    }
  }
  
  return userIdMap;
}

// Function to migrate progress
async function migrateProgress(mysqlConnection) {
  console.log('Migrating progress...');
  
  try {
    // Get progress from MySQL
    const [progressRecords] = await mysqlConnection.execute('SELECT * FROM progress');
    
    // Get ID mappings
    const userIdMap = await getUserIdMapping(mysqlConnection);
    const lessonIdMap = global.lessonIdMap || {};
    
    if (progressRecords.length === 0) {
      console.log('No progress records to migrate');
      return;
    }
    
    for (const progress of progressRecords) {
      try {
        // Get the new IDs from the mappings
        const newUserId = userIdMap[progress.user_id];
        const newLessonId = lessonIdMap[progress.lesson_id];
        
        if (!newUserId || !newLessonId) {
          throw new Error(`Invalid mapping: user_id=${progress.user_id}, lesson_id=${progress.lesson_id}`);
        }
        
        // Insert progress into Supabase
        const { error } = await supabase
          .from('progress')
          .insert({
            user_id: newUserId,
            lesson_id: newLessonId,
            completed: Boolean(progress.completed),
            last_accessed: progress.last_accessed
          });
          
        if (error) throw error;
        
        console.log(`✅ Migrated progress: User ${progress.user_id} in Lesson ${progress.lesson_id}`);
      } catch (error) {
        console.error(`Error migrating progress:`, error.message);
      }
    }
    
    console.log(`Migrated ${progressRecords.length} progress records`);
  } catch (error) {
    console.error('Error in migrateProgress:', error.message);
    // Continue with other migrations
  }
}

// Function to migrate quizzes and related tables
async function migrateQuizzes(mysqlConnection) {
  console.log('Migrating quizzes...');
  
  try {
    // Get quizzes from MySQL
    const [quizzes] = await mysqlConnection.execute('SELECT * FROM quizzes');
    
    // Lesson ID mapping
    const lessonIdMap = global.lessonIdMap || {};
    
    // Quiz ID mapping to store for later use
    const quizIdMap = {};
    
    if (quizzes.length === 0) {
      console.log('No quizzes to migrate');
      return;
    }
    
    for (const quiz of quizzes) {
      try {
        // Get the new lesson ID from the mapping
        const newLessonId = lessonIdMap[quiz.lesson_id];
        
        if (!newLessonId) {
          throw new Error(`No mapping found for lesson_id: ${quiz.lesson_id}`);
        }
        
        // Insert quiz into Supabase
        const { data, error } = await supabase
          .from('quizzes')
          .insert({
            lesson_id: newLessonId,
            title: quiz.title,
            description: quiz.description,
            created_at: quiz.created_at,
            updated_at: quiz.updated_at
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        // Store the ID mapping
        quizIdMap[quiz.id] = data.id;
        
        console.log(`✅ Migrated quiz: ${quiz.title}`);
      } catch (error) {
        console.error(`Error migrating quiz:`, error.message);
      }
    }
    
    // Store the quiz ID mapping for later use
    global.quizIdMap = quizIdMap;
    
    console.log(`Migrated ${quizzes.length} quizzes`);
    
    // Now migrate quiz questions, answers, attempts, and user answers
    await migrateQuizQuestions(mysqlConnection);
    await migrateQuizAttempts(mysqlConnection);
  } catch (error) {
    console.error('Error in migrateQuizzes:', error.message);
    // Continue with other migrations
  }
}

// Function to migrate quiz questions and answers
async function migrateQuizQuestions(mysqlConnection) {
  console.log('Migrating quiz questions...');
  
  try {
    // Get quiz questions from MySQL
    const [questions] = await mysqlConnection.execute('SELECT * FROM quiz_questions');
    
    // Quiz ID mapping
    const quizIdMap = global.quizIdMap || {};
    
    // Question ID mapping to store for later use
    const questionIdMap = {};
    
    if (questions.length === 0) {
      console.log('No quiz questions to migrate');
      return;
    }
    
    for (const question of questions) {
      try {
        // Get the new quiz ID from the mapping
        const newQuizId = quizIdMap[question.quiz_id];
        
        if (!newQuizId) {
          throw new Error(`No mapping found for quiz_id: ${question.quiz_id}`);
        }
        
        // Insert question into Supabase
        const { data, error } = await supabase
          .from('quiz_questions')
          .insert({
            quiz_id: newQuizId,
            question: question.question,
            question_type: question.question_type,
            position: question.position
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        // Store the ID mapping
        questionIdMap[question.id] = data.id;
        
        console.log(`✅ Migrated quiz question: ${question.question.substring(0, 30)}...`);
      } catch (error) {
        console.error(`Error migrating quiz question:`, error.message);
      }
    }
    
    // Store the question ID mapping for later use
    global.questionIdMap = questionIdMap;
    
    console.log(`Migrated ${questions.length} quiz questions`);
    
    // Now migrate quiz answers
    await migrateQuizAnswers(mysqlConnection);
  } catch (error) {
    console.error('Error in migrateQuizQuestions:', error.message);
    // Continue with other migrations
  }
}

// Function to migrate quiz answers
async function migrateQuizAnswers(mysqlConnection) {
  console.log('Migrating quiz answers...');
  
  try {
    // Get quiz answers from MySQL
    const [answers] = await mysqlConnection.execute('SELECT * FROM quiz_answers');
    
    // Question ID mapping
    const questionIdMap = global.questionIdMap || {};
    
    // Answer ID mapping to store for later use
    const answerIdMap = {};
    
    if (answers.length === 0) {
      console.log('No quiz answers to migrate');
      return;
    }
    
    for (const answer of answers) {
      try {
        // Get the new question ID from the mapping
        const newQuestionId = questionIdMap[answer.question_id];
        
        if (!newQuestionId) {
          throw new Error(`No mapping found for question_id: ${answer.question_id}`);
        }
        
        // Insert answer into Supabase
        const { data, error } = await supabase
          .from('quiz_answers')
          .insert({
            question_id: newQuestionId,
            answer_text: answer.answer_text,
            is_correct: Boolean(answer.is_correct)
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        // Store the ID mapping
        answerIdMap[answer.id] = data.id;
        
        console.log(`✅ Migrated quiz answer: ${answer.answer_text.substring(0, 30)}...`);
      } catch (error) {
        console.error(`Error migrating quiz answer:`, error.message);
      }
    }
    
    // Store the answer ID mapping for later use
    global.answerIdMap = answerIdMap;
    
    console.log(`Migrated ${answers.length} quiz answers`);
  } catch (error) {
    console.error('Error in migrateQuizAnswers:', error.message);
    // Continue with other migrations
  }
}

// Function to migrate quiz attempts
async function migrateQuizAttempts(mysqlConnection) {
  console.log('Migrating quiz attempts...');
  
  try {
    // Get quiz attempts from MySQL
    const [attempts] = await mysqlConnection.execute('SELECT * FROM quiz_attempts');
    
    // User and quiz ID mappings
    const userIdMap = await getUserIdMapping(mysqlConnection);
    const quizIdMap = global.quizIdMap || {};
    
    // Attempt ID mapping to store for later use
    const attemptIdMap = {};
    
    if (attempts.length === 0) {
      console.log('No quiz attempts to migrate');
      return;
    }
    
    for (const attempt of attempts) {
      try {
        // Get the new IDs from the mappings
        const newUserId = userIdMap[attempt.user_id];
        const newQuizId = quizIdMap[attempt.quiz_id];
        
        if (!newUserId || !newQuizId) {
          throw new Error(`Invalid mapping: user_id=${attempt.user_id}, quiz_id=${attempt.quiz_id}`);
        }
        
        // Insert attempt into Supabase
        const { data, error } = await supabase
          .from('quiz_attempts')
          .insert({
            user_id: newUserId,
            quiz_id: newQuizId,
            score: attempt.score,
            started_at: attempt.started_at,
            completed_at: attempt.completed_at
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        // Store the ID mapping
        attemptIdMap[attempt.id] = data.id;
        
        console.log(`✅ Migrated quiz attempt: User ${attempt.user_id} in Quiz ${attempt.quiz_id}`);
      } catch (error) {
        console.error(`Error migrating quiz attempt:`, error.message);
      }
    }
    
    // Store the attempt ID mapping for later use
    global.attemptIdMap = attemptIdMap;
    
    console.log(`Migrated ${attempts.length} quiz attempts`);
    
    // Now migrate user answers
    await migrateUserAnswers(mysqlConnection);
  } catch (error) {
    console.error('Error in migrateQuizAttempts:', error.message);
    // Continue with other migrations
  }
}

// Function to migrate user answers
async function migrateUserAnswers(mysqlConnection) {
  console.log('Migrating user answers...');
  
  try {
    // Get user answers from MySQL
    const [userAnswers] = await mysqlConnection.execute('SELECT * FROM user_answers');
    
    // ID mappings
    const attemptIdMap = global.attemptIdMap || {};
    const questionIdMap = global.questionIdMap || {};
    const answerIdMap = global.answerIdMap || {};
    
    if (userAnswers.length === 0) {
      console.log('No user answers to migrate');
      return;
    }
    
    for (const userAnswer of userAnswers) {
      try {
        // Get the new IDs from the mappings
        const newAttemptId = attemptIdMap[userAnswer.attempt_id];
        const newQuestionId = questionIdMap[userAnswer.question_id];
        const newAnswerId = userAnswer.answer_id ? answerIdMap[userAnswer.answer_id] : null;
        
        if (!newAttemptId || !newQuestionId) {
          throw new Error(`Invalid mapping: attempt_id=${userAnswer.attempt_id}, question_id=${userAnswer.question_id}`);
        }
        
        // Insert user answer into Supabase
        const { error } = await supabase
          .from('user_answers')
          .insert({
            attempt_id: newAttemptId,
            question_id: newQuestionId,
            answer_id: newAnswerId,
            text_answer: userAnswer.text_answer,
            is_correct: Boolean(userAnswer.is_correct)
          });
          
        if (error) throw error;
        
        console.log(`✅ Migrated user answer: ${userAnswer.id}`);
      } catch (error) {
        console.error(`Error migrating user answer:`, error.message);
      }
    }
    
    console.log(`Migrated ${userAnswers.length} user answers`);
  } catch (error) {
    console.error('Error in migrateUserAnswers:', error.message);
    // Continue with other migrations
  }
}

// Function to migrate certificates
async function migrateCertificates(mysqlConnection) {
  console.log('Migrating certificates...');
  
  try {
    // Get certificates from MySQL
    const [certificates] = await mysqlConnection.execute('SELECT * FROM certificates');
    
    // ID mappings
    const userIdMap = await getUserIdMapping(mysqlConnection);
    const courseIdMap = global.courseIdMap || {};
    
    if (certificates.length === 0) {
      console.log('No certificates to migrate');
      return;
    }
    
    for (const certificate of certificates) {
      try {
        // Get the new IDs from the mappings
        const newUserId = userIdMap[certificate.user_id];
        const newCourseId = courseIdMap[certificate.course_id];
        
        if (!newUserId || !newCourseId) {
          throw new Error(`Invalid mapping: user_id=${certificate.user_id}, course_id=${certificate.course_id}`);
        }
        
        // Insert certificate into Supabase
        const { error } = await supabase
          .from('certificates')
          .insert({
            user_id: newUserId,
            course_id: newCourseId,
            issued_date: certificate.issued_date,
            certificate_url: certificate.certificate_url
          });
          
        if (error) throw error;
        
        console.log(`✅ Migrated certificate: User ${certificate.user_id} for Course ${certificate.course_id}`);
      } catch (error) {
        console.error(`Error migrating certificate:`, error.message);
      }
    }
    
    console.log(`Migrated ${certificates.length} certificates`);
  } catch (error) {
    console.error('Error in migrateCertificates:', error.message);
    // Continue with other migrations
  }
}

// Function to migrate notifications
async function migrateNotifications(mysqlConnection) {
  console.log('Migrating notifications...');
  
  try {
    // Get notifications from MySQL
    const [notifications] = await mysqlConnection.execute('SELECT * FROM notifications');
    
    // User ID mapping
    const userIdMap = await getUserIdMapping(mysqlConnection);
    
    if (notifications.length === 0) {
      console.log('No notifications to migrate');
      return;
    }
    
    for (const notification of notifications) {
      try {
        // Get the new user ID from the mapping
        const newUserId = userIdMap[notification.user_id];
        
        if (!newUserId) {
          throw new Error(`No mapping found for user_id: ${notification.user_id}`);
        }
        
        // Insert notification into Supabase
        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: newUserId,
            title: notification.title,
            message: notification.message,
            is_read: Boolean(notification.is_read),
            created_at: notification.created_at
          });
          
        if (error) throw error;
        
        console.log(`✅ Migrated notification: ${notification.title}`);
      } catch (error) {
        console.error(`Error migrating notification:`, error.message);
      }
    }
    
    console.log(`Migrated ${notifications.length} notifications`);
  } catch (error) {
    console.error('Error in migrateNotifications:', error.message);
    // Continue with other migrations
  }
}

// Function to migrate user settings
async function migrateUserSettings(mysqlConnection) {
  console.log('Migrating user settings...');
  
  try {
    // Get user settings from MySQL
    const [settings] = await mysqlConnection.execute('SELECT * FROM user_settings');
    
    // User ID mapping
    const userIdMap = await getUserIdMapping(mysqlConnection);
    
    if (settings.length === 0) {
      console.log('No user settings to migrate');
      return;
    }
    
    for (const setting of settings) {
      try {
        // Get the new user ID from the mapping
        const newUserId = userIdMap[setting.user_id];
        
        if (!newUserId) {
          throw new Error(`No mapping found for user_id: ${setting.user_id}`);
        }
        
        // Insert user setting into Supabase
        const { error } = await supabase
          .from('user_settings')
          .insert({
            user_id: newUserId,
            email_notifications: Boolean(setting.email_notifications),
            theme: setting.theme,
            language: setting.language
          });
          
        if (error) throw error;
        
        console.log(`✅ Migrated user setting: User ${setting.user_id}`);
      } catch (error) {
        console.error(`Error migrating user setting:`, error.message);
      }
    }
    
    console.log(`Migrated ${settings.length} user settings`);
  } catch (error) {
    console.error('Error in migrateUserSettings:', error.message);
    // Continue with other migrations
  }
}

// Function to migrate student profiles
async function migrateStudentProfiles(mysqlConnection) {
  console.log('Migrating student profiles...');
  
  try {
    // Get student profiles from MySQL
    const [profiles] = await mysqlConnection.execute('SELECT * FROM student_profiles');
    
    // User ID mapping
    const userIdMap = await getUserIdMapping(mysqlConnection);
    
    if (profiles.length === 0) {
      console.log('No student profiles to migrate');
      return;
    }
    
    for (const profile of profiles) {
      try {
        // Get the new user ID from the mapping
        const newUserId = userIdMap[profile.user_id];
        
        if (!newUserId) {
          throw new Error(`No mapping found for user_id: ${profile.user_id}`);
        }
        
        // Parse subjects from JSON string if needed
        let subjects = profile.subjects;
        if (typeof subjects === 'string') {
          try {
            subjects = JSON.parse(subjects);
          } catch (e) {
            console.warn(`Could not parse subjects JSON for user ${profile.user_id}:`, e.message);
          }
        }
        
        // Insert student profile into Supabase
        const { error } = await supabase
          .from('student_profiles')
          .insert({
            user_id: newUserId,
            grade: profile.grade,
            subjects: subjects,
            created_at: profile.created_at,
            updated_at: profile.updated_at
          });
          
        if (error) throw error;
        
        console.log(`✅ Migrated student profile: User ${profile.user_id}`);
      } catch (error) {
        console.error(`Error migrating student profile:`, error.message);
      }
    }
    
    console.log(`Migrated ${profiles.length} student profiles`);
  } catch (error) {
    console.error('Error in migrateStudentProfiles:', error.message);
    // Continue with other migrations
  }
}

// Function to migrate teacher profiles
async function migrateTeacherProfiles(mysqlConnection) {
  console.log('Migrating teacher profiles...');
  
  try {
    // Get teacher profiles from MySQL
    const [profiles] = await mysqlConnection.execute('SELECT * FROM teacher_profiles');
    
    // User ID mapping
    const userIdMap = await getUserIdMapping(mysqlConnection);
    
    if (profiles.length === 0) {
      console.log('No teacher profiles to migrate');
      return;
    }
    
    for (const profile of profiles) {
      try {
        // Get the new user ID from the mapping
        const newUserId = userIdMap[profile.user_id];
        
        if (!newUserId) {
          throw new Error(`No mapping found for user_id: ${profile.user_id}`);
        }
        
        // Parse subjects and grades from JSON strings if needed
        let subjects = profile.subjects;
        let grades = profile.grades;
        
        if (typeof subjects === 'string') {
          try {
            subjects = JSON.parse(subjects);
          } catch (e) {
            console.warn(`Could not parse subjects JSON for user ${profile.user_id}:`, e.message);
          }
        }
        
        if (typeof grades === 'string') {
          try {
            grades = JSON.parse(grades);
          } catch (e) {
            console.warn(`Could not parse grades JSON for user ${profile.user_id}:`, e.message);
          }
        }
        
        // Insert teacher profile into Supabase
        const { error } = await supabase
          .from('teacher_profiles')
          .insert({
            user_id: newUserId,
            school: profile.school,
            subjects: subjects,
            grades: grades,
            created_at: profile.created_at,
            updated_at: profile.updated_at
          });
          
        if (error) throw error;
        
        console.log(`✅ Migrated teacher profile: User ${profile.user_id}`);
      } catch (error) {
        console.error(`Error migrating teacher profile:`, error.message);
      }
    }
    
    console.log(`Migrated ${profiles.length} teacher profiles`);
  } catch (error) {
    console.error('Error in migrateTeacherProfiles:', error.message);
    // Continue with other migrations
  }
}

// Run the migration
migrateData().catch(error => {
  console.error('Migration script error:', error);
  process.exit(1);
}); 