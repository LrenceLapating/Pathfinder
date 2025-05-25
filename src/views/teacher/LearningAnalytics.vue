<template>
  <div class="learning-analytics">
    <div class="analytics-header">
      <div class="header-left">
        <h1>Learning Analytics</h1>
        <p class="subtitle">Track and analyze student performance metrics</p>
      </div>
      <div class="header-actions">
        <div class="date-range">
          <button 
            v-for="period in timePeriods" 
            :key="period"
            :class="['period-btn', { active: selectedPeriod === period }]"
            @click="selectPeriod(period)"
          >
            {{ period }}
          </button>
        </div>
        <button class="primary-btn" @click="exportData">
          <i class="fas fa-download"></i>
          Export Report
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="metric-content">
          <h3>Active Students</h3>
          <div class="metric-value">{{ metrics.activeStudents }}</div>
          <div class="metric-trend" :class="metrics.activeStudentsTrend > 0 ? 'positive' : 'negative'">
            <i :class="metrics.activeStudentsTrend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            <span>{{ Math.abs(metrics.activeStudentsTrend) }}% from previous period</span>
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <div class="metric-content">
          <h3>Average Score</h3>
          <div class="metric-value">{{ metrics.averageScore }}%</div>
          <div class="metric-trend" :class="metrics.averageScoreTrend > 0 ? 'positive' : 'negative'">
            <i :class="metrics.averageScoreTrend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            <span>{{ Math.abs(metrics.averageScoreTrend) }}% from previous period</span>
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="metric-content">
          <h3>Avg. Study Time</h3>
          <div class="metric-value">{{ metrics.averageStudyTime }} hrs/week</div>
          <div class="metric-trend" :class="metrics.studyTimeTrend > 0 ? 'positive' : 'negative'">
            <i :class="metrics.studyTimeTrend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            <span>{{ Math.abs(metrics.studyTimeTrend) }}% from previous period</span>
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">
          <i class="fas fa-tasks"></i>
        </div>
        <div class="metric-content">
          <h3>Completion Rate</h3>
          <div class="metric-value">{{ metrics.completionRate }}%</div>
          <div class="metric-trend" :class="metrics.completionRateTrend > 0 ? 'positive' : 'negative'">
            <i :class="metrics.completionRateTrend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            <span>{{ Math.abs(metrics.completionRateTrend) }}% from previous period</span>
          </div>
        </div>
      </div>
    </div>

    <div class="analytics-row">
      <!-- Performance Distribution -->
      <div class="analytics-card flex-2">
        <div class="card-header">
          <h2>Performance Distribution</h2>
          <div class="card-actions">
            <select v-model="selectedSubject" class="select-input">
              <option v-for="subject in subjects" :key="subject" :value="subject">
                {{ subject }}
              </option>
            </select>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="performanceChart"></canvas>
        </div>
      </div>

      <!-- Top Performers -->
      <div class="analytics-card flex-1">
        <div class="card-header">
          <h2>Top Performers</h2>
          <div class="card-actions">
            <button class="btn-text">View All</button>
          </div>
        </div>
        <div class="performers-list">
          <div v-for="student in topPerformers" :key="student.id" class="performer-item">
            <img :src="student.avatar" :alt="student.name" class="student-avatar" />
            <div class="performer-info">
              <h4>{{ student.name }}</h4>
              <p>{{ student.performance }}% Overall</p>
            </div>
            <div class="performer-trend">
              <i class="fas fa-arrow-up"></i>
              {{ student.improvement }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="analytics-row">
      <!-- Learning Patterns -->
      <div class="analytics-card flex-1">
        <div class="card-header">
          <h2>Study Time Distribution</h2>
        </div>
        <div class="chart-container">
          <canvas ref="studyTimeChart"></canvas>
        </div>
      </div>

      <div class="analytics-card flex-1">
        <div class="card-header">
          <h2>Module Completion</h2>
        </div>
        <div class="chart-container">
          <canvas ref="completionChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Student Engagement -->
    <div class="analytics-section">
      <div class="card-header">
        <h2>Student Engagement</h2>
      </div>
      <div class="engagement-metrics">
        <div class="engagement-card">
          <h3>Most Active Times</h3>
          <div class="heatmap-container">
            <canvas ref="activityHeatmap"></canvas>
          </div>
        </div>

        <div class="engagement-card">
          <h3>Resource Usage</h3>
          <div class="chart-container">
            <canvas ref="resourceChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- At Risk Students -->
    <div class="analytics-section">
      <div class="card-header">
        <h2>Students Needing Attention</h2>
        <div class="card-actions">
          <button class="btn-text">View All</button>
        </div>
      </div>
      <div class="risk-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Current Grade</th>
              <th>Trend</th>
              <th>Last Activity</th>
              <th>Risk Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in atRiskStudents" :key="student.id">
              <td>
                <div class="student-info">
                  <img :src="student.avatar" :alt="student.name" />
                  <div>
                    <h4>{{ student.name }}</h4>
                    <p>{{ student.email }}</p>
                  </div>
                </div>
              </td>
              <td>{{ student.grade }}%</td>
              <td>
                <div :class="['trend', student.trend]">
                  <i :class="getTrendIcon(student.trend)"></i>
                  {{ student.trendValue }}%
                </div>
              </td>
              <td>{{ student.lastActivity }}</td>
              <td>
                <span :class="['risk-badge', student.riskLevel]">
                  {{ student.riskLevel }}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <button class="btn-icon" @click="viewStudentDetails(student)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-icon" @click="contactStudent(student)">
                    <i class="fas fa-envelope"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto'

export default {
  name: 'LearningAnalytics',
  
  data() {
    return {
      selectedPeriod: 'This Week',
      selectedSubject: 'All Subjects',
      timePeriods: ['Today', 'This Week', 'This Month', 'This Quarter'],
      subjects: ['All Subjects', 'Mathematics', 'Physics', 'Chemistry', 'Biology'],
      metrics: {
        activeStudents: 156,
        activeStudentsTrend: 5.2,
        averageScore: 78.5,
        averageScoreTrend: 2.3,
        averageStudyTime: 12.5,
        studyTimeTrend: -1.2,
        completionRate: 85,
        completionRateTrend: 3.1
      },
      topPerformers: [
        {
          id: 1,
          name: 'John Doe',
          avatar: '/avatars/student1.jpg',
          performance: 95,
          improvement: 12
        },
        {
          id: 2,
          name: 'Jane Smith',
          avatar: '/avatars/student2.jpg',
          performance: 92,
          improvement: 8
        },
        {
          id: 3,
          name: 'Mike Johnson',
          avatar: '/avatars/student3.jpg',
          performance: 90,
          improvement: 15
        }
      ],
      atRiskStudents: [
        {
          id: 1,
          name: 'Alice Brown',
          email: 'alice.b@school.edu',
          avatar: '/avatars/student4.jpg',
          grade: 65,
          trend: 'declining',
          trendValue: -5.2,
          lastActivity: '2 days ago',
          riskLevel: 'high'
        },
        {
          id: 2,
          name: 'Tom Wilson',
          email: 'tom.w@school.edu',
          avatar: '/avatars/student5.jpg',
          grade: 68,
          trend: 'stable',
          trendValue: 0.5,
          lastActivity: '1 day ago',
          riskLevel: 'medium'
        }
      ]
    }
  },

  methods: {
    selectPeriod(period) {
      this.selectedPeriod = period
      this.updateCharts()
    },

    exportData() {
      // Implement export functionality
      console.log('Exporting data...')
    },

    getTrendIcon(trend) {
      switch (trend) {
        case 'improving':
          return 'fas fa-arrow-up'
        case 'declining':
          return 'fas fa-arrow-down'
        default:
          return 'fas fa-minus'
      }
    },

    viewStudentDetails(student) {
      this.$router.push(`/teacher/students/${student.id}`)
    },

    contactStudent(student) {
      this.$router.push({
        path: '/teacher/messages',
        query: { student: student.id }
      })
    },

    initCharts() {
      // Initialize performance distribution chart
      new Chart(this.$refs.performanceChart, {
        type: 'bar',
        data: {
          labels: ['A', 'B', 'C', 'D', 'F'],
          datasets: [{
            label: 'Students',
            data: [15, 25, 20, 10, 5],
            backgroundColor: '#2563eb'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })

      // Initialize study time chart
      new Chart(this.$refs.studyTimeChart, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Hours',
            data: [4, 3.5, 5, 4.5, 3, 2, 1.5],
            borderColor: '#2563eb',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })

      // Initialize completion chart
      new Chart(this.$refs.completionChart, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'In Progress', 'Not Started'],
          datasets: [{
            data: [65, 25, 10],
            backgroundColor: ['#10b981', '#2563eb', '#e2e8f0']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })

      // Initialize resource usage chart
      new Chart(this.$refs.resourceChart, {
        type: 'bar',
        data: {
          labels: ['Videos', 'Documents', 'Quizzes', 'Exercises'],
          datasets: [{
            label: 'Usage',
            data: [80, 65, 45, 35],
            backgroundColor: '#2563eb'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y'
        }
      })
    },

    updateCharts() {
      // Update charts based on selected period
      console.log('Updating charts for period:', this.selectedPeriod)
    }
  },

  mounted() {
    this.initCharts()
  }
}
</script>

<style scoped>
.learning-analytics {
  padding: 1.5rem;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-left h1 {
  margin: 0;
  font-size: 1.875rem;
  color: #1e293b;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  color: #64748b;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.date-range {
  display: flex;
  gap: 0.5rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.period-btn:hover {
  border-color: #cbd5e1;
  color: #1e293b;
}

.period-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 1rem;
  background: #e0f2fe;
  color: #0ea5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.metric-content {
  flex: 1;
}

.metric-content h3 {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.metric-value {
  margin: 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.metric-trend {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.metric-trend.positive {
  color: #10b981;
}

.metric-trend.negative {
  color: #ef4444;
}

.analytics-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.analytics-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.flex-1 {
  flex: 1;
}

.flex-2 {
  flex: 2;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1e293b;
}

.card-actions {
  display: flex;
  gap: 1rem;
}

.select-input {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1e293b;
  background: white;
}

.chart-container {
  height: 300px;
  padding: 1.5rem;
  position: relative;
}

.performers-list {
  padding: 1.5rem;
}

.performer-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.performer-item:last-child {
  border-bottom: none;
}

.student-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.performer-info {
  flex: 1;
}

.performer-info h4 {
  margin: 0;
  font-size: 0.875rem;
  color: #1e293b;
}

.performer-info p {
  margin: 0.25rem 0 0 0;
  font-size: 0.75rem;
  color: #64748b;
}

.performer-trend {
  color: #10b981;
  font-size: 0.875rem;
  font-weight: 500;
}

.analytics-section {
  background: white;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.engagement-metrics {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.engagement-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #1e293b;
}

.heatmap-container {
  height: 200px;
}

.risk-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  font-weight: 600;
  color: #64748b;
  background: #f8fafc;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.student-info img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.student-info h4 {
  margin: 0;
  font-size: 0.875rem;
  color: #1e293b;
}

.student-info p {
  margin: 0.25rem 0 0 0;
  font-size: 0.75rem;
  color: #64748b;
}

.trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
}

.trend.improving {
  color: #10b981;
}

.trend.declining {
  color: #ef4444;
}

.trend.stable {
  color: #f59e0b;
}

.risk-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.risk-badge.high {
  background: #fee2e2;
  color: #ef4444;
}

.risk-badge.medium {
  background: #fef3c7;
  color: #d97706;
}

.risk-badge.low {
  background: #dcfce7;
  color: #10b981;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.btn-text {
  background: none;
  border: none;
  color: #2563eb;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-text:hover {
  text-decoration: underline;
}

.primary-btn {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  background: #1d4ed8;
}

@media (max-width: 1024px) {
  .analytics-row {
    flex-direction: column;
  }

  .flex-1,
  .flex-2 {
    flex: none;
  }

  .engagement-metrics {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .learning-analytics {
    padding: 1rem;
  }

  .analytics-header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .date-range {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style> 