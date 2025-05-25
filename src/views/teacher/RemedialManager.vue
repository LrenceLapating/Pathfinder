<template>
  <div class="remedial-manager">
    <!-- Header Section -->
    <div class="remedial-header">
      <div class="header-left">
        <h1>Remedial Manager</h1>
        <p class="subtitle">Manage remedial sessions and student interventions</p>
      </div>
      <div class="header-actions">
        <button class="secondary-btn" @click="importData">
          <i class="fas fa-file-import"></i>
          Import Data
        </button>
        <button class="primary-btn" @click="createSession">
          <i class="fas fa-plus"></i>
          New Session
        </button>
      </div>
    </div>

    <!-- Overview Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <h3>Students in Remedial</h3>
          <p class="stat-value">{{ stats.totalStudents }}</p>
          <p class="stat-trend" :class="stats.studentsTrend > 0 ? 'negative' : 'positive'">
            <i :class="stats.studentsTrend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ Math.abs(stats.studentsTrend) }}% from previous period
          </p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-chalkboard-teacher"></i>
        </div>
        <div class="stat-content">
          <h3>Active Sessions</h3>
          <p class="stat-value">{{ stats.activeSessions }}</p>
          <p class="stat-trend">{{ stats.completionRate }}% completion rate</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-content">
          <h3>Avg. Improvement</h3>
          <p class="stat-value">{{ stats.averageImprovement }}%</p>
          <p class="stat-trend positive">
            <i class="fas fa-arrow-up"></i>
            From initial assessment
          </p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <div class="stat-content">
          <h3>Success Rate</h3>
          <p class="stat-value">{{ stats.successRate }}%</p>
          <p class="stat-trend">of students meet targets</p>
        </div>
      </div>
    </div>

    <!-- Session Management -->
    <div class="sessions-section">
      <div class="section-header">
        <h2>Remedial Sessions</h2>
        <div class="filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search sessions..."
              @input="filterSessions"
            />
          </div>
          <select v-model="selectedSubject" @change="filterSessions">
            <option value="">All Subjects</option>
            <option v-for="subject in subjects" :key="subject" :value="subject">
              {{ subject }}
            </option>
          </select>
          <select v-model="selectedStatus" @change="filterSessions">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      <div class="sessions-grid">
        <div v-for="session in filteredSessions" :key="session.id" class="session-card">
          <div class="session-header">
            <h3>{{ session.subject }}</h3>
            <span class="session-status" :class="session.status">
              {{ session.status }}
            </span>
          </div>
          
          <div class="session-details">
            <div class="detail-item">
              <i class="fas fa-users"></i>
              <span>{{ session.studentCount }} Students</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-calendar"></i>
              <span>{{ session.schedule }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-clock"></i>
              <span>{{ session.duration }}</span>
            </div>
          </div>

          <div class="progress-section">
            <div class="progress-header">
              <span>Progress</span>
              <span>{{ session.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: session.progress + '%' }"></div>
            </div>
          </div>

          <div class="session-actions">
            <button class="icon-btn" @click="viewSession(session)" title="View Details">
              <i class="fas fa-eye"></i>
            </button>
            <button class="icon-btn" @click="editSession(session)" title="Edit Session">
              <i class="fas fa-edit"></i>
            </button>
            <button class="icon-btn" @click="generateReport(session)" title="Generate Report">
              <i class="fas fa-file-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Student Progress -->
    <div class="progress-section">
      <h2>Student Progress Tracking</h2>
      <div class="progress-cards">
        <div v-for="student in studentsInRemedial" :key="student.id" class="student-card">
          <div class="student-info">
            <img :src="student.avatar" :alt="student.name" class="student-avatar" />
            <div class="student-details">
              <h4>{{ student.name }}</h4>
              <p>{{ student.subject }}</p>
            </div>
          </div>

          <div class="progress-metrics">
            <div class="metric">
              <span class="metric-label">Initial Score</span>
              <span class="metric-value">{{ student.initialScore }}%</span>
            </div>
            <div class="metric">
              <span class="metric-label">Current Score</span>
              <span class="metric-value">{{ student.currentScore }}%</span>
            </div>
            <div class="metric">
              <span class="metric-label">Target Score</span>
              <span class="metric-value">{{ student.targetScore }}%</span>
            </div>
          </div>

          <div class="progress-chart">
            <canvas :ref="'chart-' + student.id"></canvas>
          </div>

          <div class="student-actions">
            <button class="action-btn" @click="viewStudentDetails(student)">
              View Details
            </button>
            <button class="action-btn" @click="updateProgress(student)">
              Update Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto'

export default {
  name: 'RemedialManager',

  data() {
    return {
      searchQuery: '',
      selectedSubject: '',
      selectedStatus: '',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
      stats: {
        totalStudents: 45,
        studentsTrend: -5,
        activeSessions: 12,
        completionRate: 85,
        averageImprovement: 15,
        successRate: 78
      },
      sessions: [
        {
          id: 1,
          subject: 'Mathematics',
          status: 'active',
          studentCount: 8,
          schedule: 'Mon, Wed 3:00 PM',
          duration: '1 hour',
          progress: 65
        },
        // Add more sessions...
      ],
      studentsInRemedial: [
        {
          id: 1,
          name: 'John Doe',
          avatar: '/avatars/student1.jpg',
          subject: 'Mathematics',
          initialScore: 45,
          currentScore: 68,
          targetScore: 75,
          progressData: [45, 52, 58, 63, 68]
        },
        // Add more students...
      ]
    }
  },

  computed: {
    filteredSessions() {
      return this.sessions.filter(session => {
        const matchesSearch = session.subject.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesSubject = !this.selectedSubject || session.subject === this.selectedSubject
        const matchesStatus = !this.selectedStatus || session.status === this.selectedStatus
        return matchesSearch && matchesSubject && matchesStatus
      })
    }
  },

  mounted() {
    this.initializeCharts()
  },

  methods: {
    initializeCharts() {
      this.studentsInRemedial.forEach(student => {
        const ctx = this.$refs[`chart-${student.id}`][0].getContext('2d')
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Initial', 'Week 1', 'Week 2', 'Week 3', 'Current'],
            datasets: [{
              label: 'Progress',
              data: student.progressData,
              borderColor: '#2563EB',
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                min: 0,
                max: 100
              }
            }
          }
        })
      })
    },

    createSession() {
      // Implement session creation
    },

    importData() {
      // Implement data import
    },

    filterSessions() {
      // Implement session filtering
    },

    viewSession(session) {
      // Implement session view
    },

    editSession(session) {
      // Implement session edit
    },

    generateReport(session) {
      // Implement report generation
    },

    viewStudentDetails(student) {
      // Implement student details view
    },

    updateProgress(student) {
      // Implement progress update
    }
  }
}
</script>

<style scoped>
.remedial-manager {
  padding: 1.5rem;
}

.remedial-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-left h1 {
  margin: 0;
  font-size: 1.875rem;
  color: #1E293B;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  color: #64748B;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #EBF5FF;
  color: #2563EB;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-content h3 {
  margin: 0;
  font-size: 0.875rem;
  color: #64748B;
}

.stat-value {
  margin: 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1E293B;
}

.stat-trend {
  margin: 0;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-trend.positive {
  color: #10B981;
}

.stat-trend.negative {
  color: #EF4444;
}

.sessions-section {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1E293B;
}

.filters {
  display: flex;
  gap: 1rem;
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748B;
}

.search-box input {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.filters select {
  padding: 0.75rem 2rem 0.75rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
}

.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.session-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.session-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #1E293B;
}

.session-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.session-status.active {
  background: #DCFCE7;
  color: #10B981;
}

.session-status.completed {
  background: #E2E8F0;
  color: #64748B;
}

.session-status.scheduled {
  background: #FEF3C7;
  color: #D97706;
}

.session-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #64748B;
}

.progress-section {
  margin-bottom: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #64748B;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 6px;
  background: #E2E8F0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #2563EB;
  transition: width 0.3s ease;
}

.session-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.progress-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.student-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.student-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.student-details h4 {
  margin: 0;
  font-size: 1rem;
  color: #1E293B;
}

.student-details p {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #64748B;
}

.progress-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric {
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 0.75rem;
  color: #64748B;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1E293B;
}

.progress-chart {
  height: 150px;
  margin-bottom: 1.5rem;
}

.student-actions {
  display: flex;
  gap: 1rem;
}

.primary-btn,
.secondary-btn,
.action-btn,
.icon-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn {
  background: #2563EB;
  color: white;
  border: none;
}

.primary-btn:hover {
  background: #1D4ED8;
}

.secondary-btn {
  background: white;
  color: #1E293B;
  border: 1px solid #E2E8F0;
}

.secondary-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.action-btn {
  padding: 0.5rem 1rem;
  background: #F8FAFC;
  color: #2563EB;
  border: 1px solid #E2E8F0;
  flex: 1;
}

.action-btn:hover {
  background: #EBF5FF;
  border-color: #2563EB;
}

.icon-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: #64748B;
}

.icon-btn:hover {
  color: #2563EB;
  background: #F1F5F9;
}
</style> 