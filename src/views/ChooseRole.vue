<template>
  <div class="choose-role-container">
    <div class="choose-role-card">
      <h1 class="title">Complete Your Profile</h1>
      <p class="subtitle">Tell us more about yourself to personalize your experience</p>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="saveProfile">
        <div class="form-section">
          <h2>Choose Your Role</h2>
          <div class="role-options">
            <div 
              class="role-option" 
              :class="{ 'selected': selectedRole === 'student' }"
              @click="selectedRole = 'student'"
            >
              <div class="role-icon">👨‍🎓</div>
              <h3>Student</h3>
              <p>Access learning materials, take quizzes, and track your progress</p>
            </div>
            
            <div 
              class="role-option" 
              :class="{ 'selected': selectedRole === 'teacher' }"
              @click="selectedRole = 'teacher'"
            >
              <div class="role-icon">👩‍🏫</div>
              <h3>Teacher</h3>
              <p>View student progress and manage your classroom dashboard</p>
            </div>
          </div>
        </div>
        
        <!-- Student-specific fields -->
        <div v-if="selectedRole === 'student'" class="form-section">
          <h2>Student Details</h2>
          <div class="form-group">
            <label for="grade">Grade Level</label>
            <select id="grade" v-model="studentDetails.grade" class="form-input" required>
              <option value="">Select Grade Level</option>
              <option v-for="grade in grades" :key="grade" :value="grade">{{ grade }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="subjects">Subjects of Interest</label>
            <div class="checkbox-group">
              <label v-for="subject in subjects" :key="subject" class="checkbox-label">
                <input 
                  type="checkbox" 
                  :value="subject" 
                  v-model="studentDetails.subjects"
                >
                {{ subject }}
              </label>
            </div>
          </div>
        </div>
        
        <!-- Teacher-specific fields -->
        <div v-if="selectedRole === 'teacher'" class="form-section">
          <h2>Teacher Details</h2>
          <div class="form-group">
            <label for="school">School/Institution</label>
            <input 
              type="text" 
              id="school" 
              v-model="teacherDetails.school" 
              class="form-input" 
              required
              placeholder="Enter your school or institution name"
            >
          </div>
          
          <div class="form-group">
            <label for="subjects">Subjects You Teach</label>
            <div class="checkbox-group">
              <label v-for="subject in subjects" :key="subject" class="checkbox-label">
                <input 
                  type="checkbox" 
                  :value="subject" 
                  v-model="teacherDetails.subjects"
                >
                {{ subject }}
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label for="grades">Grades You Teach</label>
            <div class="checkbox-group">
              <label v-for="grade in grades" :key="grade" class="checkbox-label">
                <input 
                  type="checkbox" 
                  :value="grade" 
                  v-model="teacherDetails.grades"
                >
                {{ grade }}
              </label>
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          class="submit-button" 
          :disabled="loading || !selectedRole"
        >
          <span v-if="loading" class="loader"></span>
          <span v-else>
            Complete Profile
            <span class="btn-arrow">→</span>
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChooseRole',
  data() {
    return {
      selectedRole: '',
      loading: false,
      errorMessage: '',
      studentDetails: {
        grade: '',
        subjects: []
      },
      teacherDetails: {
        school: '',
        subjects: [],
        grades: []
      },
      grades: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      subjects: ['Math', 'Science', 'English', 'History', 'Art', 'Music', 'Physical Education', 'Computer Science']
    }
  },
  created() {
    // Check if user is authenticated
    const token = localStorage.getItem('pathfinder_token');
    if (!token) {
      // Redirect to home if not authenticated
      this.$router.push('/');
    }
  },
  methods: {
    async saveProfile() {
      try {
        this.loading = true;
        this.errorMessage = '';
        
        if (!this.selectedRole) {
          this.errorMessage = 'Please select a role';
          return;
        }
        
        const token = localStorage.getItem('pathfinder_token');
        if (!token) {
          this.$router.push('/');
          return;
        }
        
        // Get the current user data from localStorage
        const userData = JSON.parse(localStorage.getItem('pathfinder_user') || '{}');
        
        // Prepare the data to send based on selected role
        const profileData = {
          role: this.selectedRole,
          ...(this.selectedRole === 'student' ? { studentDetails: this.studentDetails } : {}),
          ...(this.selectedRole === 'teacher' ? { teacherDetails: this.teacherDetails } : {})
        };
        
        // Send profile data to backend
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to save profile');
        }
        
        // Update user data in localStorage with the new role
        userData.role = this.selectedRole;
        localStorage.setItem('pathfinder_user', JSON.stringify(userData));
        
        // Store user role in localStorage
        localStorage.setItem('pathfinder_user_role', this.selectedRole);
        
        // Redirect based on role
        if (this.selectedRole === 'student') {
          this.$router.push('/student');
        } else if (this.selectedRole === 'teacher') {
          this.$router.push('/teacher');
        }
        
      } catch (error) {
        this.errorMessage = error.message || 'An error occurred';
        console.error('Profile setup error:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.choose-role-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.choose-role-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 800px;
}

.title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
}

.form-section {
  margin-bottom: 30px;
}

.form-section h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

.role-options {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.role-option {
  flex: 1;
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.role-option:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.role-option.selected {
  border-color: #4361ee;
  background-color: rgba(67, 97, 238, 0.05);
}

.role-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.role-option h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #333;
}

.role-option p {
  color: #666;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #4361ee;
  outline: none;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.checkbox-label {
  display: inline-flex;
  align-items: center;
  margin-right: 15px;
  margin-bottom: 10px;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 6px;
}

.submit-button {
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 14px 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
}

.submit-button:hover {
  background-color: #3a56d4;
}

.submit-button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.btn-arrow {
  margin-left: 8px;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .role-options {
    flex-direction: column;
  }
  
  .choose-role-card {
    padding: 25px;
  }
  
  .title {
    font-size: 2rem;
  }
}
</style> 