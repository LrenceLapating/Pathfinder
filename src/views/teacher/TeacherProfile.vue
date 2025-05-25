<template>
  <div class="teacher-profile">
    <div class="header">
      <h1>Teacher Profile</h1>
      <p class="subtitle">View and manage your profile information</p>
    </div>
    
    <div class="profile-content">
      <div class="profile-card">
        <div class="profile-header">
          <img :src="teacher.avatar" :alt="teacher.name" class="profile-avatar" />
          <div class="profile-info">
            <h2>{{ teacher.name }}</h2>
            <p>{{ teacher.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeacherProfile',
  
  data() {
    return {
      teacher: {
        name: 'Sarah Johnson',
        role: 'Mathematics Teacher',
        avatar: '/avatars/teacher1.jpg'
      }
    }
  }
}
</script>

<style scoped>
.teacher-profile {
  padding: 1.5rem;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  font-size: 1.875rem;
  color: #1E293B;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  color: #64748B;
}

.profile-content {
  display: grid;
  gap: 1.5rem;
}

.profile-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1E293B;
}

.profile-info p {
  margin: 0.25rem 0 0 0;
  font-size: 1rem;
  color: #64748B;
}
</style> 