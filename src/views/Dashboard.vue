<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>Welcome to Your Dashboard</h1>
      <div class="user-info">
        <span>{{ userName }}</span>
        <button @click="handleLogout" class="logout-button">Logout</button>
      </div>
    </header>
    
    <div class="dashboard-content">
      <div class="dashboard-stats">
        <div class="stat-card">
          <h3>Progress</h3>
          <div class="progress-bar">
            <div :style="{ width: progress + '%' }" class="progress-fill"></div>
          </div>
          <span>{{ progress }}% Complete</span>
        </div>
        
        <div class="stat-card">
          <h3>Recent Activities</h3>
          <ul class="activity-list">
            <li v-for="(activity, index) in recentActivities" :key="index">
              {{ activity }}
            </li>
          </ul>
        </div>
      </div>
      
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button @click="$router.push('/profile')" class="action-button">
            View Profile
          </button>
          <button @click="$router.push('/courses')" class="action-button">
            My Courses
          </button>
          <button @click="$router.push('/assignments')" class="action-button">
            Assignments
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      userName: 'John Doe', // This should come from your auth system
      progress: 65,
      recentActivities: [
        'Completed Math Quiz - 95%',
        'Started Science Course',
        'Submitted English Assignment',
        'Earned Achievement Badge'
      ]
    }
  },
  methods: {
    handleLogout() {
      // Clear authentication
      localStorage.removeItem('pathfinder_token')
      localStorage.removeItem('pathfinder_user_role')
      // Redirect to home
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.dashboard-container {
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

.logout-button {
  padding: 8px 16px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #cc0000;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.dashboard-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.activity-list {
  list-style: none;
  padding: 0;
}

.activity-list li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.activity-list li:last-child {
  border-bottom: none;
}

.quick-actions {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.action-button {
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
}
</style> 