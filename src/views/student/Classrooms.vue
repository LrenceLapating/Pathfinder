<template>
  <div class="classrooms-page">
    <div class="page-header">
      <h1>My Classrooms</h1>
      <button class="join-btn" @click="openJoinClassroomModal">
        <i class="fas fa-plus"></i>
        Join Classroom
      </button>
    </div>

    <div class="classrooms-content">
      <!-- Active Classrooms Section -->
      <div class="classrooms-section">
        <h2>Active Classrooms</h2>
        
        <div v-if="activeClassrooms.length === 0" class="empty-state">
          <i class="fas fa-school"></i>
          <p>You haven't joined any active classrooms yet</p>
          <button class="join-btn" @click="openJoinClassroomModal">Join a Classroom</button>
        </div>
        
        <div v-else class="classrooms-grid">
          <div v-for="classroom in activeClassrooms" :key="classroom.id" class="classroom-card">
            <div class="classroom-banner" :style="{ backgroundColor: classroom.bannerColor }">
              <h3>{{ classroom.name }}</h3>
              <span class="subject-tag">{{ classroom.subject }}</span>
            </div>
            <div class="classroom-info">
              <div class="teacher-info">
                <img :src="classroom.teacherAvatar" :alt="classroom.teacher" class="teacher-avatar">
                <span class="teacher-name">{{ classroom.teacher }}</span>
              </div>
              <div class="classroom-stats">
                <div class="stat">
                  <i class="fas fa-users"></i>
                  <span>{{ classroom.studentsCount }} students</span>
                </div>
                <div class="stat">
                  <i class="fas fa-book"></i>
                  <span>{{ classroom.assignmentsCount }} assignments</span>
                </div>
              </div>
              <router-link :to="`/student/classroom/${classroom.id}`" class="view-classroom-btn">
                <i class="fas fa-arrow-right"></i>
                View Classroom
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Archived Classrooms Section -->
      <div v-if="archivedClassrooms.length > 0" class="classrooms-section archived">
        <h2>Archived Classrooms</h2>
        <div class="classrooms-grid">
          <div v-for="classroom in archivedClassrooms" :key="classroom.id" class="classroom-card archived">
            <div class="classroom-banner" :style="{ backgroundColor: classroom.bannerColor }">
              <h3>{{ classroom.name }}</h3>
              <span class="subject-tag">{{ classroom.subject }}</span>
              <div class="archived-badge">
                <i class="fas fa-archive"></i>
                Archived
              </div>
            </div>
            <div class="classroom-info">
              <div class="teacher-info">
                <img :src="classroom.teacherAvatar" :alt="classroom.teacher" class="teacher-avatar">
                <span class="teacher-name">{{ classroom.teacher }}</span>
              </div>
              <div class="classroom-stats">
                <div class="stat">
                  <i class="fas fa-users"></i>
                  <span>{{ classroom.studentsCount }} students</span>
                </div>
                <div class="stat">
                  <i class="fas fa-book"></i>
                  <span>{{ classroom.assignmentsCount }} assignments</span>
                </div>
              </div>
              <router-link :to="`/student/classroom/${classroom.id}`" class="view-classroom-btn">
                <i class="fas fa-arrow-right"></i>
                View Classroom
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Join Classroom Modal -->
    <transition name="fade">
      <div v-if="showJoinClassroomModal" class="modal-overlay" @click.self="closeJoinClassroomModal">
        <div class="modal-container">
          <div class="modal-header">
            <h2>Join Classroom</h2>
            <button @click="closeJoinClassroomModal" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>Enter the classroom code provided by your teacher to join.</p>
            <div class="input-group">
              <input 
                type="text" 
                v-model="classroomCode" 
                placeholder="Enter classroom code"
                :disabled="joiningClass"
              >
              <button 
                @click="joinClassroom" 
                :disabled="!classroomCode || joiningClass"
                class="join-btn"
              >
                <i v-if="joiningClass" class="fas fa-spinner fa-spin"></i>
                <span v-else>Join</span>
              </button>
            </div>
            <div v-if="joinError" class="error-message">
              {{ joinError }}
            </div>
            <div v-if="joinSuccess" class="success-message">
              <i class="fas fa-check-circle"></i>
              {{ joinSuccess }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Classrooms',
  data() {
    return {
      showJoinClassroomModal: false,
      classroomCode: '',
      joiningClass: false,
      joinError: '',
      joinSuccess: '',
      activeClassrooms: [
        {
          id: 1,
          name: 'Advanced Mathematics',
          subject: 'Mathematics',
          teacher: 'Dr. Smith',
          teacherAvatar: 'https://via.placeholder.com/40',
          studentsCount: 24,
          assignmentsCount: 8,
          bannerColor: '#4A6572'
        },
        {
          id: 2,
          name: 'Introduction to Calculus',
          subject: 'Mathematics',
          teacher: 'Prof. Johnson',
          teacherAvatar: 'https://via.placeholder.com/40',
          studentsCount: 18,
          assignmentsCount: 5,
          bannerColor: '#6A8D92'
        },
        {
          id: 3,
          name: 'Physics 101',
          subject: 'Physics',
          teacher: 'Dr. Williams',
          teacherAvatar: 'https://via.placeholder.com/40',
          studentsCount: 22,
          assignmentsCount: 6,
          bannerColor: '#344955'
        }
      ],
      archivedClassrooms: [
        {
          id: 4,
          name: 'Basic Algebra',
          subject: 'Mathematics',
          teacher: 'Ms. Davis',
          teacherAvatar: 'https://via.placeholder.com/40',
          studentsCount: 20,
          assignmentsCount: 10,
          bannerColor: '#808080'
        }
      ]
    }
  },
  methods: {
    openJoinClassroomModal() {
      this.showJoinClassroomModal = true
      this.classroomCode = ''
      this.joinError = ''
      this.joinSuccess = ''
    },
    closeJoinClassroomModal() {
      if (!this.joiningClass) {
        this.showJoinClassroomModal = false
      }
    },
    joinClassroom() {
      this.joiningClass = true
      this.joinError = ''
      this.joinSuccess = ''
      
      // Simulate API call
      setTimeout(() => {
        if (this.classroomCode === 'MATH101' || this.classroomCode === 'PHYS202' || this.classroomCode === 'BIO303') {
          // Success case
          this.joinSuccess = 'Classroom joined successfully!'
          
          // Add new classroom to the list
          const classroomNames = {
            'MATH101': 'Introduction to Algebra',
            'PHYS202': 'Advanced Physics',
            'BIO303': 'Molecular Biology'
          }
          
          const subjectMap = {
            'MATH101': 'Mathematics',
            'PHYS202': 'Physics',
            'BIO303': 'Biology'
          }
          
          const teacherMap = {
            'MATH101': 'Prof. Anderson',
            'PHYS202': 'Dr. Maxwell',
            'BIO303': 'Dr. Carter'
          }
          
          const colorMap = {
            'MATH101': '#5C6BC0',
            'PHYS202': '#26A69A',
            'BIO303': '#66BB6A'
          }
          
          const newClassroom = {
            id: Date.now(),
            name: classroomNames[this.classroomCode],
            subject: subjectMap[this.classroomCode],
            teacher: teacherMap[this.classroomCode],
            teacherAvatar: 'https://via.placeholder.com/40',
            studentsCount: Math.floor(Math.random() * 10) + 15,
            assignmentsCount: Math.floor(Math.random() * 5) + 1,
            bannerColor: colorMap[this.classroomCode]
          }
          
          this.activeClassrooms.push(newClassroom)
          
          // Clear code after successful join
          this.classroomCode = ''
          
          // Close modal after 1.5 seconds
          setTimeout(() => {
            this.closeJoinClassroomModal()
          }, 1500)
        } else {
          // Error case
          this.joinError = 'Invalid classroom code. Please check and try again.'
        }
        this.joiningClass = false
      }, 1500)
    }
  }
}
</script>

<style scoped>
.classrooms-page {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 2rem 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #1a237e;
}

.join-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #1a237e;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.join-btn:hover {
  background-color: #0e1358;
}

.classrooms-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.classrooms-section {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.classrooms-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  color: #333;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  color: #757575;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #bdbdbd;
}

.empty-state p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.classrooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.classroom-card {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.classroom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.classroom-card.archived {
  opacity: 0.8;
}

.classroom-banner {
  padding: 1.5rem;
  color: white;
  position: relative;
}

.classroom-banner h3 {
  margin: 0;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.subject-tag {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.archived-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.classroom-info {
  padding: 1.5rem;
  background-color: white;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.teacher-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.teacher-name {
  font-weight: 600;
  color: #333;
}

.classroom-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #757575;
  font-size: 0.9rem;
}

.view-classroom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #f5f5f5;
  color: #333;
  text-decoration: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.view-classroom-btn:hover {
  background-color: #e0e0e0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-container {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1A1A1A;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #C84C1C;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin-top: 0;
  margin-bottom: 1.25rem;
  color: #555;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.input-group input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.error-message {
  color: #c62828;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.success-message {
  color: #2e7d32;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .classrooms-page {
    padding: 1.5rem 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .classrooms-grid {
    grid-template-columns: 1fr;
  }
}
</style> 