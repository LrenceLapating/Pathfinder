<template>
  <div class="student-dashboard">
    <div class="dashboard-header">
      <h1 class="animate-title">Welcome Back!</h1>
      <p class="subtitle animate-subtitle">Your personalized learning journey continues here</p>
    </div>

    <div class="dashboard-stats">
      <div class="stat-card animate-card" style="animation-delay: 0.1s">
        <div class="stat-icon">
          <i class="fas fa-award"></i>
        </div>
        <div class="stat-content">
          <h3>{{ completedModules }}</h3>
          <p>Modules Completed</p>
        </div>
      </div>
      <div class="stat-card animate-card" style="animation-delay: 0.2s">
        <div class="stat-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-content">
          <h3>{{ averageScore }}%</h3>
          <p>Average Score</p>
        </div>
      </div>
      <div class="stat-card animate-card" style="animation-delay: 0.3s">
        <div class="stat-icon">
          <i class="fas fa-fire"></i>
        </div>
        <div class="stat-content">
          <h3>{{ studyStreak }}</h3>
          <p>Day Streak</p>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Progress Overview -->
      <div class="dashboard-card progress-overview animate-card" style="animation-delay: 0.4s">
        <div class="card-header">
          <h2>Your Progress</h2>
          <button class="card-action">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
        <div class="progress-stats">
          <div class="stat-item">
            <div class="circular-progress">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle class="progress-bg" cx="50" cy="50" r="45"></circle>
                <circle class="progress-fill" cx="50" cy="50" r="45" :style="`stroke-dashoffset: ${calculateOffset(75)}`"></circle>
              </svg>
              <div class="progress-value">75%</div>
            </div>
            <span class="stat-label">Math</span>
          </div>
          <div class="stat-item">
            <div class="circular-progress">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle class="progress-bg" cx="50" cy="50" r="45"></circle>
                <circle class="progress-fill" cx="50" cy="50" r="45" :style="`stroke-dashoffset: ${calculateOffset(60)}`"></circle>
              </svg>
              <div class="progress-value">60%</div>
            </div>
            <span class="stat-label">Science</span>
          </div>
          <div class="stat-item">
            <div class="circular-progress">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle class="progress-bg" cx="50" cy="50" r="45"></circle>
                <circle class="progress-fill" cx="50" cy="50" r="45" :style="`stroke-dashoffset: ${calculateOffset(90)}`"></circle>
              </svg>
              <div class="progress-value">90%</div>
            </div>
            <span class="stat-label">English</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="dashboard-card quick-actions animate-card" style="animation-delay: 0.5s">
        <div class="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div class="action-buttons">
          <button @click="startNewModule" class="action-button primary">
            <div class="button-icon">
              <i class="fas fa-book"></i>
            </div>
            <div class="button-text">
              <span>Start New Module</span>
              <small>Continue your learning</small>
            </div>
          </button>
          <button @click="takeQuiz" class="action-button secondary">
            <div class="button-icon">
              <i class="fas fa-question-circle"></i>
            </div>
            <div class="button-text">
              <span>Take a Quiz</span>
              <small>Test your knowledge</small>
            </div>
          </button>
          <button @click="viewResources" class="action-button secondary">
            <div class="button-icon">
              <i class="fas fa-folder"></i>
            </div>
            <div class="button-text">
              <span>View Resources</span>
              <small>Access study materials</small>
            </div>
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="dashboard-card recent-activity animate-card" style="animation-delay: 0.6s">
        <div class="card-header">
        <h2>Recent Activity</h2>
          <button class="card-action">
            <span>View All</span>
          </button>
        </div>
        <div class="activity-list">
          <div v-for="(activity, index) in recentActivities" 
               :key="activity.id" 
               class="activity-item"
               :style="`animation-delay: ${0.1 * (index + 1)}s`">
            <div class="activity-time-line">
              <div class="activity-dot"></div>
              <div class="activity-line" v-if="index < recentActivities.length - 1"></div>
            </div>
            <div class="activity-icon">
            <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <p>{{ activity.description }}</p>
              <span>{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Tasks -->
      <div class="dashboard-card upcoming-tasks animate-card" style="animation-delay: 0.7s">
        <div class="card-header">
        <h2>Upcoming Tasks</h2>
          <button class="card-action">
            <span>View Calendar</span>
          </button>
        </div>
        <div class="task-list">
          <div v-for="(task, index) in upcomingTasks" 
               :key="task.id" 
               class="task-item"
               :style="`animation-delay: ${0.1 * (index + 1)}s`">
            <div class="task-checkbox">
              <input type="checkbox" :id="`task-${task.id}`" />
              <label :for="`task-${task.id}`"></label>
            </div>
            <div class="task-info">
              <h3>{{ task.title }}</h3>
              <p>{{ task.dueDate }}</p>
            </div>
            <span :class="['priority-badge', task.priority]">
              {{ task.priority }}
            </span>
          </div>
          </div>
        </div>
      </div>

    <!-- AI Recommendation -->
    <div class="ai-recommendation animate-card" style="animation-delay: 0.8s">
      <div class="ai-icon">
        <i class="fas fa-robot"></i>
      </div>
      <div class="ai-content">
        <h3>Personalized Recommendation</h3>
        <p>Based on your recent performance, we suggest focusing on Algebra concepts. Would you like to review them now?</p>
        </div>
      <div class="ai-actions">
        <button class="ai-action-btn primary">Review Now</button>
        <button class="ai-action-btn secondary">Later</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentDashboard',
  data() {
    return {
      completedModules: 5,
      averageScore: 85,
      studyStreak: 7,
      recentActivities: [
        {
          id: 1,
          icon: 'fas fa-check-circle',
          description: 'Completed Math Quiz',
          time: '2 hours ago'
        },
        {
          id: 2,
          icon: 'fas fa-book',
          description: 'Started new module: Advanced Algebra',
          time: '5 hours ago'
        },
        {
          id: 3,
          icon: 'fas fa-star',
          description: 'Earned "Math Whiz" badge',
          time: '1 day ago'
        }
      ],
      upcomingTasks: [
        {
          id: 1,
          title: 'Physics Assignment',
          dueDate: 'Due tomorrow',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Literature Essay',
          dueDate: 'Due in 3 days',
          priority: 'medium'
        },
        {
          id: 3,
          title: 'Weekly Math Quiz',
          dueDate: 'Due in 5 days',
          priority: 'low'
        }
      ]
    }
  },
  methods: {
    startNewModule() {
      this.$router.push('/student/modules')
    },
    takeQuiz() {
      // Implement quiz navigation
      this.$router.push('/student/quiz/new')
    },
    viewResources() {
      this.$router.push('/student/resources')
    },
    calculateOffset(percent) {
      // Calculate stroke-dashoffset for circular progress
      const circumference = 2 * Math.PI * 45;
      return circumference - (percent / 100) * circumference;
    }
  }
}
</script>

<style scoped>
.student-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header Section */
.dashboard-header {
  text-align: center;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1A1A1A;
  position: relative;
  display: inline-block;
}

.dashboard-header h1:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 4px;
  background: #C84C1C;
  border-radius: 2px;
}

.dashboard-header .subtitle {
  margin: 1.5rem 0 0 0;
  font-size: 1.1rem;
  color: #666;
}

/* Stats Section */
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: rgba(200, 76, 28, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #C84C1C;
  font-size: 1.5rem;
}

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
}
</style> 