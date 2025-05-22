<template>
  <div class="teacher-dashboard">
    <header class="dashboard-header">
      <h1>Teacher Dashboard</h1>
      <div class="user-info">
        <span>{{ teacherName }}</span>
        <span class="department">{{ department }}</span>
        <button @click="handleLogout" class="logout-button">Logout</button>
      </div>
    </header>

    <div class="dashboard-content">
      <div class="main-content">
        <div class="class-overview">
          <div class="section-header">
            <h2>My Classes</h2>
            <button @click="$router.push('/new-class')" class="add-button">
              + Add New Class
            </button>
          </div>
          <div class="classes-grid">
            <div v-for="class_ in classes" :key="class_.id" class="class-card">
              <div class="class-header">
                <h3>{{ class_.name }}</h3>
                <span class="student-count">{{ class_.studentCount }} Students</span>
              </div>
              <div class="class-stats">
                <div class="stat">
                  <span class="label">Average Progress</span>
                  <div class="progress-bar">
                    <div :style="{ width: class_.averageProgress + '%' }" class="progress-fill"></div>
                  </div>
                  <span class="value">{{ class_.averageProgress }}%</span>
                </div>
                <div class="stat">
                  <span class="label">Average Score</span>
                  <span class="value">{{ class_.averageScore }}%</span>
                </div>
              </div>
              <button @click="viewClass(class_)" class="view-button">
                View Class Details
              </button>
            </div>
          </div>
        </div>

        <div class="student-alerts">
          <h2>Student Alerts</h2>
          <div class="alerts-list">
            <div v-for="alert in studentAlerts" :key="alert.id" class="alert-card">
              <div class="alert-icon" :class="alert.type">
                <i :class="alert.icon"></i>
              </div>
              <div class="alert-content">
                <h4>{{ alert.title }}</h4>
                <p>{{ alert.description }}</p>
                <div class="alert-actions">
                  <button @click="handleAlert(alert)" class="action-button">
                    Take Action
                  </button>
                  <button @click="dismissAlert(alert)" class="dismiss-button">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar">
        <div class="upcoming-tasks">
          <h2>Upcoming Tasks</h2>
          <div class="task-list">
            <div v-for="task in upcomingTasks" :key="task.id" class="task-item">
              <div class="task-info">
                <h4>{{ task.title }}</h4>
                <p>{{ task.description }}</p>
                <span :class="['due-date', { 'urgent': task.isUrgent }]">
                  Due: {{ task.dueDate }}
                </span>
              </div>
              <button @click="completeTask(task)" class="complete-button">
                Complete
              </button>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <button @click="$router.push('/create-assignment')" class="action-btn">
              Create Assignment
            </button>
            <button @click="$router.push('/grade-submissions')" class="action-btn">
              Grade Submissions
            </button>
            <button @click="$router.push('/schedule-meeting')" class="action-btn">
              Schedule Meeting
            </button>
            <button @click="$router.push('/reports')" class="action-btn">
              Generate Reports
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
      teacherName: 'Prof. Sarah Wilson',
      department: 'Mathematics',
      classes: [
        {
          id: 1,
          name: 'Algebra I - Period 1',
          studentCount: 25,
          averageProgress: 78,
          averageScore: 82
        },
        {
          id: 2,
          name: 'Geometry - Period 3',
          studentCount: 22,
          averageProgress: 65,
          averageScore: 75
        },
        {
          id: 3,
          name: 'Pre-Calculus - Period 5',
          studentCount: 18,
          averageProgress: 85,
          averageScore: 88
        }
      ],
      studentAlerts: [
        {
          id: 1,
          type: 'warning',
          icon: 'warning-icon',
          title: 'Low Performance Alert',
          description: 'Three students in Algebra I showing declining performance',
        },
        {
          id: 2,
          type: 'info',
          icon: 'info-icon',
          title: 'Assignment Due',
          description: 'Geometry homework due for grading (22 submissions)',
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
  methods: {
    handleLogout() {
      localStorage.removeItem('pathfinder_token')
      localStorage.removeItem('pathfinder_user_role')
      this.$router.push('/')
    },
    viewClass(class_) {
      this.$router.push(`/classes/${class_.id}`)
    },
    handleAlert(alert) {
      // Handle alert action
      console.log('Handling alert:', alert)
    },
    dismissAlert(alert) {
      // Dismiss alert logic
      console.log('Dismissing alert:', alert)
    },
    completeTask(task) {
      // Complete task logic
      console.log('Completing task:', task)
    }
  }
}
</script>

<style scoped>
.teacher-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.department {
  background-color: #2196F3;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.9em;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.class-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.student-count {
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9em;
}

.class-stats {
  margin-bottom: 15px;
}

.stat {
  margin-bottom: 10px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 5px 0;
}

.progress-fill {
  height: 100%;
  background-color: #2196F3;
  transition: width 0.3s ease;
}

.view-button {
  width: 100%;
  padding: 8px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.alert-card {
  display: flex;
  gap: 15px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.alert-icon {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-icon.warning {
  background-color: #FFC107;
  color: white;
}

.alert-icon.info {
  background-color: #2196F3;
  color: white;
}

.alert-content {
  flex: 1;
}

.alert-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.action-button {
  padding: 6px 12px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dismiss-button {
  padding: 6px 12px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.upcoming-tasks, .quick-actions {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-item {
  padding: 15px;
  background-color: #f8f8f8;
  border-radius: 6px;
}

.due-date {
  display: block;
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}

.due-date.urgent {
  color: #f44336;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  padding: 10px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-btn:hover {
  background-color: #1976D2;
}

.logout-button {
  padding: 8px 16px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .user-info {
    flex-direction: column;
  }
  
  .classes-grid {
    grid-template-columns: 1fr;
  }
  
  .alert-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .alert-actions {
    justify-content: center;
  }
}
</style> 