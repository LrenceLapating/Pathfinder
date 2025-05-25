<template>
  <div class="teacher-dashboard">
    <!-- Overview Stats -->
    <div class="dashboard-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <h3>Total Students</h3>
          <div class="stat-value">{{ totalStudents }}</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            <span>5% from last month</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-book"></i>
        </div>
        <div class="stat-content">
          <h3>Active Classes</h3>
          <div class="stat-value">{{ classes.length }}</div>
          <div class="stat-change">
            <span>No change</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-content">
          <h3>Average Performance</h3>
          <div class="stat-value">{{ averagePerformance }}%</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            <span>2.5% from last month</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-tasks"></i>
        </div>
        <div class="stat-content">
          <h3>Pending Tasks</h3>
          <div class="stat-value">{{ pendingTasks }}</div>
          <div class="stat-change negative">
            <i class="fas fa-arrow-up"></i>
            <span>3 more than yesterday</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Class Overview -->
    <div class="dashboard-row">
      <div class="dashboard-card flex-2">
        <div class="card-header">
          <h2>Class Overview</h2>
          <div class="card-actions">
            <button class="btn-outline" @click="$router.push('/teacher/schedule')">
              <i class="fas fa-plus"></i> Add Class
            </button>
          </div>
        </div>
        <div class="class-grid">
          <div v-for="classItem in classes" :key="classItem.id" class="class-card">
            <div class="class-header">
              <h3>{{ classItem.name }}</h3>
              <span class="class-badge">{{ classItem.students }} Students</span>
            </div>
            <div class="class-stats">
              <div class="progress-stat">
                <div class="stat-label">
                  <span>Progress</span>
                  <span>{{ classItem.progress }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress" :style="{ width: classItem.progress + '%' }"></div>
                </div>
              </div>
              <div class="progress-stat">
                <div class="stat-label">
                  <span>Average Score</span>
                  <span>{{ classItem.averageScore }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress" :style="{ width: classItem.averageScore + '%' }"></div>
                </div>
              </div>
            </div>
            <div class="class-actions">
              <button class="btn-text" @click="viewClassDetails(classItem)">
                View Details
              </button>
              <button class="btn-text" @click="manageClass(classItem)">
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-card flex-1">
        <div class="card-header">
          <h2>Recent Activities</h2>
          <div class="card-actions">
            <button class="btn-text">View All</button>
          </div>
        </div>
        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Analytics -->
    <div class="dashboard-row">
      <div class="dashboard-card flex-2">
        <div class="card-header">
          <h2>Performance Analytics</h2>
          <div class="card-actions">
            <select v-model="selectedTimeframe" class="select-input">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>
        <div class="analytics-content">
          <div class="chart-container">
            <!-- Chart component will go here -->
            <div class="chart-placeholder">Performance Chart</div>
          </div>
        </div>
      </div>

      <div class="dashboard-card flex-1">
        <div class="card-header">
          <h2>Upcoming Tasks</h2>
          <div class="card-actions">
            <button class="btn-text">View Calendar</button>
          </div>
        </div>
        <div class="task-list">
          <div v-for="task in upcomingTasks" :key="task.id" class="task-item">
            <div class="task-status" :class="{ 'urgent': task.isUrgent }"></div>
            <div class="task-content">
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>
              <span class="task-due">Due: {{ task.dueDate }}</span>
            </div>
            <button class="btn-icon" @click="completeTask(task)">
              <i class="fas fa-check"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeacherDashboard',
  
  data() {
    return {
      selectedTimeframe: 'week',
      classes: [
        {
          id: 1,
          name: 'Mathematics 101',
          students: 25,
          progress: 78,
          averageScore: 82
        },
        {
          id: 2,
          name: 'Physics Advanced',
          students: 22,
          progress: 65,
          averageScore: 75
        },
        {
          id: 3,
          name: 'Chemistry Lab',
          students: 18,
          progress: 85,
          averageScore: 88
        }
      ],
      recentActivities: [
        {
          id: 1,
          icon: 'fas fa-file-alt',
          text: 'John Doe submitted Assignment 3',
          time: '5 minutes ago'
        },
        {
          id: 2,
          icon: 'fas fa-user-graduate',
          text: 'Sarah Wilson completed Quiz 2',
          time: '15 minutes ago'
        },
        {
          id: 3,
          icon: 'fas fa-question-circle',
          text: 'New question in Physics forum',
          time: '1 hour ago'
        }
      ],
      upcomingTasks: [
        {
          id: 1,
          title: 'Grade Midterm Papers',
          description: 'Review and grade Period 1 midterm exams',
          dueDate: 'Tomorrow',
          isUrgent: true
        },
        {
          id: 2,
          title: 'Parent-Teacher Meeting',
          description: 'Virtual meeting with student parents',
          dueDate: 'Next Week',
          isUrgent: false
        }
      ]
    }
  },

  computed: {
    totalStudents() {
      return this.classes.reduce((sum, classItem) => sum + classItem.students, 0)
    },

    averagePerformance() {
      const total = this.classes.reduce((sum, classItem) => sum + classItem.averageScore, 0)
      return Math.round(total / this.classes.length)
    },

    pendingTasks() {
      return this.upcomingTasks.length
    }
  },

  methods: {
    viewClassDetails(classItem) {
      this.$router.push(`/teacher/classes/${classItem.id}`)
    },

    manageClass(classItem) {
      this.$router.push(`/teacher/classes/${classItem.id}/manage`)
    },

    completeTask(task) {
      // Implement task completion logic
      console.log('Completing task:', task)
    }
  }
}
</script>

<style scoped>
.teacher-dashboard {
  padding: 1.5rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 1rem;
  background-color: #e0f2fe;
  color: #0ea5e9;
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
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0.5rem 0;
}

.stat-change {
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.dashboard-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.dashboard-card {
  background-color: white;
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

.btn-outline {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #1e293b;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  border-color: #94a3b8;
  background-color: #f8fafc;
}

.btn-text {
  background: none;
  border: none;
  color: #2563eb;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
}

.btn-text:hover {
  text-decoration: underline;
}

.class-grid {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.class-card {
  background-color: #f8fafc;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.class-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #1e293b;
}

.class-badge {
  background-color: #e0f2fe;
  color: #0ea5e9;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.class-stats {
  margin-bottom: 1rem;
}

.progress-stat {
  margin-bottom: 0.75rem;
}

.stat-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.progress-bar {
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #2563eb;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.class-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.activity-list {
  padding: 1.5rem;
}

.activity-item {
  display: flex;
  align-items: start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e0f2fe;
  color: #0ea5e9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0;
  color: #1e293b;
  font-size: 0.875rem;
}

.activity-time {
  display: block;
  margin-top: 0.25rem;
  color: #64748b;
  font-size: 0.75rem;
}

.select-input {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1e293b;
  background-color: white;
}

.chart-container {
  padding: 1.5rem;
  height: 300px;
}

.chart-placeholder {
  height: 100%;
  background-color: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.task-list {
  padding: 1.5rem;
}

.task-item {
  display: flex;
  align-items: start;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.task-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #64748b;
  margin-top: 0.5rem;
}

.task-status.urgent {
  background-color: #ef4444;
}

.task-content {
  flex: 1;
}

.task-content h4 {
  margin: 0;
  font-size: 0.875rem;
  color: #1e293b;
}

.task-content p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #64748b;
}

.task-due {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background-color: white;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

@media (max-width: 1024px) {
  .dashboard-row {
    flex-direction: column;
  }

  .flex-1,
  .flex-2 {
    flex: none;
  }
}

@media (max-width: 768px) {
  .teacher-dashboard {
    padding: 1rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .class-grid {
    grid-template-columns: 1fr;
  }
}
</style> 