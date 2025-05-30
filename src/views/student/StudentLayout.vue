<template>
  <div class="student-layout">
    <!-- Sidebar Navigation -->
    <nav class="sidebar" :class="{ 'collapsed': isSidebarCollapsed }" @mouseenter="expandSidebar" @mouseleave="collapseSidebar">
      <div class="sidebar-header">
        <div class="logo-container" title="PathFinder">
          <img :src="compassLogo" alt="PathFinder" class="logo" />
        </div>
        <span v-if="!isSidebarCollapsed" class="logo-text">PathFinder</span>
        <button class="collapse-btn" @click="toggleSidebar" aria-label="Toggle sidebar">
          <i :class="isSidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
        </button>
      </div>

      <div class="nav-links">
        <div class="nav-section">
          <span v-if="!isSidebarCollapsed" class="section-title">MAIN</span>
          
          <router-link to="/student" class="nav-link" exact>
            <div class="link-icon">
              <i class="fas fa-home"></i>
            </div>
            <div v-if="!isSidebarCollapsed" class="link-content">
              <span class="link-text">Dashboard</span>
              <span class="hover-indicator"></span>
            </div>
          </router-link>

          <router-link to="/student/performance" class="nav-link">
            <div class="link-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div v-if="!isSidebarCollapsed" class="link-content">
              <span class="link-text">Performance</span>
              <span class="hover-indicator"></span>
            </div>
          </router-link>
        </div>
        
        <div class="nav-section">
          <span v-if="!isSidebarCollapsed" class="section-title">LEARNING</span>

          <router-link to="/student/classrooms" class="nav-link">
            <div class="link-icon">
              <i class="fas fa-users"></i>
            </div>
            <div v-if="!isSidebarCollapsed" class="link-content">
              <span class="link-text">Classrooms</span>
              <span class="hover-indicator"></span>
            </div>
          </router-link>

          <router-link to="/student/study-guide" class="nav-link">
            <div class="link-icon">
              <i class="fas fa-book-open"></i>
            </div>
            <div v-if="!isSidebarCollapsed" class="link-content">
              <span class="link-text">Study Guides</span>
              <span class="hover-indicator"></span>
            </div>
          </router-link>

          <router-link to="/student/quiz-review" class="nav-link">
            <div class="link-icon">
              <i class="fas fa-clipboard-check"></i>
            </div>
            <div v-if="!isSidebarCollapsed" class="link-content">
              <span class="link-text">Quiz Review</span>
              <span class="hover-indicator"></span>
            </div>
          </router-link>
        </div>
        
        <div class="nav-section">
          <span v-if="!isSidebarCollapsed" class="section-title">USER</span>

          <router-link to="/student/profile" class="nav-link">
            <div class="link-icon">
              <i class="fas fa-user"></i>
            </div>
            <div v-if="!isSidebarCollapsed" class="link-content">
              <span class="link-text">Profile</span>
              <span class="hover-indicator"></span>
            </div>
          </router-link>
        </div>
      </div>

      <div class="sidebar-footer">
        <!-- Empty footer to maintain spacing -->
      </div>
    </nav>

    <!-- Main Content -->
    <div class="main-content" :class="{ 'expanded': isSidebarCollapsed }">
      <!-- Top Bar -->
      <div class="top-bar">
        <div class="breadcrumb">
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="user-menu">
          <div class="notifications">
            <button class="notification-btn" @click="toggleNotifications">
              <i class="fas fa-bell"></i>
              <span v-if="unreadNotifications" class="notification-badge">
                {{ unreadNotifications }}
              </span>
            </button>
          </div>
          <div class="join-class">
            <button class="join-class-btn" @click="toggleJoinClassroom" title="Join Classroom">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="profile-menu" @click="toggleProfileMenu">
            <img :src="userAvatar" :alt="userName" class="avatar" />
            <span class="user-name">{{ userName }}</span>
            <i class="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <div class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>

    <!-- Notifications Panel -->
    <transition name="slide-fade">
      <div v-if="showNotifications" class="notifications-panel">
        <div class="panel-header">
          <h2>Notifications</h2>
          <button @click="toggleNotifications">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div v-if="notifications.length === 0" class="empty-notifications">
          <i class="fas fa-bell-slash"></i>
          <p>No notifications yet</p>
        </div>
        <div v-else class="notifications-list">
          <transition-group name="list" tag="div">
            <div v-for="notification in notifications" 
                :key="notification.id"
                :class="['notification-item', { 'unread': !notification.read }]">
              <div class="notification-icon">
                <i :class="notification.icon"></i>
              </div>
              <div class="notification-content">
                <p class="notification-text">{{ notification.message }}</p>
                <span class="notification-time">{{ notification.time }}</span>
              </div>
              <button class="mark-read-btn" @click="markAsRead(notification.id)" v-if="!notification.read">
                <i class="fas fa-check"></i>
              </button>
            </div>
          </transition-group>
        </div>
        <div class="panel-footer" v-if="notifications.length > 0">
          <button @click="markAllAsRead" class="mark-all-btn">Mark all as read</button>
        </div>
      </div>
    </transition>

    <!-- Profile Menu -->
    <transition name="slide-fade">
      <div v-if="showProfileMenu" class="profile-dropdown">
        <div class="dropdown-item" @click="navigateToProfile">
          <i class="fas fa-user"></i>
          My Profile
        </div>
        <div class="dropdown-item" @click="navigateToSettings">
          <i class="fas fa-cog"></i>
          Settings
        </div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </div>
      </div>
    </transition>

    <!-- Join Classroom Modal -->
    <transition name="fade">
      <div v-if="showJoinClassroom" class="modal-overlay" @click.self="toggleJoinClassroom">
        <div class="modal-container">
          <div class="modal-header">
            <h2>Join Classroom</h2>
            <button @click="toggleJoinClassroom" class="close-btn">
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
import signInImage from '@/assets/images/Pathfinder-logo.png'

export default {
  name: 'StudentLayout',
  components: {
  },
  data() {
    return {
      isSidebarCollapsed: true,
      hoverEnabled: true,
      showNotifications: false,
      showProfileMenu: false,
      showJoinClassroom: false,
      classroomCode: '',
      joiningClass: false,
      joinError: '',
      joinSuccess: '',
      userName: '',
      userAvatar: '/path/to/avatar.jpg',
      unreadNotifications: 3,
      compassLogo: signInImage,
      notifications: [
        {
          id: 1,
          message: 'New quiz available in Mathematics',
          time: '5 minutes ago',
          read: false,
          icon: 'fas fa-question-circle'
        },
        {
          id: 2,
          message: 'Your last quiz score: 85%',
          time: '1 hour ago',
          read: false,
          icon: 'fas fa-star'
        },
        {
          id: 3,
          message: 'New module unlocked: Advanced Algebra',
          time: '2 hours ago',
          read: false,
          icon: 'fas fa-unlock'
        }
      ]
    }
  },
  computed: {
    pageTitle() {
      // Map routes to titles
      const routeTitles = {
        'student-dashboard': 'Dashboard',
        'student-performance': 'Performance Tracker',
        'student-profile': 'My Profile',
        'student-classrooms': 'My Classrooms',
        'student-classroom-detail': 'Classroom',
        'study-guide': 'Personalized Study Guides',
        'study-guide-detail': 'Study Guide',
        'quiz-review': 'Quiz & Exam Review',
        'quiz-review-detail': 'Quiz Review'
      }
      return routeTitles[this.$route.name] || 'Dashboard'
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
      // Store sidebar state in localStorage for persistence
      localStorage.setItem('pathfinder_sidebar_collapsed', this.isSidebarCollapsed.toString())
      this.hoverEnabled = false;
      
      // Re-enable hover after a delay
      setTimeout(() => {
        this.hoverEnabled = true;
      }, 1500);
      
      this.$emit('sidebar-toggle', this.isSidebarCollapsed)
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
      this.showProfileMenu = false
      this.showJoinClassroom = false
    },
    toggleJoinClassroom() {
      this.showJoinClassroom = !this.showJoinClassroom
      this.showProfileMenu = false
      this.showNotifications = false
      
      // Reset state when opening
      if (this.showJoinClassroom) {
        this.classroomCode = ''
        this.joinError = ''
        this.joinSuccess = ''
      }
    },
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu
      this.showNotifications = false
      this.showJoinClassroom = false
    },
    navigateToProfile() {
      this.$router.push('/student/profile')
      this.showProfileMenu = false
    },
    navigateToSettings() {
      // Implement settings navigation
      this.showProfileMenu = false
    },
    logout() {
      // Implement logout logic
      localStorage.removeItem('pathfinder_token')
      localStorage.removeItem('pathfinder_user_role')
      this.$router.push('/')
    },
    markAsRead(id) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification) {
        notification.read = true
        this.updateUnreadCount()
      }
    },
    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.read = true
      })
      this.updateUnreadCount()
    },
    updateUnreadCount() {
      this.unreadNotifications = this.notifications.filter(n => !n.read).length
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
          
          // Add notification
          this.notifications.unshift({
            id: Date.now(),
            message: `You've joined a new classroom: ${this.getClassroomName(this.classroomCode)}`,
            time: 'Just now',
            read: false,
            icon: 'fas fa-users'
          })
          this.updateUnreadCount()
          
          // Clear code after successful join
          this.classroomCode = ''
          
          // Close modal after 1.5 seconds
          setTimeout(() => {
            this.toggleJoinClassroom()
          }, 1500)
        } else {
          // Error case
          this.joinError = 'Invalid classroom code. Please check and try again.'
        }
        this.joiningClass = false
      }, 1500)
    },
    getClassroomName(code) {
      const classrooms = {
        'MATH101': 'Introduction to Calculus',
        'PHYS202': 'Advanced Physics',
        'BIO303': 'Molecular Biology'
      }
      return classrooms[code] || 'Unknown Classroom'
    },
    expandSidebar() {
      if (this.hoverEnabled) {
        this.isSidebarCollapsed = false
      }
    },
    collapseSidebar() {
      if (this.hoverEnabled) {
        this.isSidebarCollapsed = true
      }
    }
  },
  mounted() {
    // Load user data from localStorage
    const userDataStr = localStorage.getItem('pathfinder_user');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        this.userName = userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}` 
          : userData.email || 'User';
          
        if (userData.profilePicture) {
          this.userAvatar = userData.profilePicture;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.userName = 'User';
      }
    }
    
    // Load sidebar state from localStorage
    const savedState = localStorage.getItem('pathfinder_sidebar_collapsed')
    if (savedState !== null) {
      this.isSidebarCollapsed = savedState === 'true'
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.notifications') && !e.target.closest('.notifications-panel')) {
        this.showNotifications = false
      }
      if (!e.target.closest('.profile-menu') && !e.target.closest('.profile-dropdown')) {
        this.showProfileMenu = false
      }
      if (!e.target.closest('.join-class') && !e.target.closest('.modal-container') && this.showJoinClassroom) {
        // Only close if clicking outside and not in the middle of joining
        if (!this.joiningClass) {
          this.toggleJoinClassroom()
        }
      }
    })

    // Check for mobile view and collapse sidebar by default
    const handleResize = () => {
      if (window.innerWidth < 768 && !this.isSidebarCollapsed) {
        this.isSidebarCollapsed = true
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize() // Initial check
    
    // Clean up event listener when component is destroyed
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', handleResize)
    })
  }
}
</script>

<style scoped>
/* Base Styles */
.student-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Sidebar Styles */
.sidebar {
  width: 250px;
  background: #1a1a1a;
  color: white;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  z-index: 100;
  height: 100vh;
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding: 1.25rem 0.5rem;
  align-items: center;
}

.sidebar.collapsed .logo-container {
  margin: 0 auto;
}

.sidebar-header {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  position: relative;
  height: 60px;
  box-sizing: border-box;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 50%;
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  border: 2px solid var(--dl-color-theme-primary1, #fb8500);
}

.logo {
  width: 119%;
  height: 119%;
  object-fit: cover;
  padding: 4px;
  border-radius: 50%;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: white;
  margin-left: 12px;
}

.collapse-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 5;
  margin-left: auto;
  font-size: 0.8rem;
}

.collapse-btn:hover {
  color: white;
}

.nav-links {
  padding: 0.5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
}

.nav-section {
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.section-title {
  padding: 0 1.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255,255,255,0.4);
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 0 8px 8px 0;
  margin-right: 0.75rem;
}

.link-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.1rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.link-content {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.link-text {
  font-size: 0.95rem;
  font-weight: 500;
  white-space: nowrap;
  transition: transform 0.3s ease;
}

.hover-indicator {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #C84C1C;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: white;
  background: rgba(255,255,255,0.05);
}

.nav-link.router-link-active {
  color: white;
  background: rgba(200, 76, 28, 0.1);
  border-left: 3px solid #C84C1C;
  padding-left: calc(1.5rem - 3px);
}

.nav-link:hover .hover-indicator,
.nav-link.router-link-active .hover-indicator {
  width: 100%;
}

.nav-link:hover .link-icon,
.nav-link.router-link-active .link-icon {
  color: #C84C1C;
}

.sidebar-footer {
  padding: 1.25rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  margin-top: auto;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: calc(100% - 250px);
}

.main-content.expanded {
  margin-left: 70px;
  width: calc(100% - 70px);
}

.top-bar {
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.breadcrumb h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1A1A1A;
  position: relative;
  display: inline-block;
}

.breadcrumb h1:after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 3px;
  background: #C84C1C;
  border-radius: 2px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.notification-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.notification-btn:hover {
  background: #f5f7fa;
  color: #C84C1C;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #C84C1C;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-weight: 600;
}

.join-class {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  transition: background 0.3s ease;
}

.join-class:hover {
  background: #f5f7fa;
  color: #C84C1C;
}

.profile-menu {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  transition: background 0.3s ease;
}

.profile-menu:hover {
  background: #f5f7fa;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.profile-menu:hover .avatar {
  transform: scale(1.05);
}

.user-name {
  font-weight: 500;
  color: #333;
}

.page-content {
  padding: 2rem;
  background: #f8fafc;
  min-height: calc(100vh - 70px);
}

/* Notifications Panel */
.notifications-panel {
  position: fixed;
  top: 70px;
  right: 20px;
  width: 350px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  z-index: 1000;
  overflow: hidden;
}

.panel-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1A1A1A;
}

.panel-header button {
  background: none;
  border: none;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.panel-header button:hover {
  background: #eee;
  color: #C84C1C;
}

.empty-notifications {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.empty-notifications i {
  font-size: 2rem;
  color: #ddd;
  margin-bottom: 1rem;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  transition: background 0.3s ease;
  align-items: center;
  position: relative;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: #fff6f2;
}

.notification-item.unread:hover {
  background: #fff0e8;
}

.notification-icon {
  width: 40px;
  height: 40px;
  background: rgba(200, 76, 28, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #C84C1C;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-text {
  margin: 0 0 0.3rem 0;
  color: #333;
}

.notification-time {
  font-size: 0.8rem;
  color: #888;
}

.mark-read-btn {
  background: none;
  border: none;
  color: #C84C1C;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  opacity: 0;
}

.notification-item:hover .mark-read-btn {
  opacity: 1;
}

.mark-read-btn:hover {
  background: rgba(200, 76, 28, 0.1);
}

.panel-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  text-align: center;
}

.mark-all-btn {
  background: none;
  border: none;
  color: #C84C1C;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.mark-all-btn:hover {
  opacity: 0.8;
}

/* Profile Dropdown */
.profile-dropdown {
  position: fixed;
  top: 70px;
  right: 20px;
  width: 200px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: background 0.3s ease;
  color: #333;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #C84C1C;
}

.dropdown-item i {
  width: 20px;
  color: #666;
}

.dropdown-item:hover i {
  color: #C84C1C;
}

.dropdown-divider {
  height: 1px;
  background: #eee;
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

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.slide-enter-active {
  transition: all 0.3s ease-out;
}

.slide-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Responsive Styles */
@media (max-width: 991px) {
  .sidebar {
    position: fixed;
    z-index: 1000;
    height: 100vh;
    transform: translateX(0);
    transition: transform 0.3s ease, width 0.3s ease;
  }
  
  .sidebar.collapsed {
    transform: translateX(-100%);
    width: 70px;
  }
  
  .main-content {
    width: 100%;
    margin-left: 250px;
  }
  
  .main-content.expanded {
    width: 100%;
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .top-bar {
    padding: 1rem;
  }
  
  .user-name {
    display: none;
  }
  
  .page-content {
    padding: 1rem;
  }
  
  .notifications-panel,
  .profile-dropdown {
    width: calc(100% - 40px);
  }
}

/* Join Classroom Button */
.join-class-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.join-class-btn:hover {
  background: #f5f5f5;
  color: #C84C1C;
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

.join-btn {
  background-color: #1a237e;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.join-btn:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
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
</style> 