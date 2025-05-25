<template>
  <div class="student-performance">
    <!-- Header Section -->
    <div class="performance-header">
      <div class="header-left">
        <h1>Student Performance</h1>
        <p class="subtitle">Monitor and track individual student progress</p>
      </div>
      <div class="header-actions">
        <button class="secondary-btn" @click="exportPerformanceData">
          <i class="fas fa-file-export"></i>
          Export Data
        </button>
        <button class="primary-btn" @click="refreshData">
          <i class="fas fa-sync"></i>
          Refresh
        </button>
      </div>
    </div>

    <!-- Student Selection -->
    <div class="student-selector">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search students..."
          @input="searchStudents"
        />
      </div>
      <div class="filter-group">
        <select v-model="selectedCourse" @change="filterStudents">
          <option value="">All Courses</option>
          <option v-for="course in courses" :key="course" :value="course">
            {{ course }}
          </option>
        </select>
      </div>
    </div>

    <!-- Performance Dashboard -->
    <div class="performance-dashboard">
      <!-- Key Metrics -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="metric-content">
            <h3>Overall Grade</h3>
            <p class="metric-value">{{ selectedStudent.overallGrade }}%</p>
            <p class="metric-trend" :class="selectedStudent.gradeTrend > 0 ? 'positive' : 'negative'">
              <i :class="selectedStudent.gradeTrend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ Math.abs(selectedStudent.gradeTrend) }}% from previous period
            </p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-tasks"></i>
          </div>
          <div class="metric-content">
            <h3>Completion Rate</h3>
            <p class="metric-value">{{ selectedStudent.completionRate }}%</p>
            <p class="metric-trend" :class="selectedStudent.completionTrend > 0 ? 'positive' : 'negative'">
              <i :class="selectedStudent.completionTrend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ Math.abs(selectedStudent.completionTrend) }}% from previous period
            </p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="metric-content">
            <h3>Study Time</h3>
            <p class="metric-value">{{ selectedStudent.studyTime }} hrs/week</p>
            <p class="metric-trend" :class="selectedStudent.studyTimeTrend > 0 ? 'positive' : 'negative'">
              <i :class="selectedStudent.studyTimeTrend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ Math.abs(selectedStudent.studyTimeTrend) }}% from previous period
            </p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">
            <i class="fas fa-bullseye"></i>
          </div>
          <div class="metric-content">
            <h3>Goals Met</h3>
            <p class="metric-value">{{ selectedStudent.goalsCompleted }}/{{ selectedStudent.totalGoals }}</p>
            <p class="metric-trend">{{ (selectedStudent.goalsCompleted / selectedStudent.totalGoals * 100).toFixed(1) }}% completion rate</p>
          </div>
        </div>
      </div>

      <!-- Performance Charts -->
      <div class="charts-grid">
        <div class="chart-card">
          <h3>Grade Progression</h3>
          <div class="chart-container">
            <canvas ref="gradeChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <h3>Subject Performance</h3>
          <div class="chart-container">
            <canvas ref="subjectChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="activities-section">
        <h3>Recent Activities</h3>
        <div class="activity-list">
          <div v-for="activity in selectedStudent.recentActivities" 
               :key="activity.id" 
               class="activity-item"
          >
            <div class="activity-icon" :class="activity.type">
              <i :class="getActivityIcon(activity.type)"></i>
            </div>
            <div class="activity-content">
              <p class="activity-title">{{ activity.title }}</p>
              <p class="activity-time">{{ activity.timestamp }}</p>
            </div>
            <div class="activity-score" v-if="activity.score">
              {{ activity.score }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="recommendations-section">
        <h3>Recommendations</h3>
        <div class="recommendations-list">
          <div v-for="recommendation in selectedStudent.recommendations" 
               :key="recommendation.id" 
               class="recommendation-item"
          >
            <div class="recommendation-icon">
              <i class="fas fa-lightbulb"></i>
            </div>
            <div class="recommendation-content">
              <h4>{{ recommendation.title }}</h4>
              <p>{{ recommendation.description }}</p>
            </div>
            <button class="action-btn" @click="implementRecommendation(recommendation)">
              Implement
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
  name: 'StudentPerformance',

  data() {
    return {
      searchQuery: '',
      selectedCourse: '',
      courses: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
      selectedStudent: {
        overallGrade: 85,
        gradeTrend: 5,
        completionRate: 78,
        completionTrend: -2,
        studyTime: 12.5,
        studyTimeTrend: 8,
        goalsCompleted: 7,
        totalGoals: 10,
        recentActivities: [
          {
            id: 1,
            type: 'quiz',
            title: 'Completed Quiz: Algebra Basics',
            timestamp: '2 hours ago',
            score: 85
          },
          // Add more activities...
        ],
        recommendations: [
          {
            id: 1,
            title: 'Review Weak Areas',
            description: 'Focus on improving understanding of quadratic equations based on recent quiz performance.'
          },
          // Add more recommendations...
        ]
      },
      charts: {
        grade: null,
        subject: null
      }
    }
  },

  mounted() {
    this.initializeCharts()
  },

  methods: {
    initializeCharts() {
      // Initialize Grade Progression Chart
      this.charts.grade = new Chart(this.$refs.gradeChart, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
          datasets: [{
            label: 'Grade Progress',
            data: [75, 78, 80, 82, 85],
            borderColor: '#2563EB',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Grade Progression Over Time'
            }
          }
        }
      })

      // Initialize Subject Performance Chart
      this.charts.subject = new Chart(this.$refs.subjectChart, {
        type: 'radar',
        data: {
          labels: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'],
          datasets: [{
            label: 'Performance',
            data: [85, 78, 82, 90, 88],
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            borderColor: '#2563EB',
            pointBackgroundColor: '#2563EB'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Subject Performance Analysis'
            }
          }
        }
      })
    },

    getActivityIcon(type) {
      const icons = {
        quiz: 'fas fa-question-circle',
        assignment: 'fas fa-tasks',
        module: 'fas fa-book',
        discussion: 'fas fa-comments'
      }
      return icons[type] || 'fas fa-circle'
    },

    searchStudents() {
      // Implement student search
    },

    filterStudents() {
      // Implement student filtering
    },

    exportPerformanceData() {
      // Implement data export
    },

    refreshData() {
      // Refresh performance data
    },

    implementRecommendation(recommendation) {
      // Implement recommendation
    }
  }
}
</script>

<style scoped>
.student-performance {
  padding: 1.5rem;
}

.performance-header {
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

.student-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-box {
  flex: 1;
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
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.filter-group select {
  padding: 0.75rem 2rem 0.75rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
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
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.metric-icon {
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

.metric-content h3 {
  margin: 0;
  font-size: 0.875rem;
  color: #64748B;
}

.metric-value {
  margin: 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1E293B;
}

.metric-trend {
  margin: 0;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.metric-trend.positive {
  color: #10B981;
}

.metric-trend.negative {
  color: #EF4444;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  color: #1E293B;
}

.chart-container {
  height: 300px;
  position: relative;
}

.activities-section,
.recommendations-section {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.activities-section h3,
.recommendations-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #1E293B;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #E2E8F0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: 1rem;
}

.activity-icon.quiz {
  background: #EBF5FF;
  color: #2563EB;
}

.activity-icon.assignment {
  background: #F0FDF4;
  color: #10B981;
}

.activity-icon.module {
  background: #FEF3C7;
  color: #D97706;
}

.activity-content {
  flex: 1;
}

.activity-title {
  margin: 0;
  font-size: 0.875rem;
  color: #1E293B;
}

.activity-time {
  margin: 0.25rem 0 0 0;
  font-size: 0.75rem;
  color: #64748B;
}

.activity-score {
  font-size: 1rem;
  font-weight: 600;
  color: #1E293B;
}

.recommendation-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #E2E8F0;
}

.recommendation-item:last-child {
  border-bottom: none;
}

.recommendation-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #EBF5FF;
  color: #2563EB;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: 1rem;
}

.recommendation-content {
  flex: 1;
}

.recommendation-content h4 {
  margin: 0;
  font-size: 1rem;
  color: #1E293B;
}

.recommendation-content p {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #64748B;
}

.primary-btn,
.secondary-btn,
.action-btn {
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
}

.action-btn:hover {
  background: #EBF5FF;
  border-color: #2563EB;
}
</style> 