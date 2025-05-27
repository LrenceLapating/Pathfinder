<template>
  <div class="classroom-detail">
    <div class="classroom-header" :style="{ backgroundColor: classroom.bannerColor }">
      <div class="header-content">
        <div class="back-btn-container">
          <router-link to="/student/classrooms" class="back-btn">
            <i class="fas fa-arrow-left"></i>
          </router-link>
        </div>
        <h1>{{ classroom.name }}</h1>
        <div class="subject-tag">{{ classroom.subject }}</div>
        <div class="teacher-info">
          <img :src="classroom.teacherAvatar" :alt="classroom.teacher" class="teacher-avatar">
          <span class="teacher-name">{{ classroom.teacher }}</span>
        </div>
      </div>
    </div>

    <div class="classroom-content">
      <div class="content-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon"></i>
          {{ tab.name }}
        </button>
      </div>

      <div class="tab-content">
        <!-- Stream Tab -->
        <div v-if="activeTab === 'stream'" class="stream-tab">
          <div class="announcement-form">
            <div class="form-header">
              <img :src="userAvatar" alt="You" class="user-avatar">
              <input 
                type="text" 
                placeholder="Share something with your class..." 
                class="announcement-input"
                @click="showAnnouncementForm = true"
                v-if="!showAnnouncementForm"
              >
            </div>
            <div v-if="showAnnouncementForm" class="form-expanded">
              <textarea 
                placeholder="Share something with your class..." 
                class="announcement-textarea"
                v-model="announcementText"
              ></textarea>
              <div class="form-actions">
                <button class="cancel-btn" @click="cancelAnnouncement">Cancel</button>
                <button 
                  class="post-btn" 
                  :disabled="!announcementText.trim()" 
                  @click="postAnnouncement"
                >
                  Post
                </button>
              </div>
            </div>
          </div>

          <div class="stream-content">
            <div v-for="(item, index) in streamItems" :key="index" class="stream-item">
              <div class="item-header">
                <img :src="item.authorAvatar" :alt="item.author" class="author-avatar">
                <div class="item-meta">
                  <div class="author-name">{{ item.author }}</div>
                  <div class="item-time">{{ item.time }}</div>
                </div>
              </div>
              <div class="item-content">
                <p>{{ item.content }}</p>
                <div v-if="item.attachment" class="item-attachment">
                  <i class="fas fa-file-pdf"></i>
                  <span>{{ item.attachment }}</span>
                </div>
              </div>
              <div class="item-actions">
                <button class="action-btn">
                  <i class="far fa-comment"></i>
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Classmates Tab -->
        <div v-if="activeTab === 'people'" class="people-tab">
          <div class="people-section">
            <h2>Teacher</h2>
            <div class="person-card teacher-card">
              <img :src="classroom.teacherAvatar" :alt="classroom.teacher" class="person-avatar">
              <div class="person-info">
                <div class="person-name">{{ classroom.teacher }}</div>
                <div class="person-role">Teacher</div>
              </div>
            </div>
          </div>

          <div class="people-section">
            <h2>Classmates ({{ classmates.length }})</h2>
            <div class="classmates-list">
              <div v-for="(classmate, index) in classmates" :key="index" class="person-card">
                <img :src="classmate.avatar" :alt="classmate.name" class="person-avatar">
                <div class="person-info">
                  <div class="person-name">{{ classmate.name }}</div>
                  <div class="person-role">Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Assignments Tab -->
        <div v-if="activeTab === 'assignments'" class="assignments-tab">
          <div v-if="assignments.length === 0" class="empty-state">
            <i class="fas fa-book"></i>
            <p>No assignments yet</p>
          </div>
          <div v-else class="assignments-list">
            <div v-for="(assignment, index) in assignments" :key="index" class="assignment-card">
              <div class="assignment-icon">
                <i class="fas fa-clipboard-list"></i>
              </div>
              <div class="assignment-details">
                <div class="assignment-title">{{ assignment.title }}</div>
                <div class="assignment-meta">
                  <span class="assignment-due">Due: {{ assignment.dueDate }}</span>
                  <span :class="['assignment-status', assignment.status]">{{ assignment.status }}</span>
                </div>
              </div>
              <div class="assignment-actions">
                <button class="view-btn">View</button>
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
  name: 'ClassroomDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      activeTab: 'stream',
      showAnnouncementForm: false,
      announcementText: '',
      userAvatar: 'https://via.placeholder.com/40',
      tabs: [
        { id: 'stream', name: 'Stream', icon: 'fas fa-stream' },
        { id: 'assignments', name: 'Assignments', icon: 'fas fa-clipboard-list' },
        { id: 'people', name: 'People', icon: 'fas fa-users' }
      ],
      classroom: {
        id: 1,
        name: 'Advanced Mathematics',
        subject: 'Mathematics',
        teacher: 'Dr. Smith',
        teacherAvatar: 'https://via.placeholder.com/40',
        studentsCount: 24,
        assignmentsCount: 8,
        bannerColor: '#4A6572'
      },
      streamItems: [
        {
          author: 'Dr. Smith',
          authorAvatar: 'https://via.placeholder.com/40',
          time: 'Yesterday at 3:45 PM',
          content: 'Welcome to Advanced Mathematics! I\'ve posted the syllabus and first week\'s materials. Please review them before our next class.',
          attachment: 'Syllabus_AdvMath.pdf'
        },
        {
          author: 'Dr. Smith',
          authorAvatar: 'https://via.placeholder.com/40',
          time: '2 days ago',
          content: 'Don\'t forget that your first quiz will be next Friday. It will cover chapters 1-3 from the textbook.'
        }
      ],
      classmates: [
        { name: 'Emma Johnson', avatar: 'https://via.placeholder.com/40' },
        { name: 'Michael Chen', avatar: 'https://via.placeholder.com/40' },
        { name: 'Sophia Rodriguez', avatar: 'https://via.placeholder.com/40' },
        { name: 'James Wilson', avatar: 'https://via.placeholder.com/40' },
        { name: 'Olivia Kim', avatar: 'https://via.placeholder.com/40' },
        { name: 'Noah Davis', avatar: 'https://via.placeholder.com/40' },
        { name: 'Ava Martinez', avatar: 'https://via.placeholder.com/40' },
        { name: 'Ethan Thompson', avatar: 'https://via.placeholder.com/40' }
      ],
      assignments: [
        {
          title: 'Linear Equations Problem Set',
          dueDate: 'Sep 15, 2023',
          status: 'completed'
        },
        {
          title: 'Quadratic Functions Quiz',
          dueDate: 'Sep 22, 2023',
          status: 'pending'
        },
        {
          title: 'Calculus Introduction',
          dueDate: 'Sep 30, 2023',
          status: 'not-started'
        }
      ]
    }
  },
  methods: {
    cancelAnnouncement() {
      this.showAnnouncementForm = false
      this.announcementText = ''
    },
    postAnnouncement() {
      if (this.announcementText.trim()) {
        this.streamItems.unshift({
          author: 'You',
          authorAvatar: this.userAvatar,
          time: 'Just now',
          content: this.announcementText
        })
        this.announcementText = ''
        this.showAnnouncementForm = false
      }
    }
  },
  mounted() {
    // In a real app, you would fetch the classroom data based on the ID
    console.log(`Fetching classroom with ID: ${this.id}`)
    
    // Simulate fetching data for different classrooms
    const classroomData = {
      '1': {
        name: 'Advanced Mathematics',
        subject: 'Mathematics',
        teacher: 'Dr. Smith',
        bannerColor: '#4A6572'
      },
      '2': {
        name: 'Introduction to Calculus',
        subject: 'Mathematics',
        teacher: 'Prof. Johnson',
        bannerColor: '#6A8D92'
      },
      '3': {
        name: 'Physics 101',
        subject: 'Physics',
        teacher: 'Dr. Williams',
        bannerColor: '#344955'
      }
    }
    
    if (classroomData[this.id]) {
      this.classroom = {
        ...this.classroom,
        ...classroomData[this.id]
      }
    }
  }
}
</script>

<style scoped>
.classroom-detail {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.classroom-header {
  padding: 2rem 1.5rem;
  color: white;
  position: relative;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.back-btn-container {
  margin-bottom: 1rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.classroom-header h1 {
  margin: 0;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.subject-tag {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.teacher-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.teacher-name {
  font-weight: 600;
}

.classroom-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.content-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1.5rem;
  background-color: white;
  border-radius: 0.5rem 0.5rem 0 0;
  overflow: hidden;
}

.tab-btn {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #757575;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
}

.tab-btn.active {
  color: #1a237e;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #1a237e;
}

.tab-btn i {
  font-size: 1.1rem;
}

.tab-content {
  background-color: white;
  border-radius: 0 0 0.5rem 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Stream Tab */
.announcement-form {
  background-color: #f5f5f5;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.announcement-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  cursor: text;
}

.form-expanded {
  margin-top: 1rem;
}

.announcement-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: #757575;
  cursor: pointer;
  font-weight: 600;
  border-radius: 0.25rem;
}

.cancel-btn:hover {
  background-color: #f0f0f0;
}

.post-btn {
  padding: 0.5rem 1rem;
  background-color: #1a237e;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 600;
}

.post-btn:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.stream-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stream-item {
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.item-meta {
  flex: 1;
}

.author-name {
  font-weight: 600;
  color: #333;
}

.item-time {
  font-size: 0.85rem;
  color: #757575;
}

.item-content {
  padding: 1rem;
}

.item-content p {
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.item-attachment {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #f5f5f5;
  border-radius: 0.25rem;
  color: #1a237e;
  width: fit-content;
}

.item-actions {
  padding: 0.75rem 1rem;
  border-top: 1px solid #e0e0e0;
}

.action-btn {
  background: none;
  border: none;
  color: #757575;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.action-btn:hover {
  color: #1a237e;
}

/* People Tab */
.people-section {
  margin-bottom: 2rem;
}

.people-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: #333;
}

.person-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.person-card:last-child {
  border-bottom: none;
}

.teacher-card {
  background-color: #f5f5f5;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.person-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.person-name {
  font-weight: 600;
  color: #333;
}

.person-role {
  font-size: 0.85rem;
  color: #757575;
}

.classmates-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
}

/* Assignments Tab */
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
  font-size: 1.1rem;
}

.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assignment-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  background-color: white;
}

.assignment-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a237e;
}

.assignment-details {
  flex: 1;
}

.assignment-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.assignment-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
}

.assignment-due {
  color: #757575;
}

.assignment-status {
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.assignment-status.completed {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.assignment-status.pending {
  background-color: #fff3e0;
  color: #ef6c00;
}

.assignment-status.not-started {
  background-color: #f5f5f5;
  color: #757575;
}

.assignment-actions {
  display: flex;
  align-items: center;
}

.view-btn {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 600;
}

.view-btn:hover {
  background-color: #e0e0e0;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .classroom-header {
    padding: 1.5rem 1rem;
  }
  
  .classroom-header h1 {
    font-size: 1.5rem;
  }
  
  .classroom-content {
    padding: 1rem;
  }
  
  .content-tabs {
    overflow-x: auto;
  }
  
  .tab-btn {
    padding: 0.75rem 1rem;
    white-space: nowrap;
  }
  
  .tab-content {
    padding: 1rem;
  }
  
  .assignment-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style> 