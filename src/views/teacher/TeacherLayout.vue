<template>
  <div class="teacher-layout">
    <!-- Sidebar -->
    <aside :class="['sidebar', { 'collapsed': isSidebarCollapsed }]">
      <div class="sidebar-header">
        <div class="logo-container" title="PathFinder" @click.prevent="goToDashboard">
          <img :src="compassLogo" alt="PathFinder" class="logo" />
        </div>
        <span v-if="!isSidebarCollapsed" class="logo-text">PathFinder</span>
        <button class="collapse-btn" @click="toggleSidebar">
          <i :class="['fas', isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li v-for="item in navigationItems" :key="item.path">
            <router-link :to="item.path" :class="['nav-link', { 'active': isActiveRoute(item.path) }]">
              <i :class="['nav-icon', item.icon]"></i>
              <span class="nav-text" v-show="!isSidebarCollapsed">{{ item.name }}</span>
              <span v-if="item.badge && !isSidebarCollapsed" 
                :class="['badge', 'badge-' + item.badge.type]">
                {{ item.badge.value }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="teacher-info">
          <img :src="teacher.avatar" :alt="teacher.name" class="teacher-avatar" />
          <div class="teacher-details" v-show="!isSidebarCollapsed">
            <span class="teacher-name">{{ teacher.name }}</span>
            <span class="teacher-role">{{ teacher.role }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Top Bar -->
      <header class="top-bar">
        <div class="page-header">
          <h1 class="page-title">{{ currentPageTitle }}</h1>
          <nav class="breadcrumb" aria-label="breadcrumb">
            <ol>
              <li><router-link to="/teacher/dashboard">Dashboard</router-link></li>
              <li v-if="currentPageTitle !== 'Dashboard'">{{ currentPageTitle }}</li>
            </ol>
          </nav>
        </div>

        <div class="top-actions">
          <div class="search-box">
            <i class="fas fa-search search-icon"></i>
            <input 
              type="text" 
              placeholder="Search..." 
              v-model="searchQuery"
              @input="handleSearch"
            />
          </div>

          <div class="action-buttons">
            <button class="btn-icon" @click="openQuickAdd" title="Quick Add">
              <i class="fas fa-plus"></i>
            </button>

            <div class="notifications-dropdown" v-click-outside="closeNotifications">
              <button class="btn-icon" @click="toggleNotifications" title="Notifications">
                <i class="fas fa-bell"></i>
                <span v-if="unreadNotifications" class="notification-badge">
                  {{ unreadNotifications }}
                </span>
              </button>
              <div v-if="showNotifications" class="dropdown-menu">
                <div class="dropdown-header">
                  <h3>Notifications</h3>
                  <button class="btn-text" @click="markAllRead">Mark all as read</button>
                </div>
                <div class="notification-list">
                  <div v-for="notification in notifications" :key="notification.id"
                    :class="['notification-item', { 'unread': !notification.read }]">
                    <div class="notification-icon">
                      <i :class="notification.icon"></i>
                    </div>
                    <div class="notification-content">
                      <p class="notification-text">{{ notification.text }}</p>
                      <span class="notification-time">{{ notification.time }}</span>
                    </div>
                  </div>
                </div>
                <div class="dropdown-footer">
                  <router-link to="/teacher/notifications">View all notifications</router-link>
                </div>
              </div>
            </div>

            <div class="profile-dropdown" v-click-outside="closeProfileMenu">
              <button class="btn-icon" @click="toggleProfileMenu" title="Profile">
                <img :src="teacher.avatar" :alt="teacher.name" class="profile-avatar" />
              </button>
              <div v-if="showProfileMenu" class="dropdown-menu">
                <div class="dropdown-header">
                  <h3>{{ teacher.name }}</h3>
                  <p>{{ teacher.role }}</p>
                </div>
                <div class="dropdown-items">
                  <router-link to="/teacher/profile" class="dropdown-item">
                    <i class="fas fa-user"></i>
                    My Profile
                  </router-link>
                  <router-link to="/teacher/settings" class="dropdown-item">
                    <i class="fas fa-cog"></i>
                    Settings
                  </router-link>
                  <button class="dropdown-item" @click="logout">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Quick Add Modal -->
      <div v-if="showQuickAdd" class="modal-overlay" @click="closeQuickAdd">
        <div class="quick-add-modal" @click.stop>
          <div class="modal-header">
            <h2>Quick Actions</h2>
            <button class="close-button" @click="closeQuickAdd">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="quick-actions-grid">
            <button 
              v-for="action in quickActions" 
              :key="action.id"
              class="quick-action-btn"
              @click="handleQuickAction(action)"
            >
              <i :class="['quick-action-icon', action.icon]"></i>
              <span class="quick-action-text">{{ action.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="content-area">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto'
import signInImage from '@/assets/images/Pathfinder-logo.png'

export default {
  name: 'TeacherLayout',
  
  data() {
    return {
      isSidebarCollapsed: false,
      showQuickAdd: false,
      showProfileMenu: false,
      showNotifications: false,
      searchQuery: '',
      unreadNotifications: 5,
      compassLogo: signInImage,
      teacher: {
        name: 'Sarah Johnson',
        role: 'Mathematics Teacher',
        avatar: '/avatars/teacher1.jpg'
      },
      navigationItems: [
        {
          name: 'Dashboard',
          path: '/teacher/analytics',
          icon: 'fas fa-home'
        },
        {
          name: 'Students',
          path: '/teacher/students',
          icon: 'fas fa-users'
        },
        {
          name: 'Schedule',
          path: '/teacher/schedule',
          icon: 'fas fa-calendar-alt'
        },
        {
          name: 'Modules',
          path: '/teacher/modules',
          icon: 'fas fa-book'
        },
        {
          name: 'Quizzes',
          path: '/teacher/quizzes',
          icon: 'fas fa-tasks'
        },
        {
          name: 'Resources',
          path: '/teacher/resources',
          icon: 'fas fa-folder'
        },
        {
          name: 'Messages',
          path: '/teacher/messages',
          icon: 'fas fa-envelope',
          badge: {
            type: 'primary',
            value: '3'
          }
        },
        {
          name: 'Notifications',
          path: '/teacher/notifications',
          icon: 'fas fa-bell',
          badge: {
            type: 'primary',
            value: '5'
          }
        },
        {
          name: 'Profile',
          path: '/teacher/profile',
          icon: 'fas fa-user'
        }
      ],
      quickActions: [
        {
          id: 'create-assignment',
          name: 'Create Assignment',
          icon: 'fas fa-file-alt',
          action: () => this.$router.push('/teacher/modules/create')
        },
        {
          id: 'schedule-class',
          name: 'Schedule Class',
          icon: 'fas fa-calendar-plus',
          action: () => this.$router.push('/teacher/schedule/create')
        },
        {
          id: 'add-resource',
          name: 'Add Resource',
          icon: 'fas fa-plus-circle',
          action: () => this.$router.push('/teacher/resources/create')
        },
        {
          id: 'create-quiz',
          name: 'Create Quiz',
          icon: 'fas fa-question-circle',
          action: () => this.$router.push('/teacher/quizzes/create')
        }
      ],
      notifications: [
        {
          id: 1,
          text: 'New assignment submission from John Doe',
          time: '5 minutes ago',
          icon: 'fas fa-file-alt',
          read: false
        },
        {
          id: 2,
          text: 'Quiz results ready for Math 101',
          time: '1 hour ago',
          icon: 'fas fa-clipboard-check',
          read: false
        }
      ]
    }
  },

  computed: {
    currentPageTitle() {
      return this.$route.meta.title || 'Dashboard'
    }
  },

  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed
    },

    isActiveRoute(path) {
      return this.$route.path === path || this.$route.path.startsWith(path + '/')
    },

    openQuickAdd() {
      this.showQuickAdd = true
    },

    closeQuickAdd() {
      this.showQuickAdd = false
    },

    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu
      if (this.showProfileMenu) {
        this.showNotifications = false
      }
    },

    closeProfileMenu() {
      this.showProfileMenu = false
    },

    toggleNotifications() {
      this.showNotifications = !this.showNotifications
      if (this.showNotifications) {
        this.showProfileMenu = false
      }
    },

    closeNotifications() {
      this.showNotifications = false
    },

    handleSearch() {
      // Implement search functionality
      console.log('Searching:', this.searchQuery)
    },

    markAllRead() {
      this.unreadNotifications = 0
      this.notifications.forEach(n => n.read = true)
      this.closeNotifications()
    },

    handleQuickAction(action) {
      action.action()
      this.closeQuickAdd()
    },

    logout() {
      localStorage.removeItem('pathfinder_token')
      localStorage.removeItem('pathfinder_user_role')
      this.$router.push('/')
    },

    goToDashboard() {
      if (this.$route.path !== '/teacher/analytics') {
        this.$router.push('/teacher/analytics')
      }
    }
  },

  directives: {
    clickOutside: {
      mounted(el, binding) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value()
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

<style scoped>
.teacher-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background-color: #1a1a1a;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  height: 100vh;
  z-index: 1000;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  position: relative;
  height: 60px;
  box-sizing: border-box;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  min-width: 48px;
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
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.collapse-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-icon {
  width: 24px;
  text-align: center;
  margin-right: 1rem;
}

.badge {
  margin-left: auto;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.badge-success {
  background-color: #10b981;
  color: white;
}

.badge-primary {
  background-color: #3b82f6;
  color: white;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.teacher-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.teacher-details {
  display: flex;
  flex-direction: column;
}

.teacher-name {
  font-weight: 600;
  color: white;
}

.teacher-role {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Main Content Styles */
.main-content {
  flex: 1;
  margin-left: 280px;
  transition: margin-left 0.3s ease;
}

.sidebar.collapsed + .main-content {
  margin-left: 80px;
}

.top-bar {
  background-color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.page-header {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.breadcrumb {
  margin-top: 0.25rem;
}

.breadcrumb ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
}

.breadcrumb li {
  display: flex;
  align-items: center;
  color: #64748b;
  font-size: 0.875rem;
}

.breadcrumb li:not(:last-child)::after {
  content: '/';
  margin: 0 0.5rem;
  color: #cbd5e1;
}

.breadcrumb a {
  color: #64748b;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #2563eb;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  min-width: 20px;
  text-align: center;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  width: 320px;
  z-index: 1000;
}

.dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #1e293b;
}

.btn-text {
  background: none;
  border: none;
  color: #2563eb;
  font-size: 0.875rem;
  cursor: pointer;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 1rem;
  display: flex;
  align-items: start;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.3s ease;
}

.notification-item:hover {
  background-color: #f8fafc;
}

.notification-item.unread {
  background-color: #f0f9ff;
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e0f2fe;
  color: #0ea5e9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-content {
  flex: 1;
}

.notification-text {
  margin: 0;
  color: #1e293b;
  font-size: 0.875rem;
}

.notification-time {
  display: block;
  margin-top: 0.25rem;
  color: #64748b;
  font-size: 0.75rem;
}

.dropdown-footer {
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #e2e8f0;
}

.dropdown-footer a {
  color: #2563eb;
  text-decoration: none;
  font-size: 0.875rem;
}

.content-area {
  padding: 2rem;
}

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
  z-index: 1100;
}

.quick-add-modal {
  background-color: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1e293b;
}

.close-button {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-button:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.quick-action-icon {
  font-size: 1.5rem;
  color: #2563eb;
}

.quick-action-text {
  font-size: 0.875rem;
  color: #1e293b;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    width: 80px;
  }

  .main-content {
    margin-left: 80px;
  }

  .nav-text,
  .teacher-details {
    display: none;
  }

  .search-box {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem;
  }

  .search-box {
    width: 100%;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.show {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }

  .content-area {
    padding: 1rem;
  }
}
</style> 