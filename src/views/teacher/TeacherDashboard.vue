<template>
  <div class="teacher-dashboard">
    <!-- Welcome Header -->
    <div class="welcome-header">
      <h1>Welcome, {{ teacherName }}</h1>
      <p>Here's an overview of your teaching progress</p>
    </div>

    <!-- Quick Action Buttons -->
    <div class="quick-actions">
      <button class="action-btn create-classroom" @click="showCreateClassroomModal = true">
        <i class="fas fa-chalkboard"></i>
        <span>Create Classroom</span>
      </button>
      <button class="action-btn assign-study" @click="showStudyGuideModal = true">
        <i class="fas fa-book"></i>
        <span>Assign Study Guide</span>
      </button>
      <button class="action-btn upload-scores" @click="navigateToScoreUpload">
        <i class="fas fa-upload"></i>
        <span>Upload Scores</span>
      </button>
      <button class="action-btn view-analytics" @click="navigateToAnalytics">
        <i class="fas fa-chart-bar"></i>
        <span>View Analytics</span>
      </button>
    </div>

    <!-- Overview Stats -->
    <div class="dashboard-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-chalkboard"></i>
        </div>
        <div class="stat-content">
          <h3>Total Classrooms</h3>
          <div class="stat-value">{{ classes.length }}</div>
          <div class="stat-change">
            <span>Active classrooms</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon risk-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="stat-content">
          <h3>At-Risk Students</h3>
          <div class="stat-value">{{ atRiskStudents }}</div>
          <div class="stat-change negative" v-if="atRiskStudents > 0">
            <i class="fas fa-arrow-up"></i>
            <span>Needs attention</span>
          </div>
          <div class="stat-change positive" v-else>
            <i class="fas fa-check"></i>
            <span>All students on track</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-book-open"></i>
        </div>
        <div class="stat-content">
          <h3>Subjects Covered</h3>
          <div class="stat-value">{{ subjectsCovered }}</div>
          <div class="stat-change">
            <span>Across all classrooms</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon alert-icon">
          <i class="fas fa-bell"></i>
        </div>
        <div class="stat-content">
          <h3>Performance Alerts</h3>
          <div class="stat-value">{{ performanceAlerts.length }}</div>
          <div class="stat-change negative" v-if="performanceAlerts.length > 0">
            <i class="fas fa-arrow-up"></i>
            <span>{{ performanceAlerts.length }} alerts to review</span>
          </div>
          <div class="stat-change positive" v-else>
            <i class="fas fa-check"></i>
            <span>No alerts</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Alerts Section -->
    <div class="dashboard-row" v-if="performanceAlerts.length > 0">
      <div class="dashboard-card flex-1">
        <div class="card-header">
          <h2>Recent Performance Alerts</h2>
        </div>
        <div class="alerts-list">
          <div v-for="alert in performanceAlerts" :key="alert.id" class="alert-item">
            <div class="alert-icon">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="alert-content">
              <p class="alert-text">{{ alert.message }}</p>
              <span class="alert-subject">{{ alert.subject }}</span>
            </div>
            <button class="alert-action-btn">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Classroom Management -->
    <div class="dashboard-row">
      <div class="dashboard-card flex-1">
        <div class="card-header">
          <h2>Your Classrooms</h2>
          <div class="card-actions">
            <button class="btn-add" @click="showCreateClassroomModal = true">
              <i class="fas fa-plus"></i> Add New
            </button>
            <button class="btn-text" @click="$router.push('/teacher/classrooms')">
              View All <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
        <div class="classroom-grid">
          <div v-for="classroom in classrooms" :key="classroom.id" class="classroom-card">
            <div class="classroom-header">
              <h3>{{ classroom.subject }}</h3>
              <div class="classroom-actions">
                <button class="action-icon-btn" title="View Classroom" @click="viewClassroom(classroom.id)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="action-icon-btn" title="Archive Classroom">
                  <i class="fas fa-archive"></i>
                </button>
                <button class="action-icon-btn" title="Delete Classroom">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="classroom-details">
              <div class="detail-item">
                <i class="fas fa-users"></i>
                <span>{{ classroom.students }} Students</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-key"></i>
                <span>Code: <strong>{{ classroom.code }}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Classroom Modal -->
    <div class="modal-overlay" v-if="showCreateClassroomModal" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>Create New Classroom</h2>
          <button class="close-modal-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="subject-name">Subject Name</label>
            <input type="text" id="subject-name" v-model="newClassroom.subject" placeholder="e.g. Algebra, Physics, English" />
          </div>
          <div class="form-group code-display" v-if="newClassroom.code">
            <label>Classroom Code</label>
            <div class="code-container">
              <span class="generated-code">{{ newClassroom.code }}</span>
              <button class="copy-btn" @click="copyCode" title="Copy Code">
                <i class="fas fa-copy"></i>
              </button>
            </div>
            <p class="code-help">Share this code with your students to join the classroom</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="create-btn" @click="createClassroom" :disabled="!newClassroom.subject">
            Create Classroom
          </button>
        </div>
      </div>
    </div>

    <!-- Assign Study Guide Modal -->
    <div class="modal-overlay" v-if="showStudyGuideModal" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>Assign Study Guide</h2>
          <button class="close-modal-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="classroom-select">Select Classroom</label>
            <select id="classroom-select" v-model="selectedClassroom">
              <option value="" disabled>Choose a classroom</option>
              <option v-for="classroom in classrooms" :key="classroom.id" :value="classroom.id">
                {{ classroom.subject }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="guide-topic">Study Guide Topic</label>
            <input type="text" id="guide-topic" v-model="studyGuide.topic" placeholder="e.g. Quadratic Equations" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="create-btn" @click="assignStudyGuide" :disabled="!selectedClassroom || !studyGuide.topic">
            Assign Guide
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeacherDashboard',
  
  data() {
    return {
      teacherName: 'Ms. Johnson',
      showCreateClassroomModal: false,
      showStudyGuideModal: false,
      selectedTimeframe: 'week',
      selectedClassroom: '',
      newClassroom: {
        subject: '',
        code: ''
      },
      studyGuide: {
        topic: ''
      },
      classrooms: [
        {
          id: 1,
          subject: 'Mathematics 101',
          students: 25,
          code: 'MATH101'
        },
        {
          id: 2,
          subject: 'Physics Advanced',
          students: 22,
          code: 'PHYS202'
        },
        {
          id: 3,
          subject: 'Chemistry Basics',
          students: 18,
          code: 'CHEM100'
        }
      ],
      classes: [
        {
          id: 1,
          name: 'Mathematics 101',
          students: 25,
          progress: 78,
          averageScore: 82
        },
        {
          id: 2,
          name: 'Physics Advanced',
          students: 22,
          progress: 65,
          averageScore: 75
        },
        {
          id: 3,
          name: 'Chemistry Basics',
          students: 18,
          progress: 92,
          averageScore: 88
        }
      ],
      performanceAlerts: [
        {
          id: 1,
          message: '5 students showing weakness in Algebra',
          subject: 'Mathematics 101'
        },
        {
          id: 2,
          message: '3 students struggling with Force & Motion concepts',
          subject: 'Physics Advanced'
        },
        {
          id: 3,
          message: '2 students need help with Chemical Reactions',
          subject: 'Chemistry Basics'
        }
      ]
    };
  },
  
  computed: {
    totalStudents() {
      return this.classrooms.reduce((total, cls) => total + cls.students, 0);
    },
    
    atRiskStudents() {
      // In a real application, this would be calculated based on performance data
      return 10;
    },
    
    subjectsCovered() {
      // Count unique subjects
      const subjects = new Set(this.classrooms.map(c => c.subject));
      return subjects.size;
    }
  },
  
  methods: {
    closeModal() {
      this.showCreateClassroomModal = false;
      this.showStudyGuideModal = false;
    },
    
    createClassroom() {
      if (this.newClassroom.subject) {
        // Generate a random code if not already generated
        if (!this.newClassroom.code) {
          this.newClassroom.code = this.generateClassroomCode();
        }
      }
    },
    
    generateClassroomCode() {
      // Generate a random 6-character alphanumeric code
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    },
    
    copyCode() {
      navigator.clipboard.writeText(this.newClassroom.code)
        .then(() => {
          // Show a notification that the code was copied
          alert('Code copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy code: ', err);
        });
    },
    
    viewClassroom(id) {
      this.$router.push(`/teacher/classroom/${id}`);
    },
    
    assignStudyGuide() {
      if (this.selectedClassroom && this.studyGuide.topic) {
        // In a real application, this would save the study guide to the database
        console.log(`Assigned study guide '${this.studyGuide.topic}' to classroom ID ${this.selectedClassroom}`);
        this.closeModal();
        this.studyGuide.topic = '';
        this.selectedClassroom = '';
      }
    },
    
    navigateToScoreUpload() {
      this.$router.push('/teacher/score-upload');
    },
    
    navigateToAnalytics() {
      this.$router.push('/teacher/analytics');
    }
  }
};
</script>

<style scoped>
.teacher-dashboard {
  padding: 20px;
}

.welcome-header {
  margin-bottom: 30px;
}

.welcome-header h1 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.welcome-header p {
  font-size: 16px;
  color: #666;
}

.quick-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn i {
  margin-right: 10px;
  font-size: 16px;
}

.create-classroom {
  background-color: #3b7ddd;
  color: white;
}

.create-classroom:hover {
  background-color: #2d6bbd;
}

.assign-study {
  background-color: #10b981;
  color: white;
}

.assign-study:hover {
  background-color: #0ca876;
}

.upload-scores {
  background-color: #6366f1;
  color: white;
}

.upload-scores:hover {
  background-color: #4f46e5;
}

.view-analytics {
  background-color: #f59e0b;
  color: white;
}

.view-analytics:hover {
  background-color: #e59300;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(59, 125, 221, 0.1);
  color: #3b7ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 20px;
}

.risk-icon {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.alert-icon {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  margin: 0 0 5px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.stat-change {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
}

.stat-change i {
  margin-right: 5px;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.dashboard-row {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.dashboard-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.flex-1 {
  flex: 1;
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.btn-add {
  background-color: #3b7ddd;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-add:hover {
  background-color: #2d6bbd;
}

.btn-text {
  background: none;
  border: none;
  color: #3b7ddd;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-text:hover {
  text-decoration: underline;
}

.card-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.alerts-list {
  padding: 10px 0;
}

.alert-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.alert-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.alert-content {
  flex: 1;
}

.alert-text {
  margin: 0 0 5px;
  font-size: 14px;
  color: #333;
}

.alert-subject {
  font-size: 12px;
  color: #666;
}

.alert-action-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f3f4f6;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.classroom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.classroom-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9fafb;
}

.classroom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.classroom-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.classroom-actions {
  display: flex;
  gap: 8px;
}

.action-icon-btn {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-icon-btn:hover {
  background-color: #f3f4f6;
}

.classroom-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.detail-item i {
  margin-right: 10px;
  color: #3b7ddd;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: #fff;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-modal-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b7ddd;
}

.code-display {
  background-color: #f3f4f6;
  padding: 15px;
  border-radius: 6px;
}

.code-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.generated-code {
  font-family: monospace;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
}

.copy-btn {
  background: none;
  border: none;
  color: #3b7ddd;
  cursor: pointer;
  font-size: 16px;
}

.code-help {
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  padding: 10px 16px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.create-btn {
  padding: 10px 16px;
  background-color: #3b7ddd;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.create-btn:disabled {
  background-color: #a3bce0;
  cursor: not-allowed;
}
</style> 