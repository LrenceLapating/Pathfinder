const { pool } = require('./index');
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

      const [result] = await pool.execute(
        `INSERT INTO users (first_name, last_name, email, password, google_id, profile_picture, is_verified) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          newUser.firstName,
          newUser.lastName,
          newUser.email,
          hashedPassword,
          newUser.googleId,
          newUser.profilePicture,
          newUser.isVerified
        ]
      );

      return { id: result.insertId, ...newUser, password: undefined };
    } catch (error) {
      throw error;
    }
  }

  // Find a user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find a user by Google ID
  static async findByGoogleId(googleId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE google_id = ?',
        [googleId]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find a user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, first_name, last_name, email, created_at, profile_picture, is_verified FROM users WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Check if the password matches
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user role
  static async updateRole(userId, role) {
    try {
      await pool.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, userId]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Update student profile details
  static async updateStudentProfile(userId, studentDetails) {
    try {
      const { grade, subjects } = studentDetails;
      
      // Convert subjects array to JSON string
      const subjectsJson = JSON.stringify(subjects);
      
      await pool.execute(
        'INSERT INTO student_profiles (user_id, grade, subjects) VALUES (?, ?, ?) ' +
        'ON DUPLICATE KEY UPDATE grade = ?, subjects = ?',
        [userId, grade, subjectsJson, grade, subjectsJson]
      );
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Update teacher profile details
  static async updateTeacherProfile(userId, teacherDetails) {
    try {
      const { school, subjects, grades } = teacherDetails;
      
      // Convert arrays to JSON strings
      const subjectsJson = JSON.stringify(subjects);
      const gradesJson = JSON.stringify(grades);
      
      await pool.execute(
        'INSERT INTO teacher_profiles (user_id, school, subjects, grades) VALUES (?, ?, ?, ?) ' +
        'ON DUPLICATE KEY UPDATE school = ?, subjects = ?, grades = ?',
        [userId, school, subjectsJson, gradesJson, school, subjectsJson, gradesJson]
      );
      
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User; 