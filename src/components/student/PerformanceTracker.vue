<template>
  <div class="performance-tracker">
    <div class="tracker-header">
      <h1>Performance Tracker</h1>
      <div class="time-filter">
        <button 
          v-for="period in timePeriods" 
          :key="period.value"
          :class="['filter-btn', { active: selectedPeriod === period.value }]"
          @click="selectedPeriod = period.value"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <div class="tracker-grid">
      <!-- Overall Progress Chart -->
      <div class="tracker-card">
        <h2>Overall Progress</h2>
        <div class="chart-container">
          <canvas ref="progressChart"></canvas>
        </div>
      </div>

      <!-- Subject Performance -->
      <div class="tracker-card">
        <h2>Subject Performance</h2>
        <div class="subject-list">
          <div v-for="subject in subjects" :key="subject.id" class="subject-item">
            <div class="subject-info">
              <h3>{{ subject.name }}</h3>
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
                <i :class="'fas fa-arrow-' + subject.trend"></i>
                {{ subject.change }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Time Spent Learning -->
      <div class="tracker-card">
        <h2>Learning Time</h2>
        <div class="chart-container">
          <canvas ref="timeChart"></canvas>
        </div>
      </div>

      <!-- Achievements -->
      <div class="tracker-card achievements">
        <h2>Achievements</h2>
        <div class="badges-grid">
          <div v-for="badge in badges" :key="badge.id" class="badge-item">
            <div class="badge-icon" :class="{ 'locked': !badge.earned }">
              <i :class="badge.icon"></i>
            </div>
            <div class="badge-info">
              <h4>{{ badge.name }}</h4>
              <p>{{ badge.description }}</p>
              <span v-if="!badge.earned" class="progress-text">
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
            data: [2.5, 3, 2, 4, 3.5, 5, 3],
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

.time-filter {
  display: flex;
  gap: 1rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.tracker-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.tracker-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-container {
  height: 300px;
  margin-top: 1rem;
}

.subject-list {
  margin-top: 1rem;
}

.subject-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.subject-info {
  flex: 1;
  margin-right: 2rem;
}

.subject-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #eee;
  border-radius: 3px;
}

.progress {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.subject-stats {
  text-align: right;
}

.score {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
}

.trend {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.trend.up {
  color: #4CAF50;
}

.trend.down {
  color: #f44336;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.badge-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 10px;
}

.badge-icon {
  width: 40px;
  height: 40px;
  background: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.badge-icon.locked {
  background: #9e9e9e;
}

.badge-info h4 {
  margin: 0;
  font-size: 1rem;
}

.badge-info p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
  color: #666;
}

.progress-text {
  font-size: 0.8rem;
  color: #9e9e9e;
}

@media (max-width: 1024px) {
  .tracker-grid {
    grid-template-columns: 1fr;
  }
}
</style> 