<template>
  <div class="activity-log">
    <div class="log-header">
      <h2><i class="fas fa-history"></i> Activity Log</h2>
      <div class="filter-controls">
        <div class="type-filter">
          <i class="fas fa-filter"></i>
          <select v-model="selectedType">
            <option value="">All Activities</option>
            <option value="quiz">Quizzes</option>
            <option value="module">Modules</option>
            <option value="practice">Practice</option>
          </select>
        </div>
      </div>
    </div>

    <div class="stats-overview">
      <div class="stat-card">
        <i class="fas fa-clock"></i>
        <div class="stat-info">
          <span class="stat-value">{{ totalStudyTime }}h</span>
          <span class="stat-label">Total Study Time</span>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-check-circle"></i>
        <div class="stat-info">
          <span class="stat-value">{{ completedItems }}</span>
          <span class="stat-label">Completed Items</span>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-graduation-cap"></i>
        <div class="stat-info">
          <span class="stat-value">{{ averageScore }}%</span>
          <span class="stat-label">Average Score</span>
        </div>
      </div>
    </div>

    <div class="activities-timeline">
      <div v-for="(activities, date) in groupedActivities" 
           :key="date" 
           class="date-group">
        <div class="date-header">
          <i class="fas fa-calendar-day"></i>
          <h3>{{ formatDate(date) }}</h3>
        </div>
        <div class="activities-list">
          <div v-for="activity in activities" 
               :key="activity.id"
               class="activity-item"
               :class="activity.type">
            <div class="activity-icon">
              <i :class="getActivityIcon(activity.type)"></i>
            </div>
            <div class="activity-content">
              <div class="activity-header">
                <h4>{{ activity.title }}</h4>
                <span class="activity-time">
                  <i class="fas fa-clock"></i>
                  {{ formatTime(activity.timestamp) }}
                </span>
              </div>
              <p>{{ activity.description }}</p>
              <div class="activity-meta">
                <span v-if="activity.duration" class="duration">
                  <i class="fas fa-hourglass-half"></i>
                  {{ activity.duration }} min
                </span>
                <span v-if="activity.score !== undefined" class="score">
                  <i class="fas fa-star"></i>
                  {{ activity.score }}%
                </span>
                <span v-if="activity.progress !== undefined" class="progress">
                  <i class="fas fa-tasks"></i>
                  {{ activity.progress }}% complete
                </span>
              </div>
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
      selectedType: '',
      activities: [
        {
          id: 1,
          type: 'quiz',
          title: 'Math Quiz',
          description: 'Completed algebra assessment',
          timestamp: '2024-02-20T09:30:00',
          duration: 30,
          score: 85
        },
        {
          id: 2,
          type: 'module',
          title: 'Physics Module',
          description: 'Started mechanics module',
          timestamp: '2024-02-20T11:00:00',
          duration: 45,
          progress: 60
        },
        {
          id: 3,
          type: 'practice',
          title: 'Problem Solving',
          description: 'Practice exercises in geometry',
          timestamp: '2024-02-20T14:00:00',
          duration: 20
        }
      ]
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
        minute: 'numeric'
      })
    },
    getActivityIcon(type) {
      const icons = {
        'quiz': 'fas fa-clipboard-check',
        'module': 'fas fa-book-open',
        'practice': 'fas fa-dumbbell'
      }
      return icons[type] || 'fas fa-circle'
    }
  }
}
</script>

<style scoped>
.activity-log {
  padding: 2rem;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.log-header h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.log-header h2 i {
  color: var(--primary-color);
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.type-filter {
  position: relative;
}

.type-filter i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.type-filter select {
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  appearance: none;
  background: white;
  min-width: 200px;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-card i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.activities-timeline {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.date-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.date-header i {
  color: var(--primary-color);
}

.date-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.activity-header h4 {
  margin: 0;
  font-size: 1.1rem;
}

.activity-time {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #666;
  font-size: 0.9rem;
}

.activity-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.activity-meta span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #666;
  font-size: 0.9rem;
}

.activity-item.quiz .activity-icon {
  background: #4CAF50;
}

.activity-item.module .activity-icon {
  background: #2196F3;
}

.activity-item.practice .activity-icon {
  background: #FF9800;
}

@media (max-width: 768px) {
  .activity-log {
    padding: 1rem;
  }

  .log-header {
    flex-direction: column;
    gap: 1rem;
  }

  .stats-overview {
    grid-template-columns: 1fr;
  }

  .activity-item {
    flex-direction: column;
  }

  .activity-icon {
    align-self: flex-start;
  }
}
</style> 