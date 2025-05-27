<template>
  <div class="teacher-layout">
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
          
          <router-link to="/teacher" class="nav-link" exact>
            <div class="link-icon">
              <i class="fas fa-home"></i>
            </div>
            <div v-if="!isSidebarCollapsed" class="link-content">
              <span class="link-text">Dashboard</span>
              <span class="hover-indicator"></span>
            </div>
          </router-link>
        </div>
        
        <div class="nav-section">
          <span v-if="!isSidebarCollapsed" class="section-title">LEARNING</span>
          <router-link to="/teacher/classrooms" class="nav-link">
            <div class="link-icon">
              <i class="fas fa-chalkboard"></i>
            </div>
            <div v-if="!isSidebarCollapsed" class="link-content">
              <span class="link-text">Classrooms</span>
              <span class="hover-indicator"></span>
            </div>
          </router-link>
          <router-link to="/teacher/performance" class="nav-link">
            <div class="link-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div v-if="!isSidebarCollapsed" class="link-content">
              <span class="link-text">Performance</span>
              <span class="hover-indicator"></span>
            </div>
          </router-link>
          <router-link to="/teacher/score-upload" class="nav-link">
            <div class="link-icon">
              <i class="fas fa-upload"></i>
            </div>
            <div v-if="!isSidebarCollapsed" class="link-content">
              <span class="link-text">Upload Scores</span>
              <span class="hover-indicator"></span>
            </div>
          </router-link>
          <router-link to="/teacher/analytics" class="nav-link">
            <div class="link-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
            <div v-if="!isSidebarCollapsed" class="link-content">
              <span class="link-text">Analytics</span>
              <span class="hover-indicator"></span>
            </div>
          </router-link>
        </div>
        
        <div class="nav-section">
          <span v-if="!isSidebarCollapsed" class="section-title">USER</span>

          <router-link to="/teacher/profile" class="nav-link">
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
      <NotificationsPanel v-if="showNotifications" @close="toggleNotifications" />
    </transition>

    <!-- Profile Menu -->
    <transition name="slide-fade">
      <div v-if="showProfileMenu" class="profile-dropdown">
        <div class="dropdown-item" @click="navigateToProfile('profile')">
          <i class="fas fa-user"></i>
          My Profile
        </div>
        <div class="dropdown-item" @click="navigateToProfile('settings')">
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
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto'
import signInImage from '@/assets/images/Pathfinder-logo.png'
import NotificationsPanel from '@/components/teacher/NotificationsPanel.vue'

export default {
  name: 'TeacherLayout',
  
  components: {
    NotificationsPanel
  },
  
  data() {
    return {
      isSidebarCollapsed: true,
      hoverEnabled: true,
      showProfileMenu: false,
      showNotifications: false,
      compassLogo: signInImage,
      pageTitle: 'Dashboard',
      userName: 'Sarah Johnson',
      userAvatar: '/avatars/teacher1.jpg',
      unreadNotifications: 3,
      notifications: [
        {
          id: 1,
          message: 'Welcome to PathFinder Teacher Dashboard',
          time: 'Just now',
          icon: 'fas fa-info-circle',
          read: false
        }
      ]
    }
  },
  
  computed: {
    currentRoute() {
      return this.$route.path;
    }
  },
  
  watch: {
    currentRoute(newRoute) {
      this.updatePageTitle(newRoute);
    }
  },
  
  mounted() {
    this.updatePageTitle(this.$route.path);
  },
  
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
      this.hoverEnabled = false;
      
      // Re-enable hover after a delay
      setTimeout(() => {
        this.hoverEnabled = true;
      }, 1500);
    },
    
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
      if (this.showProfileMenu) {
        this.showNotifications = false;
      }
    },
    
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        this.showProfileMenu = false;
      }
    },
    
    updatePageTitle(route) {
      if (route.includes('/teacher/profile')) {
        this.pageTitle = 'Profile & Settings';
      } else if (route.includes('/teacher/classrooms')) {
        this.pageTitle = 'Classroom Management';
      } else if (route.includes('/teacher/classroom/')) {
        this.pageTitle = 'Classroom Detail';
      } else if (route.includes('/teacher/performance')) {
        this.pageTitle = 'Student Performance';
      } else if (route.includes('/teacher/score-upload')) {
        this.pageTitle = 'Upload Scores';
      } else if (route.includes('/teacher/analytics')) {
        this.pageTitle = 'Analytics';
      } else {
        this.pageTitle = 'Dashboard';
      }
    },
    
    navigateToProfile(tab = 'settings') {
      if (tab) {
        // Pass the active tab as a query parameter
        this.$router.push({ 
          path: '/teacher/profile',
          query: { tab }
        });
      }
      this.showProfileMenu = false;
    },
    
    logout() {
      localStorage.removeItem('pathfinder_token');
      localStorage.removeItem('pathfinder_user');
      localStorage.removeItem('pathfinder_user_role');
      this.$router.push('/');
    },
    
    markAsRead(notificationId) {
      const index = this.notifications.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        this.notifications[index].read = true;
        this.unreadNotifications = Math.max(0, this.unreadNotifications - 1);
      }
    },
    
    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.read = true;
      });
      this.unreadNotifications = 0;
    },
    
    expandSidebar() {
      if (this.hoverEnabled) {
        this.isSidebarCollapsed = false;
      }
    },
    
    collapseSidebar() {
      if (this.hoverEnabled) {
        this.isSidebarCollapsed = true;
      }
    }
  }
}
</script>

<style scoped>
/* This matches the styling from StudentLayout.vue */
.teacher-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Sidebar */
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

/* Main Content */
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
}

.notification-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 20px;
  cursor: pointer;
  transition: background 0.3s;
}

.notification-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff3e3e;
  color: #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-menu {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.3s;
}

.profile-menu:hover {
  background: rgba(0, 0, 0, 0.05);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  margin: 0 12px;
  font-weight: 500;
}

.page-content {
  flex-grow: 1;
  padding: 30px;
  overflow-y: auto;
}

/* Notifications Panel */
.notifications-panel {
  position: fixed;
  top: 70px;
  right: 0;
  width: 350px;
  height: calc(100vh - 70px);
  background-color: #fff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 90;
  display: flex;
  flex-direction: column;
}

.panel-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
}

.panel-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.panel-header button {
  background: transparent;
  border: none;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.3s;
}

.panel-header button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.empty-notifications {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #a0a0a0;
}

.empty-notifications i {
  font-size: 48px;
  margin-bottom: 12px;
}

.notifications-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  transition: background 0.3s;
}

.notification-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.notification-item.unread {
  background: rgba(59, 125, 221, 0.05);
}

.notification-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e6f0ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b7ddd;
  margin-right: 15px;
  flex-shrink: 0;
}

.notification-content {
  flex-grow: 1;
}

.notification-text {
  margin: 0 0 5px;
  font-size: 14px;
}

.notification-time {
  font-size: 12px;
  color: #a0a0a0;
}

.mark-read-btn {
  background: transparent;
  border: none;
  color: #3b7ddd;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-left: 10px;
  transition: background 0.3s;
}

.mark-read-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.panel-footer {
  height: 60px;
  border-top: 1px solid #eee;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
}

.mark-all-btn {
  background-color: transparent;
  color: #3b7ddd;
  border: 1px solid #3b7ddd;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.mark-all-btn:hover {
  background-color: #3b7ddd;
  color: #fff;
}

/* Profile Dropdown */
.profile-dropdown {
  position: absolute;
  top: 60px;
  right: 10px;
  width: 200px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  overflow: hidden;
  z-index: 100;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  color: #333;
  text-decoration: none;
  transition: background 0.3s;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f9f9f9;
}

.dropdown-item i {
  width: 20px;
  margin-right: 12px;
  text-align: center;
  font-size: 16px;
  color: #555;
}

.dropdown-divider {
  height: 1px;
  background-color: #eee;
  margin: 0;
}

/* Transitions */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.list-enter-active, .list-leave-active {
  transition: all 0.3s;
}

.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style> 