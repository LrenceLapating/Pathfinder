<template>
  <div class="activity-log">
    <div class="log-header">
      <h1>Activity Log</h1>
      <div class="log-filters">
        <div class="date-filter">
          <button 
            v-for="period in timePeriods" 
            :key="period.value"
            :class="['filter-btn', { active: selectedPeriod === period.value }]"
            @click="selectedPeriod = period.value"
          >
            {{ period.label }}
          </button>
        </div>
        <div class="type-filter">
          <select v-model="selectedType">
            <option value="">All Activities</option>
            <option v-for="type in activityTypes" 
                    :key="type.value" 
                    :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="log-content">
      <!-- Activity Timeline -->
      <div class="timeline">
        <div v-for="(group, date) in groupedActivities" 
             :key="date" 
             class="timeline-group">
          <div class="timeline-date">{{ formatDate(date) }}</div>
          
          <div class="timeline-activities">
            <div v-for="activity in group" 
                 :key="activity.id" 
                 class="activity-card"
                 :class="activity.type">
              <div class="activity-time">
                {{ formatTime(activity.timestamp) }}
              </div>
              <div class="activity-icon">
                <i :class="getActivityIcon(activity.type)"></i>
              </div>
              <div class="activity-content">
                <h3>{{ activity.title }}</h3>
                <p>{{ activity.description }}</p>
                <div class="activity-meta">
                  <span v-if="activity.score" class="score">
                    Score: {{ activity.score }}%
                  </span>
                  <span v-if="activity.duration" class="duration">
                    <i class="fas fa-clock"></i>
                    {{ activity.duration }} min
                  </span>
                  <span v-if="activity.xp" class="xp">
                    +{{ activity.xp }} XP
                  </span>
                </div>
                <div v-if="activity.progress" class="progress-bar">
                  <div 
                    :style="{ width: activity.progress + '%' }" 
                    class="progress"
                  ></div>
                </div>
              </div>
              <div class="activity-actions">
                <button v-if="activity.type === 'quiz'" @click="reviewQuiz(activity)">
                  Review
                </button>
                <button v-if="activity.type === 'module'" @click="continueModule(activity)">
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Stats -->
      <div class="activity-stats">
        <div class="stats-card total-time">
          <div class="stat-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-content">
            <h3>Total Study Time</h3>
            <div class="stat-value">{{ totalStudyTime }} hours</div>
            <div class="stat-trend up">
              <i class="fas fa-arrow-up"></i>
              20% vs last week
            </div>
          </div>
        </div>

        <div class="stats-card completed-items">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-content">
            <h3>Completed Items</h3>
            <div class="stat-value">{{ completedItems }}</div>
            <div class="stat-breakdown">
              <span>{{ quizzesTaken }} Quizzes</span>
              <span>{{ modulesCompleted }} Modules</span>
            </div>
          </div>
        </div>

        <div class="stats-card average-score">
          <div class="stat-icon">
            <i class="fas fa-star"></i>
          </div>
          <div class="stat-content">
            <h3>Average Score</h3>
            <div class="stat-value">{{ averageScore }}%</div>
            <div class="stat-trend up">
              <i class="fas fa-arrow-up"></i>
              5% vs last week
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityLog',
  data() {
    return {
      selectedPeriod: 'week',
      selectedType: '',
      timePeriods: [
        { label: 'Today', value: 'today' },
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' }
      ],
      activityTypes: [
        { label: 'Quizzes', value: 'quiz' },
        { label: 'Modules', value: 'module' },
        { label: 'Practice', value: 'practice' },
        { label: 'Achievements', value: 'achievement' }
      ],
      activities: [
        {
          id: 1,
          type: 'quiz',
          title: 'Mathematics Quiz',
          description: 'Completed Algebra Quiz #3',
          timestamp: '2024-02-20T14:30:00',
          score: 85,
          duration: 30,
          xp: 100
        },
        {
          id: 2,
          type: 'module',
          title: 'Physics Module',
          description: 'Started Forces and Motion',
          timestamp: '2024-02-20T13:00:00',
          progress: 35,
          duration: 45,
          xp: 50
        },
        {
          id: 3,
          type: 'practice',
          title: 'Practice Session',
          description: 'Solved 10 practice problems',
          timestamp: '2024-02-20T11:30:00',
          duration: 60,
          xp: 75
        },
        {
          id: 4,
          type: 'achievement',
          title: 'Achievement Unlocked',
          description: 'Quick Learner - Complete 5 modules in a day',
          timestamp: '2024-02-20T10:00:00',
          xp: 200
        }
      ]
    }
  },
  computed: {
    groupedActivities() {
      // Group activities by date
      const grouped = {}
      this.filteredActivities.forEach(activity => {
        const date = new Date(activity.timestamp).toLocaleDateString()
        if (!grouped[date]) {
          grouped[date] = []
        }
        grouped[date].push(activity)
      })
      return grouped
    },
    filteredActivities() {
      return this.activities.filter(activity => {
        if (this.selectedType && activity.type !== this.selectedType) {
          return false
        }
        // Add date filtering based on selectedPeriod
        return true
      }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    },
    totalStudyTime() {
      const minutes = this.activities.reduce((total, activity) => {
        return total + (activity.duration || 0)
      }, 0)
      return (minutes / 60).toFixed(1)
    },
    completedItems() {
      return this.activities.filter(a => 
        a.type === 'quiz' || (a.type === 'module' && a.progress === 100)
      ).length
    },
    quizzesTaken() {
      return this.activities.filter(a => a.type === 'quiz').length
    },
    modulesCompleted() {
      return this.activities.filter(a => 
        a.type === 'module' && a.progress === 100
      ).length
    },
    averageScore() {
      const quizzes = this.activities.filter(a => a.type === 'quiz' && a.score)
      if (!quizzes.length) return 0
      const total = quizzes.reduce((sum, quiz) => sum + quiz.score, 0)
      return Math.round(total / quizzes.length)
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      })
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })
    },
    getActivityIcon(type) {
      const icons = {
        quiz: 'fas fa-question-circle',
        module: 'fas fa-book',
        practice: 'fas fa-pencil-alt',
        achievement: 'fas fa-trophy'
      }
      return icons[type] || 'fas fa-circle'
    },
    reviewQuiz(activity) {
      this.$router.push(`/student/quiz/${activity.id}/review`)
    },
    continueModule(activity) {
      this.$router.push(`/student/modules/${activity.id}`)
    }
  }
}
</script>

<style scoped>
.activity-log {
  padding: 2rem;
}

.log-header {
  margin-bottom: 2rem;
}

.log-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.date-filter {
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

.type-filter select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  font-size: 1rem;
  outline: none;
}

.log-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.timeline {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.timeline-group {
  margin-bottom: 2rem;
}

.timeline-date {
  font-weight: bold;
  color: #666;
  margin-bottom: 1rem;
}

.timeline-activities {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 10px;
  position: relative;
}

.activity-card::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 2px;
}

.activity-card.quiz::before {
  background: #4CAF50;
}

.activity-card.module::before {
  background: #2196F3;
}

.activity-card.practice::before {
  background: #FF9800;
}

.activity-card.achievement::before {
  background: #FFD700;
}

.activity-time {
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.quiz .activity-icon {
  background: #4CAF50;
}

.module .activity-icon {
  background: #2196F3;
}

.practice .activity-icon {
  background: #FF9800;
}

.achievement .activity-icon {
  background: #FFD700;
}

.activity-content {
  flex: 1;
}

.activity-content h3 {
  margin: 0 0 0.3rem 0;
  font-size: 1.1rem;
}

.activity-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.activity-meta {
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.score {
  color: #4CAF50;
  font-weight: 500;
}

.duration {
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.xp {
  color: #FFD700;
  font-weight: 500;
}

.progress-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  margin: 0.5rem 0;
}

.progress {
  height: 100%;
  background: #4CAF50;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.activity-actions {
  display: flex;
  gap: 0.5rem;
}

.activity-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
}

.activity-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  gap: 1rem;
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: #E8F5E9;
  color: #4CAF50;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  margin: 0;
  font-size: 1rem;
  color: #666;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.3rem 0;
}

.stat-trend {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.stat-trend.up {
  color: #4CAF50;
}

.stat-trend.down {
  color: #f44336;
}

.stat-breakdown {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 1024px) {
  .log-content {
    grid-template-columns: 1fr;
  }

  .activity-stats {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .stats-card {
    flex: 1;
    min-width: 250px;
  }
}

@media (max-width: 768px) {
  .activity-log {
    padding: 1rem;
  }

  .log-filters {
    flex-direction: column;
    gap: 1rem;
  }

  .activity-card {
    flex-direction: column;
  }

  .activity-time {
    order: -1;
  }

  .activity-meta {
    flex-wrap: wrap;
  }
}
</style> 