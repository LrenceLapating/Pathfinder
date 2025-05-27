<template>
  <div class="score-upload">
    <div class="page-header">
      <h1>Upload Quiz/Exam Scores</h1>
    </div>
    
    <div class="upload-card">
      <div class="selection-steps">
        <div class="step" :class="{ 'active': currentStep >= 1, 'complete': currentStep > 1 }">
          <div class="step-number">1</div>
          <div class="step-label">Select Classroom</div>
        </div>
        <div class="step-connector"></div>
        <div class="step" :class="{ 'active': currentStep >= 2, 'complete': currentStep > 2 }">
          <div class="step-number">2</div>
          <div class="step-label">Select Student</div>
        </div>
        <div class="step-connector"></div>
        <div class="step" :class="{ 'active': currentStep >= 3, 'complete': currentStep > 3 }">
          <div class="step-number">3</div>
          <div class="step-label">Enter Score</div>
        </div>
      </div>
      
      <!-- Step 1: Classroom Selection -->
      <div v-if="currentStep === 1" class="step-content">
        <h2>Select a Classroom</h2>
        <div class="classroom-grid">
          <div 
            v-for="classroom in classrooms" 
            :key="classroom.id" 
            class="classroom-card"
            :class="{ 'selected': selectedClassroom === classroom.id }"
            @click="selectClassroom(classroom.id)"
          >
            <div class="classroom-name">{{ classroom.subject }}</div>
            <div class="classroom-info">
              <span>
                <i class="fas fa-users"></i> {{ classroom.students }} students
              </span>
              <span>
                <i class="fas fa-key"></i> {{ classroom.code }}
              </span>
            </div>
          </div>
        </div>
        <div class="step-actions">
          <button 
            class="btn-primary" 
            :disabled="!selectedClassroom" 
            @click="goToNextStep"
          >
            Next <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
      
      <!-- Step 2: Student Selection -->
      <div v-else-if="currentStep === 2" class="step-content">
        <h2>Select a Student</h2>
        <div class="search-container">
          <div class="search-input">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="studentSearch" 
              placeholder="Search students..." 
            />
          </div>
        </div>
        
        <div class="student-list">
          <div 
            v-for="student in filteredStudents" 
            :key="student.id" 
            class="student-item"
            :class="{ 'selected': selectedStudent === student.id }"
            @click="selectStudent(student.id)"
          >
            <div class="student-avatar">{{ getInitials(student.name) }}</div>
            <div class="student-info">
              <div class="student-name">{{ student.name }}</div>
              <div class="student-email">{{ student.email }}</div>
            </div>
            <div v-if="selectedStudent === student.id" class="selected-check">
              <i class="fas fa-check"></i>
            </div>
          </div>
        </div>
        
        <div class="step-actions">
          <button class="btn-secondary" @click="goToPreviousStep">
            <i class="fas fa-arrow-left"></i> Back
          </button>
          <button 
            class="btn-primary" 
            :disabled="!selectedStudent" 
            @click="goToNextStep"
          >
            Next <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
      
      <!-- Step 3: Score Entry -->
      <div v-else-if="currentStep === 3" class="step-content">
        <h2>Enter Score Details</h2>
        
        <div class="form-container">
          <div class="form-group">
            <label for="score-topic">Topic</label>
            <select id="score-topic" v-model="scoreDetails.topic">
              <option value="" disabled>Select a topic</option>
              <option v-for="topic in availableTopics" :key="topic" :value="topic">
                {{ topic }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="score-type">Type</label>
            <select id="score-type" v-model="scoreDetails.type">
              <option value="" disabled>Select type</option>
              <option value="Quiz">Quiz</option>
              <option value="Exam">Exam</option>
              <option value="Assignment">Assignment</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="score-value">Score (out of 100)</label>
            <input 
              type="number" 
              id="score-value" 
              v-model="scoreDetails.score" 
              min="0" 
              max="100" 
              placeholder="Enter score (0-100)"
            />
          </div>
          
          <div class="form-group">
            <label for="score-feedback">Feedback (optional)</label>
            <textarea 
              id="score-feedback" 
              v-model="scoreDetails.feedback" 
              rows="4" 
              placeholder="Enter feedback for the student..."
            ></textarea>
          </div>
        </div>
        
        <div class="warning-message" v-if="scoreDetails.score < 60">
          <i class="fas fa-exclamation-triangle"></i>
          <span>
            Low score detected. Submitting this score will trigger study guide recommendations
            for this student.
          </span>
        </div>
        
        <div class="step-actions">
          <button class="btn-secondary" @click="goToPreviousStep">
            <i class="fas fa-arrow-left"></i> Back
          </button>
          <button 
            class="btn-primary" 
            :disabled="!isScoreFormValid" 
            @click="submitScore"
          >
            Submit Score
          </button>
        </div>
      </div>
      
      <!-- Success Step -->
      <div v-else-if="currentStep === 4" class="step-content success-step">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>Score Uploaded Successfully</h2>
        <p>
          The score has been recorded and the student's mastery level has been updated.
          <span v-if="scoreDetails.score < 60">
            A study guide recommendation has been triggered for the student.
          </span>
        </p>
        <div class="uploaded-details">
          <div class="detail-item">
            <strong>Student:</strong> {{ selectedStudentName }}
          </div>
          <div class="detail-item">
            <strong>Topic:</strong> {{ scoreDetails.topic }}
          </div>
          <div class="detail-item">
            <strong>Type:</strong> {{ scoreDetails.type }}
          </div>
          <div class="detail-item">
            <strong>Score:</strong> {{ scoreDetails.score }}/100
          </div>
        </div>
        <div class="step-actions">
          <button class="btn-secondary" @click="resetForm">
            Upload Another Score
          </button>
          <button class="btn-primary" @click="viewStudent">
            View Student Profile
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScoreUpload',
  
  data() {
    return {
      currentStep: 1,
      selectedClassroom: null,
      selectedStudent: null,
      studentSearch: '',
      scoreDetails: {
        topic: '',
        type: '',
        score: '',
        feedback: ''
      },
      classrooms: [
        {
          id: 1,
          subject: 'Mathematics 101',
          code: 'MATH101',
          students: 25
        },
        {
          id: 2,
          subject: 'Physics Advanced',
          code: 'PHYS202',
          students: 22
        },
        {
          id: 3,
          subject: 'Chemistry Basics',
          code: 'CHEM100',
          students: 18
        }
      ],
      students: [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@example.com',
          classroomId: 1,
          topics: ['Algebra', 'Geometry', 'Calculus', 'Statistics']
        },
        {
          id: 2,
          name: 'Emily Johnson',
          email: 'emily.j@example.com',
          classroomId: 1,
          topics: ['Algebra', 'Geometry', 'Calculus', 'Statistics']
        },
        {
          id: 3,
          name: 'Michael Brown',
          email: 'michael.b@example.com',
          classroomId: 1,
          topics: ['Algebra', 'Geometry', 'Calculus', 'Statistics']
        },
        {
          id: 4,
          name: 'Sarah Wilson',
          email: 'sarah.w@example.com',
          classroomId: 2,
          topics: ['Mechanics', 'Thermodynamics', 'Electricity', 'Optics']
        },
        {
          id: 5,
          name: 'David Lee',
          email: 'david.lee@example.com',
          classroomId: 2,
          topics: ['Mechanics', 'Thermodynamics', 'Electricity', 'Optics']
        },
        {
          id: 6,
          name: 'Jessica Taylor',
          email: 'jessica.t@example.com',
          classroomId: 3,
          topics: ['Periodic Table', 'Chemical Bonds', 'Organic Chemistry', 'Acids and Bases']
        }
      ]
    };
  },
  
  computed: {
    filteredStudents() {
      if (!this.selectedClassroom) return [];
      
      const classroomStudents = this.students.filter(
        student => student.classroomId === this.selectedClassroom
      );
      
      if (!this.studentSearch) return classroomStudents;
      
      const search = this.studentSearch.toLowerCase();
      return classroomStudents.filter(
        student => 
          student.name.toLowerCase().includes(search) || 
          student.email.toLowerCase().includes(search)
      );
    },
    
    availableTopics() {
      if (!this.selectedStudent) return [];
      
      const student = this.students.find(s => s.id === this.selectedStudent);
      return student ? student.topics : [];
    },
    
    isScoreFormValid() {
      return (
        this.scoreDetails.topic && 
        this.scoreDetails.type && 
        this.scoreDetails.score !== '' && 
        this.scoreDetails.score >= 0 && 
        this.scoreDetails.score <= 100
      );
    },
    
    selectedStudentName() {
      if (!this.selectedStudent) return '';
      
      const student = this.students.find(s => s.id === this.selectedStudent);
      return student ? student.name : '';
    }
  },
  
  methods: {
    selectClassroom(classroomId) {
      this.selectedClassroom = classroomId;
    },
    
    selectStudent(studentId) {
      this.selectedStudent = studentId;
    },
    
    goToNextStep() {
      this.currentStep++;
    },
    
    goToPreviousStep() {
      this.currentStep--;
    },
    
    getInitials(name) {
      return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase();
    },
    
    submitScore() {
      // In a real application, this would make an API call to save the score
      console.log('Submitting score:', {
        classroomId: this.selectedClassroom,
        studentId: this.selectedStudent,
        ...this.scoreDetails
      });
      
      // Move to success step
      this.currentStep = 4;
    },
    
    resetForm() {
      this.currentStep = 1;
      this.selectedClassroom = null;
      this.selectedStudent = null;
      this.studentSearch = '';
      this.scoreDetails = {
        topic: '',
        type: '',
        score: '',
        feedback: ''
      };
    },
    
    viewStudent() {
      // In a real application, this would navigate to the student's profile
      this.$router.push('/teacher/performance');
    }
  }
};
</script>

<style scoped>
.score-upload {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  position: relative;
}

.page-header h1:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 40px;
  height: 3px;
  background: #C84C1C;
  border-radius: 2px;
}

.upload-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
  margin-bottom: 30px;
}

.selection-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 10px;
  border: 2px solid #f3f4f6;
}

.step.active .step-number {
  background-color: #3b7ddd;
  color: white;
  border-color: #3b7ddd;
}

.step.complete .step-number {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
}

.step-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.step.active .step-label {
  color: #3b7ddd;
  font-weight: 600;
}

.step.complete .step-label {
  color: #10b981;
  font-weight: 600;
}

.step-connector {
  flex: 1;
  height: 2px;
  background-color: #f3f4f6;
  margin: 0 10px;
  position: relative;
  top: -10px;
}

.step-content {
  max-width: 800px;
  margin: 0 auto;
}

.step-content h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.classroom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.classroom-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.classroom-card:hover {
  border-color: #3b7ddd;
  box-shadow: 0 2px 8px rgba(59, 125, 221, 0.2);
}

.classroom-card.selected {
  border-color: #3b7ddd;
  background-color: rgba(59, 125, 221, 0.05);
}

.classroom-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.classroom-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #3b7ddd;
  color: white;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #6b7280;
}

.btn-primary:hover {
  background-color: #3366cc;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 0 12px;
}

.search-input i {
  color: #6b7280;
  margin-right: 8px;
}

.search-input input {
  background: none;
  border: none;
  padding: 12px 0;
  font-size: 14px;
  width: 100%;
  outline: none;
}

.student-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.student-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s;
}

.student-item:last-child {
  border-bottom: none;
}

.student-item:hover {
  background-color: #f9fafb;
}

.student-item.selected {
  background-color: rgba(59, 125, 221, 0.05);
}

.student-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 15px;
}

.student-info {
  flex: 1;
}

.student-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
}

.student-email {
  font-size: 14px;
  color: #6b7280;
}

.selected-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.form-container {
  max-width: 600px;
  margin: 0 auto 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.form-group select,
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.form-group select:focus,
.form-group input:focus,
.form-group textarea:focus {
  border-color: #3b7ddd;
}

.warning-message {
  display: flex;
  align-items: flex-start;
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
}

.warning-message i {
  color: #f59e0b;
  margin-right: 10px;
  margin-top: 2px;
}

.success-step {
  text-align: center;
}

.success-icon {
  font-size: 64px;
  color: #10b981;
  margin-bottom: 20px;
}

.uploaded-details {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  margin: 20px auto 30px;
  max-width: 400px;
  text-align: left;
}

.detail-item {
  margin-bottom: 10px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .selection-steps {
    flex-direction: column;
    gap: 10px;
  }
  
  .step-connector {
    width: 2px;
    height: 20px;
    margin: 5px 0;
  }
  
  .classroom-grid {
    grid-template-columns: 1fr;
  }
  
  .step-actions {
    flex-direction: column-reverse;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style> 