<template>
  <div class="performance-tracker">
    <div class="tracker-header">
      <h1><i class="fas fa-chart-line"></i> Performance Tracker</h1>
      <div class="time-filter">
        <button 
          v-for="period in timePeriods" 
          :key="period.value"
          :class="['filter-btn', { active: selectedPeriod === period.value }]"
          @click="selectedPeriod = period.value"
        >
          <i :class="getTimeFilterIcon(period.value)"></i>
          {{ period.label }}
        </button>
      </div>
    </div>

    <div class="tracker-grid">
      <!-- Overall Progress Chart -->
      <div class="tracker-card">
        <h2><i class="fas fa-chart-area"></i> Overall Progress</h2>
        <div class="chart-container">
          <canvas ref="progressChart"></canvas>
        </div>
      </div>

      <!-- Subject Performance -->
      <div class="tracker-card">
        <h2><i class="fas fa-graduation-cap"></i> Subject Performance</h2>
        <div class="subject-list">
          <div v-for="subject in subjects" :key="subject.id" class="subject-item">
            <div class="subject-info">
              <h3>
                <i :class="getSubjectIcon(subject.name)"></i>
                {{ subject.name }}
              </h3>
              <div class="progress-bar">
                <div 
                  :style="{ width: subject.progress + '%', backgroundColor: subject.color }" 
                  class="progress"
                ></div>
              </div>
            </div>
            <div class="subject-stats">
              <span class="score">{{ subject.score }}%</span>
              <span :class="['trend', subject.trend]">
                <i :class="getTrendIcon(subject.trend)"></i>
                {{ subject.change }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Time Spent Learning -->
      <div class="tracker-card">
        <h2><i class="fas fa-clock"></i> Learning Time</h2>
        <div class="chart-container">
          <canvas ref="timeChart"></canvas>
        </div>
      </div>

      <!-- Achievements -->
      <div class="tracker-card achievements">
        <h2><i class="fas fa-trophy"></i> Achievements</h2>
        <div class="badges-grid">
          <div v-for="badge in badges" :key="badge.id" class="badge-item">
            <div class="badge-icon" :class="{ 'locked': !badge.earned }">
              <i :class="badge.icon"></i>
            </div>
            <div class="badge-info">
              <h4>{{ badge.name }}</h4>
              <p>{{ badge.description }}</p>
              <span v-if="!badge.earned" class="progress-text">
                <i class="fas fa-tasks"></i>
                {{ badge.progress }}/{{ badge.required }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'PerformanceTracker',
  data() {
    return {
      selectedPeriod: 'week',
      timePeriods: [
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
        { label: 'Year', value: 'year' }
      ],
      subjects: [
        {
          id: 1,
          name: 'Mathematics',
          progress: 85,
          score: 88,
          trend: 'up',
          change: 5,
          color: '#4CAF50'
        },
        {
          id: 2,
          name: 'Physics',
          progress: 70,
          score: 75,
          trend: 'up',
          change: 3,
          color: '#2196F3'
        },
        {
          id: 3,
          name: 'English',
          progress: 90,
          score: 92,
          trend: 'down',
          change: 2,
          color: '#FF9800'
        }
      ],
      badges: [
        {
          id: 1,
          name: 'Quick Learner',
          description: 'Complete 5 modules in a day',
          icon: 'fas fa-bolt',
          earned: true
        },
        {
          id: 2,
          name: 'Math Wizard',
          description: 'Score 100% in 3 math quizzes',
          icon: 'fas fa-hat-wizard',
          earned: false,
          progress: 2,
          required: 3
        },
        {
          id: 3,
          name: 'Consistent',
          description: 'Study for 7 days in a row',
          icon: 'fas fa-calendar-check',
          earned: true
        }
      ]
    }
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    getTimeFilterIcon(period) {
      const icons = {
        'week': 'fas fa-calendar-week',
        'month': 'fas fa-calendar-alt',
        'year': 'fas fa-calendar'
      }
      return icons[period]
    },
    getSubjectIcon(subject) {
      const icons = {
        'Mathematics': 'fas fa-square-root-alt',
        'Physics': 'fas fa-atom',
        'English': 'fas fa-book',
        'Chemistry': 'fas fa-flask',
        'Biology': 'fas fa-dna',
        'History': 'fas fa-landmark',
        'Geography': 'fas fa-globe-americas',
        'Art': 'fas fa-palette',
        'Music': 'fas fa-music'
      }
      return icons[subject] || 'fas fa-book'
    },
    getTrendIcon(trend) {
      return trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
    },
    initCharts() {
      // Progress Chart
      const progressCtx = this.$refs.progressChart.getContext('2d')
      new Chart(progressCtx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Overall Progress',
            data: [65, 70, 68, 75, 80, 82, 85],
            borderColor: '#4CAF50',
            tension: 0.4,
            fill: false
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
              beginAtZero: true,
              max: 100
            }
          }
        }
      })

      // Time Chart
      const timeCtx = this.$refs.timeChart.getContext('2d')
      new Chart(timeCtx, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Hours Spent',
            data: [2.5, 3, 4, 2, 3.5, 1.5, 2],
            backgroundColor: '#2196F3'
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
              beginAtZero: true,
              title: {
                display: true,
                text: 'Hours'
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.performance-tracker {
  padding: 2rem;
}

.tracker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.tracker-header h1 {
  margin: 0;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1A1A1A;
}

.time-filter {
  display: flex;
  gap: 0.5rem;
  background: #f8f9fa;
  padding: 0.25rem;
  border-radius: 8px;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: white;
  color: #C84C1C;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tracker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.tracker-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.tracker-card h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  color: #1A1A1A;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-container {
  height: 250px;
  position: relative;
}

.subject-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.subject-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subject-info {
  flex: 1;
  margin-right: 1rem;
}

.subject-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.subject-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.score {
  font-weight: 600;
  color: #1A1A1A;
}

.trend {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.trend.up {
  color: #4CAF50;
}

.trend.down {
  color: #f44336;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.badge-icon {
  width: 40px;
  height: 40px;
  background: #C84C1C;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.badge-icon.locked {
  background: #ccc;
}

.badge-info {
  flex: 1;
}

.badge-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.badge-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.progress-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}
</style> 