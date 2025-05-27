<template>
  <div class="student-profile">
    <div class="profile-header">
      <h1>Student Profile</h1>
    </div>

    <div class="profile-content">
      <div class="profile-card">
        <div class="profile-info">
          <div class="avatar">
            <img src="https://via.placeholder.com/150" alt="Student avatar">
          </div>
          <div class="info-details">
            <h2>Alex Johnson</h2>
            <p class="student-id">ID: ST-12345</p>
            <p class="student-grade">Grade: 10</p>
            <p class="student-email">alex.johnson@example.com</p>
          </div>
        </div>

        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-value">78%</span>
            <span class="stat-label">Average Score</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">12</span>
            <span class="stat-label">Quizzes Taken</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">3</span>
            <span class="stat-label">Classes Joined</span>
          </div>
        </div>
      </div>

      <div class="profile-actions">
        <button class="action-btn">
          <i class="fas fa-cog"></i>
          Edit Profile
        </button>
        <button class="action-btn">
          <i class="fas fa-lock"></i>
          Change Password
        </button>
        <button class="action-btn">
          <i class="fas fa-bell"></i>
          Notification Settings
        </button>
      </div>

      <div class="profile-section">
        <h2>Enrolled Classes</h2>
        <div class="classes-grid">
          <div class="class-card">
            <div class="class-header">
              <h3>Advanced Mathematics</h3>
              <span class="class-badge">Mathematics</span>
            </div>
            <div class="class-details">
              <p><i class="fas fa-user-tie"></i> Dr. Smith</p>
              <p><i class="fas fa-calendar-alt"></i> Mon, Wed, Fri</p>
              <p><i class="fas fa-chart-line"></i> 85% Progress</p>
            </div>
            <router-link to="/student/classroom/1" class="view-class-btn">
              View Class
            </router-link>
          </div>
          <div class="class-card">
            <div class="class-header">
              <h3>Introduction to Calculus</h3>
              <span class="class-badge">Mathematics</span>
            </div>
            <div class="class-details">
              <p><i class="fas fa-user-tie"></i> Prof. Johnson</p>
              <p><i class="fas fa-calendar-alt"></i> Tue, Thu</p>
              <p><i class="fas fa-chart-line"></i> 72% Progress</p>
            </div>
            <router-link to="/student/classroom/2" class="view-class-btn">
              View Class
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentProfile'
}
</script>

<style scoped>
.student-profile {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 2rem 1.5rem;
}

.profile-header {
  margin-bottom: 2rem;
  text-align: center;
}

.profile-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #1a237e;
}

.profile-content {
  max-width: 900px;
  margin: 0 auto;
}

.profile-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.profile-info {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.info-details h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.info-details p {
  margin: 0.5rem 0;
  color: #616161;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a237e;
}

.stat-label {
  font-size: 0.9rem;
  color: #757575;
  margin-top: 0.25rem;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f5f5f5;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: #333;
  cursor: pointer;
}

.profile-section {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.profile-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  color: #333;
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.class-card {
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.class-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.class-badge {
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.class-details {
  margin-bottom: 1rem;
}

.class-details p {
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #616161;
}

.view-class-btn {
  display: block;
  text-align: center;
  background-color: #1a237e;
  color: white;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .student-profile {
    padding: 1.5rem 1rem;
  }
  
  .profile-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }
  
  .profile-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 