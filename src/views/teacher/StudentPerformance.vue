<template>
  <div class="student-performance">
    <div class="page-header">
      <h1>Student Performance</h1>
    </div>

    <!-- Classroom Selector -->
    <div class="classroom-selector">
      <label for="classroom-select">Select Classroom:</label>
      <select id="classroom-select" v-model="selectedClassroom" @change="loadStudents">
        <option value="">All Classrooms</option>
        <option v-for="classroom in classrooms" :key="classroom.id" :value="classroom.id">
          {{ classroom.subject }}
        </option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading student data...</p>
    </div>

    <!-- Student Grid -->
    <div v-else-if="filteredStudents.length > 0" class="student-grid">
      <div v-for="student in filteredStudents" :key="student.id" class="student-card">
        <div class="student-header">
          <div class="student-info">
            <div class="avatar">{{ getInitials(student.name) }}</div>
            <div class="student-details">
              <h3>{{ student.name }}</h3>
              <p class="student-email">{{ student.email }}</p>
            </div>
          </div>
          <div class="risk-indicator" v-if="student.isAtRisk">
            <i class="fas fa-flag" title="At Risk"></i>
          </div>
        </div>
        
        <div class="mastery-breakdown">
          <h4>Topic Mastery</h4>
          <div v-for="(mastery, topic) in student.topicMastery" :key="topic" class="mastery-item">
            <div class="mastery-topic">{{ topic }}</div>
            <div class="mastery-bar">
              <div 
                class="mastery-level" 
                :class="getMasteryClass(mastery)" 
                :style="{ width: `${mastery}%` }"
              ></div>
            </div>
            <div class="mastery-percentage">{{ mastery }}%</div>
          </div>
        </div>
        
        <div class="student-actions">
          <button class="btn-primary" @click="viewStudentHistory(student.id)">
            <i class="fas fa-history"></i> View History
          </button>
          <button class="btn-secondary" @click="assignStudyGuide(student.id)">
            <i class="fas fa-book"></i> Assign Guide
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-users"></i>
      </div>
      <h2>No Students Found</h2>
      <p v-if="selectedClassroom">No students are enrolled in this classroom yet.</p>
      <p v-else>No students are enrolled in any classrooms yet.</p>
    </div>

    <!-- Student History Modal -->
    <div class="modal-overlay" v-if="showHistoryModal" @click="closeModals">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedStudent ? selectedStudent.name : 'Student' }} History</h2>
          <button class="close-modal-btn" @click="closeModals">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="history-tabs">
            <button 
              class="tab-btn" 
              :class="{ 'active': historyTab === 'scores' }" 
              @click="historyTab = 'scores'"
            >
              <i class="fas fa-chart-bar"></i> Quiz/Exam Scores
            </button>
            <button 
              class="tab-btn" 
              :class="{ 'active': historyTab === 'logs' }" 
              @click="historyTab = 'logs'"
            >
              <i class="fas fa-book-open"></i> Learning Logs
            </button>
          </div>
          
          <!-- Scores Tab -->
          <div v-if="historyTab === 'scores'" class="history-content">
            <table class="scores-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Topic</th>
                  <th>Type</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(score, index) in studentScores" :key="index">
                  <td>{{ score.date }}</td>
                  <td>{{ score.topic }}</td>
                  <td>{{ score.type }}</td>
                  <td>
                    <span 
                      class="score-badge"
                      :class="getScoreClass(score.score)"
                    >
                      {{ score.score }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Logs Tab -->
          <div v-else class="history-content">
            <div class="log-entry" v-for="(log, index) in studentLogs" :key="index">
              <div class="log-header">
                <span class="log-date">{{ log.date }}</span>
                <span class="log-topic">{{ log.topic }}</span>
              </div>
              <div class="log-body">
                <p>{{ log.description }}</p>
              </div>
              <div class="log-footer">
                <span class="log-duration">
                  <i class="fas fa-clock"></i> {{ log.duration }} minutes
                </span>
                <span class="log-progress">
                  Progress: {{ log.progress }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Study Guide Modal -->
    <div class="modal-overlay" v-if="showGuideModal" @click="closeModals">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>Assign Study Guide to {{ selectedStudent ? selectedStudent.name : 'Student' }}</h2>
          <button class="close-modal-btn" @click="closeModals">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="guide-section">
            <h3>Recommended Guides</h3>
            <p class="guide-hint">Based on recent performance, we recommend the following guides:</p>
            
            <div class="guide-list">
              <div 
                v-for="(guide, index) in recommendedGuides" 
                :key="index" 
                class="guide-item"
                :class="{ 'selected': selectedGuide === guide.id }"
                @click="selectGuide(guide.id)"
              >
                <div class="guide-content">
                  <h4>{{ guide.title }}</h4>
                  <p>{{ guide.description }}</p>
                  <div class="guide-topic">
                    <span>Topic: {{ guide.topic }}</span>
                    <span class="guide-difficulty" :class="guide.difficulty.toLowerCase()">
                      {{ guide.difficulty }}
                    </span>
                  </div>
                </div>
                <div class="guide-select">
                  <div class="select-indicator" v-if="selectedGuide === guide.id">
                    <i class="fas fa-check"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="guide-section">
            <h3>All Study Guides</h3>
            <div class="guide-filters">
              <select v-model="guideFilter" class="guide-filter-select">
                <option value="">All Topics</option>
                <option v-for="topic in guideTopics" :key="topic" :value="topic">
                  {{ topic }}
                </option>
              </select>
            </div>
            
            <div class="guide-list">
              <div 
                v-for="(guide, index) in filteredGuides" 
                :key="index" 
                class="guide-item"
                :class="{ 'selected': selectedGuide === guide.id }"
                @click="selectGuide(guide.id)"
              >
                <div class="guide-content">
                  <h4>{{ guide.title }}</h4>
                  <p>{{ guide.description }}</p>
                  <div class="guide-topic">
                    <span>Topic: {{ guide.topic }}</span>
                    <span class="guide-difficulty" :class="guide.difficulty.toLowerCase()">
                      {{ guide.difficulty }}
                    </span>
                  </div>
                </div>
                <div class="guide-select">
                  <div class="select-indicator" v-if="selectedGuide === guide.id">
                    <i class="fas fa-check"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModals">Cancel</button>
          <button 
            class="btn-primary" 
            :disabled="!selectedGuide" 
            @click="assignGuide"
          >
            Assign Guide
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentPerformance',
  
  data() {
    return {
      loading: true,
      selectedClassroom: '',
      classrooms: [],
      students: [],
      mockData: {
        classrooms: [
          {
            id: 1,
            subject: 'Mathematics 101',
            code: 'MATH101'
          },
          {
            id: 2,
            subject: 'Physics Advanced',
            code: 'PHYS202'
          },
          {
            id: 3,
            subject: 'Chemistry Basics',
            code: 'CHEM100'
          }
        ],
        students: [
          {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@example.com',
            classroomId: 1,
            isAtRisk: false,
            topicMastery: {
              'Algebra': 85,
              'Geometry': 72,
              'Calculus': 63,
              'Statistics': 91
            }
          },
          {
            id: 2,
            name: 'Emily Johnson',
            email: 'emily.j@example.com',
            classroomId: 1,
            isAtRisk: false,
            topicMastery: {
              'Algebra': 92,
              'Geometry': 88,
              'Calculus': 79,
              'Statistics': 95
            }
          },
          {
            id: 3,
            name: 'Michael Brown',
            email: 'michael.b@example.com',
            classroomId: 1,
            isAtRisk: true,
            topicMastery: {
              'Algebra': 45,
              'Geometry': 38,
              'Calculus': 41,
              'Statistics': 52
            }
          },
          {
            id: 4,
            name: 'Sarah Wilson',
            email: 'sarah.w@example.com',
            classroomId: 2,
            isAtRisk: false,
            topicMastery: {
              'Mechanics': 88,
              'Thermodynamics': 76,
              'Electricity': 82,
              'Optics': 79
            }
          },
          {
            id: 5,
            name: 'David Lee',
            email: 'david.lee@example.com',
            classroomId: 2,
            isAtRisk: true,
            topicMastery: {
              'Mechanics': 62,
              'Thermodynamics': 48,
              'Electricity': 39,
              'Optics': 45
            }
          },
          {
            id: 6,
            name: 'Jessica Taylor',
            email: 'jessica.t@example.com',
            classroomId: 3,
            isAtRisk: false,
            topicMastery: {
              'Periodic Table': 87,
              'Chemical Bonds': 92,
              'Organic Chemistry': 78,
              'Acids and Bases': 85
            }
          }
        ]
      },
      showHistoryModal: false,
      showGuideModal: false,
      historyTab: 'scores',
      selectedStudent: null,
      studentScores: [],
      studentLogs: [],
      recommendedGuides: [],
      guideTopics: [],
      guideFilter: '',
      selectedGuide: null,
      allGuides: [
        {
          id: 1,
          title: 'Algebra Fundamentals',
          description: 'A comprehensive guide covering fundamental concepts in algebra.',
          topic: 'Algebra',
          difficulty: 'Medium'
        },
        {
          id: 2,
          title: 'Advanced Algebra Concepts',
          description: 'Detailed explanations and practice problems for advanced algebra concepts.',
          topic: 'Algebra',
          difficulty: 'High'
        },
        {
          id: 3,
          title: 'Geometry Basics',
          description: 'Introduction to geometry concepts with interactive examples.',
          topic: 'Geometry',
          difficulty: 'Low'
        },
        {
          id: 4,
          title: 'Calculus Mastery',
          description: 'In-depth guide to calculus with step-by-step problem solving.',
          topic: 'Calculus',
          difficulty: 'High'
        },
        {
          id: 5,
          title: 'Statistics for Beginners',
          description: 'Gentle introduction to statistics and data analysis.',
          topic: 'Statistics',
          difficulty: 'Low'
        }
      ]
    };
  },
  
  computed: {
    filteredStudents() {
      if (!this.selectedClassroom) {
        return this.students;
      }
      return this.students.filter(student => student.classroomId === this.selectedClassroom);
    },
    
    filteredGuides() {
      if (!this.guideFilter) {
        return this.allGuides;
      }
      return this.allGuides.filter(guide => guide.topic === this.guideFilter);
    }
  },
  
  created() {
    this.fetchData();
  },
  
  methods: {
    fetchData() {
      // Simulate API call
      setTimeout(() => {
        this.classrooms = this.mockData.classrooms;
        this.students = this.mockData.students;
        this.loading = false;
      }, 1000);
    },
    
    loadStudents() {
      this.loading = true;
      // Simulate API call to load students for the selected classroom
      setTimeout(() => {
        this.loading = false;
      }, 800);
    },

    getInitials(name) {
      const names = name.split(' ');
      return names.map(n => n.charAt(0)).join('');
    },

    getMasteryClass(mastery) {
      if (mastery < 50) {
        return 'low-mastery';
      } else if (mastery < 75) {
        return 'medium-mastery';
      } else {
        return 'high-mastery';
      }
    },

    getScoreClass(score) {
      if (score < 50) {
        return 'low-mastery';
      } else if (score < 75) {
        return 'medium-mastery';
      } else {
        return 'high-mastery';
      }
    },

    viewStudentHistory(studentId) {
      this.selectedStudent = this.students.find(student => student.id === studentId);
      this.historyTab = 'scores';
      
      // Load mock scores data
      this.studentScores = [
        { date: '2023-05-15', topic: 'Algebra', type: 'Quiz', score: 82 },
        { date: '2023-05-10', topic: 'Geometry', type: 'Quiz', score: 75 },
        { date: '2023-05-05', topic: 'Calculus', type: 'Exam', score: 68 },
        { date: '2023-04-28', topic: 'Statistics', type: 'Quiz', score: 90 },
        { date: '2023-04-20', topic: 'Algebra', type: 'Exam', score: 85 }
      ];
      
      // Load mock logs data
      this.studentLogs = [
        { 
          date: '2023-05-16', 
          topic: 'Algebra', 
          description: 'Completed practice problems on quadratic equations', 
          duration: 45,
          progress: 85
        },
        { 
          date: '2023-05-12', 
          topic: 'Geometry', 
          description: 'Reviewed concepts on triangles and circles', 
          duration: 30,
          progress: 70
        },
        { 
          date: '2023-05-08', 
          topic: 'Calculus', 
          description: 'Practiced differentiation techniques', 
          duration: 60,
          progress: 65
        }
      ];
      
      this.showHistoryModal = true;
    },

    assignStudyGuide(studentId) {
      this.selectedStudent = this.students.find(student => student.id === studentId);
      
      // Generate recommended guides based on student's mastery levels
      const weakTopics = [];
      
      for (const [topic, mastery] of Object.entries(this.selectedStudent.topicMastery)) {
        if (mastery < 60) {
          weakTopics.push(topic);
        }
      }
      
      // Mock recommended guides
      this.recommendedGuides = [
        {
          id: 1,
          title: `${weakTopics[0] || 'General'} Fundamentals`,
          description: `A comprehensive guide covering fundamental concepts in ${weakTopics[0] || 'mathematics'}.`,
          topic: weakTopics[0] || 'General',
          difficulty: 'Medium'
        },
        {
          id: 2,
          title: `Advanced ${weakTopics[0] || 'Mathematics'} Concepts`,
          description: `Detailed explanations and practice problems for advanced ${weakTopics[0] || 'mathematics'} concepts.`,
          topic: weakTopics[0] || 'General',
          difficulty: 'High'
        }
      ];
      
      // Extract unique topics for filter dropdown
      this.guideTopics = [...new Set(this.allGuides.map(guide => guide.topic))];
      
      // Filter guides based on selected topic
      this.filteredGuides = this.allGuides;
      
      this.showGuideModal = true;
    },

    closeModals() {
      this.showHistoryModal = false;
      this.showGuideModal = false;
    },

    selectGuide(guideId) {
      this.selectedGuide = guideId;
    },

    assignGuide() {
      if (this.selectedGuide && this.selectedStudent) {
        // In a real app, this would save the guide assignment to the database
        console.log(`Assigned guide ${this.selectedGuide} to student ${this.selectedStudent.id}`);
        
        // Show success message
        alert(`Successfully assigned study guide to ${this.selectedStudent.name}!`);
        
        // Close the modal
        this.closeModals();
        
        // Reset selection
        this.selectedGuide = null;
      }
    }
  }
};
</script>

<style scoped>
.student-performance {
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

.classroom-selector {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.classroom-selector label {
  font-weight: 500;
  margin-right: 15px;
  color: #374151;
}

.classroom-selector select {
  padding: 10px 15px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  min-width: 250px;
  outline: none;
  background-color: white;
}

.classroom-selector select:focus {
  border-color: #3b7ddd;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b7ddd;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 48px;
  color: #6b7280;
  margin-bottom: 15px;
}

.empty-state h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

.empty-state p {
  font-size: 16px;
  color: #6b7280;
}

.student-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.student-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.student-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.student-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 10px;
}

.student-details {
  display: flex;
  flex-direction: column;
}

.student-details h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.student-details p {
  margin: 0;
}

.student-details .student-email {
  font-size: 14px;
  color: #6b7280;
}

.risk-indicator {
  margin-left: auto;
  font-size: 18px;
  color: #ef4444;
}

.mastery-breakdown {
  margin-bottom: 20px;
}

.mastery-breakdown h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.mastery-item {
  margin-bottom: 10px;
}

.mastery-topic {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
}

.mastery-bar {
  height: 10px;
  background-color: #f3f4f6;
  border-radius: 5px;
  overflow: hidden;
}

.mastery-level {
  height: 100%;
  background-color: #3b7ddd;
}

.mastery-level.low-mastery {
  background-color: #ef4444;
}

.mastery-level.medium-mastery {
  background-color: #f59e0b;
}

.mastery-level.high-mastery {
  background-color: #10b981;
}

.mastery-percentage {
  font-size: 14px;
  color: #6b7280;
  margin-left: 10px;
}

.student-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #3b7ddd;
  color: white;
  margin-left: 10px;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #6b7280;
}

.btn-primary:hover,
.btn-secondary:hover {
  background-color: #3366cc;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 80%;
  width: 600px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
}

.close-modal-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #6b7280;
  cursor: pointer;
}

.modal-body {
  margin-bottom: 20px;
}

.history-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  background-color: #f3f4f6;
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 10px;
}

.tab-btn.active {
  background-color: #3b7ddd;
  color: white;
}

.history-content {
  margin-bottom: 20px;
}

.scores-table {
  width: 100%;
  border-collapse: collapse;
}

.scores-table th,
.scores-table td {
  padding: 10px;
  text-align: left;
}

.scores-table th {
  background-color: #f3f4f6;
}

.score-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.score-badge.low-mastery {
  background-color: #ef4444;
  color: white;
}

.score-badge.medium-mastery {
  background-color: #f59e0b;
  color: white;
}

.score-badge.high-mastery {
  background-color: #10b981;
  color: white;
}

.log-entry {
  margin-bottom: 10px;
}

.log-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.log-date {
  font-size: 14px;
  color: #6b7280;
}

.log-topic {
  font-size: 14px;
  font-weight: 600;
  margin-left: 10px;
}

.log-body {
  margin-bottom: 5px;
}

.log-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-duration {
  font-size: 12px;
  color: #6b7280;
}

.log-progress {
  font-size: 12px;
  color: #6b7280;
}

.guide-section {
  margin-bottom: 20px;
}

.guide-hint {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 10px;
}

.guide-list {
  display: flex;
  flex-wrap: wrap;
}

.guide-item {
  width: calc(33.33% - 20px);
  margin: 10px;
  padding: 10px;
  background-color: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.guide-item:hover {
  background-color: #e5e7eb;
}

.guide-content {
  margin-bottom: 10px;
}

.guide-content h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.guide-content p {
  margin: 0;
}

.guide-topic {
  font-size: 14px;
  color: #6b7280;
}

.guide-difficulty {
  font-size: 12px;
  color: #6b7280;
}

.guide-difficulty.low {
  color: #ef4444;
}

.guide-difficulty.medium {
  color: #f59e0b;
}

.guide-difficulty.high {
  color: #10b981;
}

.guide-select {
  margin-top: 10px;
}

.select-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-filters {
  margin-bottom: 10px;
}

.guide-filter-select {
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  background-color: white;
}

.guide-filter-select:focus {
  border-color: #3b7ddd;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style> 