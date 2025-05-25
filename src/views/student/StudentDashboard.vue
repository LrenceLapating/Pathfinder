<template>
  <div class="student-dashboard">
    <!-- Hero Section -->
    <div class="dashboard-hero">
      <div class="hero-content">
        <h1 class="animate-title">Welcome Back, {{ studentName }}!</h1>
        <p class="subtitle animate-subtitle">Ready to continue your learning journey?</p>
        <div class="quick-stats">
          <div class="stat-pill">
            <i class="fas fa-award"></i>
            <span>{{ completedModules }} Modules</span>
          </div>
          <div class="stat-pill">
            <i class="fas fa-chart-line"></i>
            <span>{{ averageScore }}% Avg</span>
          </div>
          <div class="stat-pill">
            <i class="fas fa-fire"></i>
            <span>{{ studyStreak }} Day Streak</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <!-- Add decorative learning illustration or pattern here -->
        <div class="pattern-grid"></div>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- AI Recommendations -->
      <div class="content-section recommendations-section">
        <div class="section-header">
          <h2><i class="fas fa-robot"></i> Personalized Path</h2>
          <div class="header-actions">
            <button class="refresh-btn">
              <i class="fas fa-sync-alt"></i>
              Refresh
            </button>
          </div>
        </div>
        
        <div class="recommendations-grid">
          <div v-for="(rec, index) in aiRecommendations" 
               :key="index"
               class="recommendation-card"
               :class="rec.type">
            <div class="rec-icon">
              <i :class="rec.icon"></i>
            </div>
            <div class="rec-content">
              <h4>{{ rec.title }}</h4>
              <p>{{ rec.description }}</p>
              <button @click="handleRecommendation(rec)" class="rec-action">
                {{ rec.actionText }}
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Learning Progress -->
      <div class="content-section progress-section">
        <div class="section-header">
          <h2><i class="fas fa-chart-bar"></i> Learning Progress</h2>
          <router-link to="/student/analytics" class="view-all">
            View Details
            <i class="fas fa-external-link-alt"></i>
          </router-link>
        </div>
        
        <div class="subjects-grid">
          <div v-for="subject in subjectsProgress" 
               :key="subject.id"
               class="subject-card"
               :class="subject.trend">
            <div class="subject-header">
              <h4>
                <i :class="getSubjectIcon(subject.name)"></i>
                {{ subject.name }}
              </h4>
              <span :class="['level-badge', subject.level]">
                <i class="fas fa-graduation-cap"></i>
                {{ subject.level }}
              </span>
            </div>
            <div class="progress-indicator">
              <svg viewBox="0 0 36 36" class="circular-progress">
                <path d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  stroke-width="3"
                />
                <path d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  :stroke="subject.trend === 'improving' ? '#10B981' : subject.trend === 'declining' ? '#EF4444' : '#3B82F6'"
                  stroke-width="3"
                  :stroke-dasharray="`${subject.progress}, 100`"
                />
              </svg>
              <div class="progress-info">
                <span class="progress-value">{{ subject.progress }}%</span>
                <span :class="['trend', subject.trend]">
                  <i :class="getTrendIcon(subject.trend)"></i>
                  {{ subject.improvement }}% {{ subject.trend }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Schedule -->
      <div class="content-section schedule-section">
        <div class="section-header">
          <h2>Today's Schedule</h2>
          <router-link to="/student/schedule" class="view-all">
            Full Schedule
            <i class="fas fa-calendar-alt"></i>
          </router-link>
        </div>
        
        <div class="timeline">
          <div v-for="task in todaySchedule" 
               :key="task.id"
               class="timeline-item"
               :class="{ 'completed': task.completed }">
            <div class="time-marker">
              <span class="time">{{ task.time }}</span>
              <div class="marker"></div>
            </div>
            <div class="task-card">
              <div class="task-content">
                <h4>{{ task.title }}</h4>
                <p>{{ task.description }}</p>
              </div>
              <button @click="toggleTaskStatus(task)" 
                      :class="['status-btn', { 'done': task.completed }]">
                <i :class="task.completed ? 'fas fa-check' : 'fas fa-circle'"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.student-dashboard {
  min-height: 100vh;
  background: #F8FAFC;
  padding: 0;
}

/* Hero Section */
.dashboard-hero {
  background: linear-gradient(135deg, #1A1A1A 0%, #2D3748 100%);
  padding: 3rem 2rem;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-content {
  flex: 1;
  color: white;
  position: relative;
  z-index: 2;
}

.animate-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(90deg, #FFFFFF 0%, #E2E8F0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  color: #E2E8F0;
  margin: 1rem 0;
  opacity: 0.9;
}

.quick-stats {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.stat-pill {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  backdrop-filter: blur(10px);
}

.stat-pill i {
  color: #C84C1C;
}

.hero-visual {
  flex: 1;
  position: relative;
}

.pattern-grid {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.3;
}

/* Dashboard Content */
.dashboard-content {
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2rem;
  margin-top: -3rem;
}

.content-section {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.recommendations-section {
  grid-column: span 12;
}

.progress-section {
  grid-column: span 8;
}

.schedule-section {
  grid-column: span 4;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1A1A1A;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.refresh-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: #F1F5F9;
  color: #1A1A1A;
}

/* Recommendations Grid */
.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.recommendation-card {
  background: #F8FAFC;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-5px);
}

.recommendation-card.remedial {
  border-left: 4px solid #FCD34D;
}

.recommendation-card.challenge {
  border-left: 4px solid #10B981;
}

.recommendation-card.practice {
  border-left: 4px solid #3B82F6;
}

.rec-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.remedial .rec-icon {
  background: #FEF3C7;
  color: #92400E;
}

.challenge .rec-icon {
  background: #D1FAE5;
  color: #065F46;
}

.practice .rec-icon {
  background: #E0E7FF;
  color: #3730A3;
}

.rec-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #1A1A1A;
}

.rec-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.rec-action {
  margin-top: 1rem;
  background: none;
  border: none;
  color: #C84C1C;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  transition: gap 0.3s ease;
}

.rec-action:hover {
  gap: 0.75rem;
}

/* Subjects Grid */
.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.subject-card {
  background: #F8FAFC;
  border-radius: 16px;
  padding: 1.5rem;
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.subject-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #1A1A1A;
}

.level-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.level-badge.beginner {
  background: #FEF3C7;
  color: #92400E;
}

.level-badge.intermediate {
  background: #E0E7FF;
  color: #3730A3;
}

.level-badge.advanced {
  background: #D1FAE5;
  color: #065F46;
}

.level-badge.expert {
  background: #C84C1C;
  color: white;
}

.level-badge i {
  margin-right: 0.3rem;
  font-size: 0.9em;
}

.progress-indicator {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.circular-progress {
  width: 80px;
  height: 80px;
  transform: rotate(-90deg);
}

.circular-progress path {
  transition: stroke-dasharray 0.5s ease;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1A1A1A;
}

.trend {
  font-size: 0.9rem;
  font-weight: 500;
}

.trend.improving {
  color: #10B981;
}

.trend.stable {
  color: #3B82F6;
}

.trend.declining {
  color: #EF4444;
}

.trend i {
  margin-right: 0.3rem;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timeline-item {
  display: flex;
  gap: 1rem;
}

.time-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.time {
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
}

.marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #C84C1C;
  position: relative;
}

.marker::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: calc(100% + 1.5rem);
  background: #E2E8F0;
}

.timeline-item:last-child .marker::after {
  display: none;
}

.task-card {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 1rem;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.task-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #1A1A1A;
}

.task-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.status-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #E2E8F0;
  background: none;
  color: #E2E8F0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.status-btn.done {
  background: #10B981;
  border-color: #10B981;
  color: white;
}

.timeline-item.completed .task-card {
  opacity: 0.7;
}

@media (max-width: 1200px) {
  .progress-section,
  .schedule-section {
    grid-column: span 12;
  }
}

@media (max-width: 768px) {
  .dashboard-hero {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem;
  }

  .quick-stats {
    justify-content: center;
    flex-wrap: wrap;
  }

  .dashboard-content {
    padding: 1rem;
    gap: 1rem;
  }

  .recommendations-grid {
    grid-template-columns: 1fr;
  }

  .subjects-grid {
    grid-template-columns: 1fr;
  }
}

.section-header h2 i {
  margin-right: 0.5rem;
  color: var(--primary-color);
}

.subject-header h4 i {
  margin-right: 0.5rem;
  color: var(--primary-color);
}

.level-badge i {
  margin-right: 0.3rem;
  font-size: 0.9em;
}

.trend i {
  margin-right: 0.3rem;
}

.trend.improving i {
  color: #10B981;
}

.trend.declining i {
  color: #EF4444;
}

.trend.stable i {
  color: #3B82F6;
}

.rec-icon i {
  font-size: 1.5rem;
}

.recommendation-card.remedial .rec-icon i {
  color: #EF4444;
}

.recommendation-card.challenge .rec-icon i {
  color: #10B981;
}

.recommendation-card.practice .rec-icon i {
  color: #3B82F6;
}
</style>

<script>
export default {
  name: 'StudentDashboard',
  data() {
    return {
      studentName: 'Alex', // Replace with actual student name
      completedModules: 5,
      averageScore: 85,
      studyStreak: 7,
      aiRecommendations: [
        {
          type: 'remedial',
          icon: 'fas fa-tools',
          title: 'Algebra Review Needed',
          description: 'Your recent quiz scores suggest reviewing algebraic concepts would be helpful.',
          actionText: 'Start Review',
          action: 'startRemedial',
          subject: 'algebra'
        },
        {
          type: 'challenge',
          icon: 'fas fa-star',
          title: 'Ready for Advanced Content',
          description: 'Your excellent performance in Science qualifies you for advanced modules!',
          actionText: 'Accept Challenge',
          action: 'startChallenge',
          subject: 'science'
        },
        {
          type: 'practice',
          icon: 'fas fa-dumbbell',
          title: 'Practice Makes Perfect',
          description: 'Time for your daily practice exercises to reinforce your learning.',
          actionText: 'Start Practice',
          action: 'startPractice',
          subject: 'general'
        }
      ],
      subjectsProgress: [
        {
          id: 1,
          name: 'Mathematics',
          progress: 75,
          level: 'advanced',
          trend: 'improving',
          improvement: 15
        },
        {
          id: 2,
          name: 'Science',
          progress: 85,
          level: 'expert',
          trend: 'stable',
          improvement: 5
        },
        {
          id: 3,
          name: 'English',
          progress: 60,
          level: 'intermediate',
          trend: 'declining',
          improvement: -8
        }
      ],
      todaySchedule: [
        {
          id: 1,
          time: '09:00 AM',
          title: 'Math Practice',
          description: 'Algebra equations and inequalities',
          completed: false
        },
        {
          id: 2,
          time: '11:00 AM',
          title: 'Science Quiz',
          description: 'Chapter 5: Forces and Motion',
          completed: false
        },
        {
          id: 3,
          time: '02:00 PM',
          title: 'English Essay',
          description: 'Literature analysis draft',
          completed: false
        }
      ]
    }
  },
  methods: {
    getSubjectIcon(subject) {
      const icons = {
        'Mathematics': 'fas fa-square-root-alt',
        'Science': 'fas fa-flask',
        'English': 'fas fa-book',
        'History': 'fas fa-landmark',
        'Geography': 'fas fa-globe-americas',
        'Physics': 'fas fa-atom',
        'Chemistry': 'fas fa-vial',
        'Biology': 'fas fa-dna',
        'Computer Science': 'fas fa-laptop-code',
        'Art': 'fas fa-palette',
        'Music': 'fas fa-music'
      }
      return icons[subject] || 'fas fa-book'
    },
    getTrendIcon(trend) {
      const icons = {
        'improving': 'fas fa-arrow-trend-up',
        'declining': 'fas fa-arrow-trend-down',
        'stable': 'fas fa-equals'
      }
      return icons[trend] || 'fas fa-minus'
    },
    handleRecommendation(rec) {
      switch(rec.action) {
        case 'startRemedial':
          this.$router.push(`/student/remedial?subject=${rec.subject}`)
          break
        case 'startChallenge':
          this.$router.push(`/student/modules?type=challenge&subject=${rec.subject}`)
          break
        case 'startPractice':
          this.$router.push(`/student/practice?subject=${rec.subject}`)
          break
        default:
          console.log('Unknown recommendation action:', rec.action)
      }
    },
    toggleTaskStatus(task) {
      task.completed = !task.completed
      this.updateSchedule(task)
    },
    async updateSchedule(task) {
      try {
        await this.$api.schedule.updateTask(task)
      } catch (error) {
        console.error('Error updating task:', error)
      }
    }
  }
}
</script>

<script>
export default {
  name: 'StudentDashboard',
  data() {
    return {
      studentName: 'Alex', // Replace with actual student name
      completedModules: 5,
      averageScore: 85,
      studyStreak: 7,
      aiRecommendations: [
        {
          type: 'remedial',
          icon: 'fas fa-tools',
          title: 'Algebra Review Needed',
          description: 'Your recent quiz scores suggest reviewing algebraic concepts would be helpful.',
          actionText: 'Start Review',
          action: 'startRemedial',
          subject: 'algebra'
        },
        {
          type: 'challenge',
          icon: 'fas fa-star',
          title: 'Ready for Advanced Content',
          description: 'Your excellent performance in Science qualifies you for advanced modules!',
          actionText: 'Accept Challenge',
          action: 'startChallenge',
          subject: 'science'
        },
        {
          type: 'practice',
          icon: 'fas fa-dumbbell',
          title: 'Practice Makes Perfect',
          description: 'Time for your daily practice exercises to reinforce your learning.',
          actionText: 'Start Practice',
          action: 'startPractice',
          subject: 'general'
        }
      ],
      subjectsProgress: [
        {
          id: 1,
          name: 'Mathematics',
          progress: 75,
          level: 'advanced',
          trend: 'improving',
          improvement: 15
        },
        {
          id: 2,
          name: 'Science',
          progress: 85,
          level: 'expert',
          trend: 'stable',
          improvement: 5
        },
        {
          id: 3,
          name: 'English',
          progress: 60,
          level: 'intermediate',
          trend: 'declining',
          improvement: -8
        }
      ],
      todaySchedule: [
        {
          id: 1,
          time: '09:00 AM',
          title: 'Math Practice',
          description: 'Algebra equations and inequalities',
          completed: false
        },
        {
          id: 2,
          time: '11:00 AM',
          title: 'Science Quiz',
          description: 'Chapter 5: Forces and Motion',
          completed: false
        },
        {
          id: 3,
          time: '02:00 PM',
          title: 'English Essay',
          description: 'Literature analysis draft',
          completed: false
        }
      ]
    }
  },
  methods: {
    getSubjectIcon(subject) {
      const icons = {
        'Mathematics': 'fas fa-square-root-alt',
        'Science': 'fas fa-flask',
        'English': 'fas fa-book',
        'History': 'fas fa-landmark',
        'Geography': 'fas fa-globe-americas',
        'Physics': 'fas fa-atom',
        'Chemistry': 'fas fa-vial',
        'Biology': 'fas fa-dna',
        'Computer Science': 'fas fa-laptop-code',
        'Art': 'fas fa-palette',
        'Music': 'fas fa-music'
      }
      return icons[subject] || 'fas fa-book'
    },
    getTrendIcon(trend) {
      const icons = {
        'improving': 'fas fa-arrow-trend-up',
        'declining': 'fas fa-arrow-trend-down',
        'stable': 'fas fa-equals'
      }
      return icons[trend] || 'fas fa-minus'
    },
    handleRecommendation(rec) {
      switch(rec.action) {
        case 'startRemedial':
          this.$router.push(`/student/remedial?subject=${rec.subject}`)
          break
        case 'startChallenge':
          this.$router.push(`/student/modules?type=challenge&subject=${rec.subject}`)
          break
        case 'startPractice':
          this.$router.push(`/student/practice?subject=${rec.subject}`)
          break
        default:
          console.log('Unknown recommendation action:', rec.action)
      }
    },
    toggleTaskStatus(task) {
      task.completed = !task.completed
      this.updateSchedule(task)
    },
    async updateSchedule(task) {
      try {
        await this.$api.schedule.updateTask(task)
      } catch (error) {
        console.error('Error updating task:', error)
      }
    }
  }
}
</script>

.stat-content h3 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1A1A1A;
}

.stat-content p {
  margin: 0.3rem 0 0 0;
  font-size: 0.9rem;
  color: #666;
}

/* Main Grid Layout */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.dashboard-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1A1A1A;
}

.card-action {
  background: none;
  border: none;
  color: #C84C1C;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.card-action:hover {
  background: rgba(200, 76, 28, 0.1);
}

/* Circular Progress */
.progress-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
}

.circular-progress {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
}

.circular-progress svg {
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: #f0f0f0;
  stroke-width: 8;
}

.progress-fill {
  fill: none;
  stroke: #C84C1C;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 283;
  transition: stroke-dashoffset 1s ease;
}

.progress-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  font-weight: 700;
  color: #1A1A1A;
}

.stat-label {
  font-size: 1rem;
  font-weight: 500;
  color: #666;
}

/* Quick Actions */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: left;
}

.action-button.primary {
  background: #C84C1C;
  color: white;
}

.action-button.secondary {
  background: #F8FAFC;
  color: #1A1A1A;
}

.action-button:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.button-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.action-button.secondary .button-icon {
  background: rgba(200, 76, 28, 0.1);
  color: #C84C1C;
}

.button-text {
  display: flex;
  flex-direction: column;
}

.button-text span {
  font-weight: 600;
  font-size: 1rem;
}

.button-text small {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* Recent Activity */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  animation: fadeInRight 0.5s ease forwards;
  opacity: 0;
}

.activity-time-line {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.activity-dot {
  width: 12px;
  height: 12px;
  background: #C84C1C;
  border-radius: 50%;
  margin-top: 6px;
}

.activity-line {
  width: 2px;
  flex-grow: 1;
  background: #eee;
  margin: 4px 0;
}

.activity-icon {
  width: 36px;
  height: 36px;
  background: rgba(200, 76, 28, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #C84C1C;
  font-size: 1rem;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-content p {
  margin: 0;
  font-weight: 500;
  color: #333;
}

.activity-content span {
  font-size: 0.8rem;
  color: #888;
}

/* Upcoming Tasks */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #F8FAFC;
  border-radius: 12px;
  transition: transform 0.3s ease;
  animation: fadeInLeft 0.5s ease forwards;
  opacity: 0;
}

.task-item:hover {
  transform: translateX(5px);
}

.task-checkbox {
  position: relative;
}

.task-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.task-checkbox label {
  display: block;
  width: 24px;
  height: 24px;
  border: 2px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.task-checkbox input:checked + label {
  background: #C84C1C;
  border-color: #C84C1C;
}

.task-checkbox input:checked + label:after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.9rem;
}

.task-info {
  flex: 1;
}

.task-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1A1A1A;
}

.task-info p {
  margin: 0.3rem 0 0 0;
  font-size: 0.8rem;
  color: #666;
}

.priority-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge.high {
  background: #FECACA;
  color: #991B1B;
}

.priority-badge.medium {
  background: #FEF3C7;
  color: #92400E;
}

.priority-badge.low {
  background: #D1FAE5;
  color: #065F46;
}

/* AI Recommendation */
.ai-recommendation {
  background: linear-gradient(135deg, #1A1A1A 0%, #333333 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.ai-recommendation:hover {
  transform: translateY(-5px);
}

.ai-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.ai-content {
  flex: 1;
}

.ai-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.ai-content p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.ai-actions {
  display: flex;
  gap: 1rem;
}

.ai-action-btn {
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai-action-btn.primary {
  background: #C84C1C;
  color: white;
}

.ai-action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.ai-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-title {
  animation: fadeIn 0.8s ease forwards;
}

.animate-subtitle {
  animation: fadeIn 0.8s ease 0.2s forwards;
  opacity: 0;
}

.animate-card {
  animation: fadeIn 0.8s ease forwards;
  opacity: 0;
}

/* Responsive Styles */
@media (max-width: 991px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .student-dashboard {
    padding: 1rem;
  }
  
  .dashboard-stats {
    grid-template-columns: 1fr;
  }

  .progress-stats {
    grid-template-columns: 1fr;
  }

  .ai-recommendation {
    flex-direction: column;
    text-align: center;
  }
  
  .ai-actions {
    margin-top: 1rem;
    width: 100%;
    justify-content: center;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .ai-tutor-fab span {
    display: none;
  }

  .ai-tutor-fab {
    width: 56px;
    height: 56px;
    padding: 0;
    border-radius: 50%;
    justify-content: center;
  }
}

.ai-recommendations {
  background: linear-gradient(135deg, #1A1A1A 0%, #333333 100%);
  color: white;
}

.recommendation-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-bottom: 1rem;
}

.recommendation-item:last-child {
  margin-bottom: 0;
}

.rec-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.rec-content {
  flex: 1;
}

.rec-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.rec-content p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.rec-action {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rec-action:hover {
  background: rgba(255, 255, 255, 0.2);
}

.recommendation-item.remedial .rec-icon {
  color: #FCD34D;
}

.recommendation-item.challenge .rec-icon {
  color: #10B981;
}

.recommendation-item.practice .rec-icon {
  color: #3B82F6;
}

.subjects-progress {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.subject-progress {
  background: #F8FAFC;
  padding: 1rem;
  border-radius: 12px;
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.subject-header h4 {
  margin: 0;
  font-size: 1rem;
}

.level-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.level-badge.beginner {
  background: #FEF3C7;
  color: #92400E;
}

.level-badge.intermediate {
  background: #E0E7FF;
  color: #3730A3;
}

.level-badge.advanced {
  background: #D1FAE5;
  color: #065F46;
}

.level-badge.expert {
  background: #C84C1C;
  color: white;
}

.progress-bar {
  height: 6px;
  background: #E2E8F0;
  border-radius: 3px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.progress {
  height: 100%;
  transition: width 0.3s ease;
}

.progress.improving {
  background: #10B981;
}

.progress.stable {
  background: #3B82F6;
}

.progress.declining {
  background: #EF4444;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
}

.trend {
  font-weight: 500;
}

.trend.improving {
  color: #10B981;
}

.trend.stable {
  color: #3B82F6;
}

.trend.declining {
  color: #EF4444;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.schedule-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #F8FAFC;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.schedule-item.completed {
  opacity: 0.7;
}

.task-time {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.task-content {
  flex: 1;
}

.task-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.task-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.status-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #CBD5E1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.status-btn.done {
  color: #10B981;
}

.ai-tutor-fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background: #C84C1C;
  color: white;
  border: none;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(200, 76, 28, 0.3);
  transition: all 0.3s ease;
}

.ai-tutor-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(200, 76, 28, 0.4);
}

.ai-tutor-fab i {
  font-size: 1.2rem;
}
</style> 