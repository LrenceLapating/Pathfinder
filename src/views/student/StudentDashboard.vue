<template>
  <div class="student-dashboard">
    <!-- Hero Section with Welcome Message -->
    <div class="dashboard-hero">
      <div class="hero-content">
        <h1 class="welcome-title">Welcome Back, {{ studentName }}!</h1>
        <div class="alerts-container">
          <div class="alert" v-if="topicsNeedingReview.length > 0">
            <i class="fas fa-exclamation-circle"></i>
            <span>You have {{ topicsNeedingReview.length }} topics needing review</span>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- Performance Summaries -->
      <div class="content-section">
        <h2><i class="fas fa-chart-bar"></i> Recent Performance</h2>
        <div class="performance-cards">
          <div v-for="subject in subjects" :key="subject.id" class="subject-card">
            <div class="subject-header">
              <h3>{{ subject.name }}</h3>
              <span :class="['mastery-badge', getMasteryClass(subject.masteryLevel)]">
                {{ subject.masteryLevel }}%
              </span>
            </div>
            <div class="progress-bar">
              <div class="progress" :style="{ width: `${subject.masteryLevel}%`, backgroundColor: getMasteryColor(subject.masteryLevel) }"></div>
            </div>
            <div class="subject-stats">
              <div class="stat">
                <span class="stat-label">Topics</span>
                <span class="stat-value">{{ subject.topicsCount }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Weak Topics</span>
                <span class="stat-value">{{ subject.weakTopicsCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject & Topic Performance Breakdown -->
      <div class="content-section">
        <h2><i class="fas fa-book"></i> Subject & Topic Breakdown</h2>
        
        <div class="subjects-accordion">
          <div v-for="subject in subjects" :key="subject.id" class="subject-panel">
            <div class="panel-header" @click="toggleSubject(subject.id)">
              <h3>{{ subject.name }}</h3>
              <span :class="['mastery-badge', getMasteryClass(subject.masteryLevel)]">
                {{ subject.masteryLevel }}%
              </span>
              <i :class="['fas', openSubjects.includes(subject.id) ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
            </div>
            
            <div class="panel-content" v-show="openSubjects.includes(subject.id)">
              <div v-for="topic in subject.topics" :key="topic.id" class="topic-item">
                <div class="topic-info">
                  <h4>{{ topic.name }}</h4>
                  <div class="topic-mastery">
                    <div class="mastery-bar">
                      <div class="mastery-progress" :style="{ width: `${topic.masteryLevel}%`, backgroundColor: getMasteryColor(topic.masteryLevel) }"></div>
                    </div>
                    <span :class="['mastery-label', getMasteryClass(topic.masteryLevel)]">
                      {{ topic.masteryLevel }}%
                    </span>
                  </div>
                </div>
                <div class="topic-scores">
                  <div class="score-item">
                    <span class="score-label">Last Quiz</span>
                    <span class="score-value">{{ topic.lastQuizScore }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enrolled Classrooms -->
      <div class="content-section">
        <h2><i class="fas fa-users"></i> Your Classrooms</h2>
        <div class="classrooms-grid">
          <div v-for="classroom in enrolledClassrooms" :key="classroom.id" class="classroom-card">
            <div class="classroom-header">
              <h4>{{ classroom.name }}</h4>
              <span class="subject-tag">{{ classroom.subject }}</span>
            </div>
            <div class="classroom-details">
              <p><i class="fas fa-user-tie"></i> {{ classroom.teacher }}</p>
              <p><i class="fas fa-users"></i> {{ classroom.studentsCount }} students</p>
            </div>
            <router-link :to="`/student/classroom/${classroom.id}`" class="view-btn">
              View Classroom
            </router-link>
          </div>
        </div>
      </div>

      <!-- Performance Feedback Section -->
      <div class="content-section">
        <h2><i class="fas fa-comment-alt"></i> Performance Feedback</h2>
        <div class="feedback-container">
          <div class="feedback-card">
            <div class="feedback-icon">
              <i class="fas fa-trophy"></i>
            </div>
            <div class="feedback-content">
              <h3>{{ feedbackMessage.title }}</h3>
              <p>{{ feedbackMessage.message }}</p>
              <div class="next-steps">
                <h4>Next Steps:</h4>
                <ul>
                  <li v-for="(step, index) in feedbackMessage.nextSteps" :key="index">
                    {{ step }}
                  </li>
                </ul>
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
  name: 'StudentDashboard',
  data() {
    return {
      studentName: 'Alex',
      topicsNeedingReview: [
        { id: 1, name: 'Quadratic Equations', subjectId: 1 },
        { id: 2, name: 'Cell Division', subjectId: 3 },
        { id: 3, name: 'Newton\'s Laws', subjectId: 2 }
      ],
      subjects: [
        {
          id: 1,
          name: 'Mathematics',
          masteryLevel: 78,
          topicsCount: 12,
          weakTopicsCount: 2,
          topics: [
            { id: 1, name: 'Linear Equations', masteryLevel: 92, lastQuizScore: 95 },
            { id: 2, name: 'Quadratic Equations', masteryLevel: 65, lastQuizScore: 70 },
            { id: 3, name: 'Geometry', masteryLevel: 88, lastQuizScore: 85 },
            { id: 4, name: 'Trigonometry', masteryLevel: 72, lastQuizScore: 75 }
          ]
        },
        {
          id: 2,
          name: 'Physics',
          masteryLevel: 82,
          topicsCount: 8,
          weakTopicsCount: 1,
          topics: [
            { id: 5, name: 'Kinematics', masteryLevel: 90, lastQuizScore: 92 },
            { id: 6, name: 'Newton\'s Laws', masteryLevel: 68, lastQuizScore: 65 },
            { id: 7, name: 'Thermodynamics', masteryLevel: 85, lastQuizScore: 88 }
          ]
        },
        {
          id: 3,
          name: 'Biology',
          masteryLevel: 75,
          topicsCount: 10,
          weakTopicsCount: 3,
          topics: [
            { id: 8, name: 'Cell Structure', masteryLevel: 82, lastQuizScore: 80 },
            { id: 9, name: 'Cell Division', masteryLevel: 60, lastQuizScore: 62 },
            { id: 10, name: 'Genetics', masteryLevel: 78, lastQuizScore: 75 }
          ]
        }
      ],
      openSubjects: [1], // Initially open the first subject
      enrolledClassrooms: [
        {
          id: 1,
          name: 'Advanced Mathematics',
          subject: 'Mathematics',
          teacher: 'Dr. Smith',
          studentsCount: 24
        },
        {
          id: 2,
          name: 'Introduction to Calculus',
          subject: 'Mathematics',
          teacher: 'Prof. Johnson',
          studentsCount: 18
        }
      ],
      feedbackMessage: {
        title: 'You\'ve improved in Physics!',
        message: 'Your understanding of Kinematics has improved by 15% in the last month. Keep up the good work!',
        nextSteps: [
          'Review Newton\'s Laws to improve your overall Physics score',
          'Try the practice quiz on Thermodynamics',
          'Check out the study guide for Newton\'s Laws'
        ]
      }
    }
  },
  methods: {
    getMasteryClass(level) {
      if (level >= 80) return 'high';
      if (level >= 60) return 'medium';
      return 'low';
    },
    getMasteryColor(level) {
      if (level >= 80) return '#4CAF50';
      if (level >= 60) return '#FF9800';
      return '#F44336';
    },
    toggleSubject(subjectId) {
      if (this.openSubjects.includes(subjectId)) {
        this.openSubjects = this.openSubjects.filter(id => id !== subjectId);
      } else {
        this.openSubjects.push(subjectId);
      }
    }
  }
}
</script>

<style scoped>
.student-dashboard {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.dashboard-hero {
  background: linear-gradient(135deg, #1a237e, #283593);
  color: white;
  padding: 2rem;
  border-radius: 0 0 1rem 1rem;
}

.welcome-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.alerts-container {
  margin-top: 1rem;
}

.alert {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dashboard-content {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.content-section {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.content-section h2 {
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
}

/* Performance Cards */
.performance-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.subject-card {
  background: #f9f9f9;
  border-radius: 0.5rem;
  padding: 1rem;
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.subject-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.mastery-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 0.85rem;
}

.mastery-badge.high {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.mastery-badge.medium {
  background-color: #fff3e0;
  color: #ef6c00;
}

.mastery-badge.low {
  background-color: #ffebee;
  color: #c62828;
}

.progress-bar {
  height: 0.5rem;
  background-color: #e0e0e0;
  border-radius: 0.25rem;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress {
  height: 100%;
  border-radius: 0.25rem;
}

.subject-stats {
  display: flex;
  justify-content: space-between;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.75rem;
  color: #757575;
}

.stat-value {
  font-weight: 600;
  font-size: 1rem;
}

/* Subject Accordion */
.subjects-accordion {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.subject-panel {
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
  cursor: pointer;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.panel-content {
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #e0e0e0;
}

.topic-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.topic-item:last-child {
  border-bottom: none;
}

.topic-info {
  flex: 1;
}

.topic-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.topic-mastery {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mastery-bar {
  flex: 1;
  height: 0.4rem;
  background-color: #e0e0e0;
  border-radius: 0.2rem;
  overflow: hidden;
}

.mastery-progress {
  height: 100%;
  border-radius: 0.2rem;
}

.mastery-label {
  font-size: 0.85rem;
  font-weight: 600;
}

.topic-scores {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.score-label {
  font-size: 0.75rem;
  color: #757575;
}

.score-value {
  font-weight: 600;
}

/* Feedback Section */
.feedback-card {
  display: flex;
  gap: 1rem;
  background-color: #f5f5f5;
  border-radius: 0.5rem;
  padding: 1rem;
}

.feedback-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-radius: 50%;
  font-size: 1.5rem;
}

.feedback-content {
  flex: 1;
}

.feedback-content h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.feedback-content p {
  margin-bottom: 1rem;
}

.next-steps h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.next-steps ul {
  margin: 0;
  padding-left: 1.5rem;
}

.next-steps li {
  margin-bottom: 0.25rem;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .dashboard-hero {
    padding: 1.5rem;
  }
  
  .welcome-title {
    font-size: 1.5rem;
  }
  
  .content-section {
    padding: 1rem;
  }
  
  .performance-cards,
  .classrooms-grid {
    grid-template-columns: 1fr;
  }
  
  .feedback-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .next-steps ul {
    text-align: left;
  }
}

/* Classrooms Grid */
.classrooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.classroom-card {
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.classroom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.classroom-header h4 {
  margin: 0;
  font-size: 1.1rem;
}

.subject-tag {
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.classroom-details {
  margin-bottom: 1rem;
}

.classroom-details p {
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #616161;
}

.view-btn {
  display: block;
  text-align: center;
  background-color: #f5f5f5;
  color: #333;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}
</style> 