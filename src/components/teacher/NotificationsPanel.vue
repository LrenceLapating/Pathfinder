<template>
  <div class="notifications-panel">
    <div class="panel-header">
      <h2>Notifications</h2>
      <div class="header-actions">
        <button class="btn-text mark-all-btn" v-if="unreadCount > 0" @click="markAllAsRead">
          Mark all as read
        </button>
        <button class="close-btn" @click="closePanel">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    
    <div class="panel-tabs">
      <button 
        class="tab-btn" 
        :class="{ 'active': activeTab === 'all' }" 
        @click="activeTab = 'all'"
      >
        All
      </button>
      <button 
        class="tab-btn" 
        :class="{ 'active': activeTab === 'unread' }" 
        @click="activeTab = 'unread'"
      >
        Unread 
        <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
      </button>
      <button 
        class="tab-btn" 
        :class="{ 'active': activeTab === 'archived' }" 
        @click="activeTab = 'archived'"
      >
        Archived
      </button>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Loading notifications...</span>
    </div>
    
    <div v-else-if="filteredNotifications.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-bell-slash"></i>
      </div>
      <p>No notifications</p>
      <span v-if="activeTab === 'unread'">You've read all your notifications</span>
      <span v-else-if="activeTab === 'archived'">You have no archived notifications</span>
      <span v-else>You have no notifications yet</span>
    </div>
    
    <div v-else class="notifications-list">
      <div 
        v-for="notification in filteredNotifications" 
        :key="notification.id" 
        class="notification-item"
        :class="{ 'unread': !notification.read }"
      >
        <div class="notification-type-icon" :class="notification.type">
          <i :class="getIconForType(notification.type)"></i>
        </div>
        <div class="notification-content">
          <div class="notification-header">
            <span class="notification-title">{{ notification.title }}</span>
            <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
          </div>
          <p class="notification-message">{{ notification.message }}</p>
          <div v-if="notification.actionLink" class="notification-action">
            <button class="action-link" @click="navigateTo(notification.actionLink)">
              {{ notification.actionText }}
            </button>
          </div>
        </div>
        <div class="notification-actions">
          <button 
            v-if="!notification.read" 
            class="action-btn" 
            title="Mark as read"
            @click="markAsRead(notification.id)"
          >
            <i class="fas fa-check"></i>
          </button>
          <button 
            v-if="!notification.archived" 
            class="action-btn" 
            title="Archive"
            @click="archiveNotification(notification.id)"
          >
            <i class="fas fa-archive"></i>
          </button>
          <button 
            v-else 
            class="action-btn" 
            title="Unarchive"
            @click="unarchiveNotification(notification.id)"
          >
            <i class="fas fa-box-open"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationsPanel',
  
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      activeTab: 'all',
      loading: true,
      notifications: [
        {
          id: 1,
          type: 'student-joined',
          title: 'New Student Joined',
          message: 'Emily Johnson has joined your Mathematics 101 classroom.',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          read: false,
          archived: false,
          actionLink: '/teacher/classroom/1',
          actionText: 'View Classroom'
        },
        {
          id: 2,
          type: 'at-risk',
          title: 'Student Flagged At-Risk',
          message: 'Michael Brown has been flagged as at-risk due to low performance in Calculus.',
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
          read: false,
          archived: false,
          actionLink: '/teacher/performance',
          actionText: 'View Performance'
        },
        {
          id: 3,
          type: 'guide-completed',
          title: 'Study Guide Completed',
          message: 'John Smith has completed the "Algebra Fundamentals" study guide with a score of 85%.',
          timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
          read: true,
          archived: false,
          actionLink: '/teacher/performance',
          actionText: 'View Results'
        },
        {
          id: 4,
          type: 'performance',
          title: 'Performance Alert',
          message: '5 students in Physics Advanced are showing weakness in Thermodynamics concepts.',
          timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
          read: true,
          archived: true,
          actionLink: '/teacher/analytics',
          actionText: 'View Analytics'
        }
      ]
    };
  },
  
  computed: {
    filteredNotifications() {
      if (this.activeTab === 'unread') {
        return this.notifications.filter(n => !n.read && !n.archived);
      } else if (this.activeTab === 'archived') {
        return this.notifications.filter(n => n.archived);
      } else {
        return this.notifications.filter(n => !n.archived);
      }
    },
    
    unreadCount() {
      return this.notifications.filter(n => !n.read && !n.archived).length;
    }
  },
  
  mounted() {
    // Simulate loading notifications from an API
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  
  methods: {
    closePanel() {
      this.$emit('close');
    },
    
    markAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    },
    
    markAllAsRead() {
      this.notifications.forEach(notification => {
        if (!notification.archived) {
          notification.read = true;
        }
      });
    },
    
    archiveNotification(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.archived = true;
      }
    },
    
    unarchiveNotification(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.archived = false;
      }
    },
    
    navigateTo(route) {
      this.$router.push(route);
      this.closePanel();
    },
    
    getIconForType(type) {
      switch (type) {
        case 'student-joined':
          return 'fas fa-user-plus';
        case 'at-risk':
          return 'fas fa-exclamation-triangle';
        case 'guide-completed':
          return 'fas fa-book-reader';
        case 'performance':
          return 'fas fa-chart-line';
        default:
          return 'fas fa-bell';
      }
    },
    
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
      } else if (diffInMinutes < 24 * 60) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      } else {
        const days = Math.floor(diffInMinutes / (24 * 60));
        if (days < 7) {
          return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        } else {
          return date.toLocaleDateString();
        }
      }
    }
  }
};
</script>

<style scoped>
.notifications-panel {
  width: 380px;
  height: 100%;
  background-color: white;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-text {
  background: none;
  border: none;
  color: #3b7ddd;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
}

.btn-text:hover {
  text-decoration: underline;
}

.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #6b7280;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: #f3f4f6;
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.tab-btn.active {
  color: #3b7ddd;
  font-weight: 600;
}

.tab-btn.active:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #3b7ddd;
}

.badge {
  background-color: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #6b7280;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b7ddd;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #6b7280;
  text-align: center;
}

.empty-icon {
  font-size: 36px;
  margin-bottom: 10px;
  color: #9ca3af;
}

.empty-state p {
  font-weight: 600;
  margin: 0 0 5px;
  font-size: 16px;
  color: #4b5563;
}

.empty-state span {
  font-size: 14px;
}

.notifications-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.notification-item {
  padding: 15px 20px;
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #eee;
  position: relative;
  transition: all 0.2s ease;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: #f9fafb;
}

.notification-item.unread {
  background-color: rgba(59, 125, 221, 0.05);
}

.notification-item.unread:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #3b7ddd;
}

.notification-type-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-type-icon.student-joined {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.notification-type-icon.at-risk {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.notification-type-icon.guide-completed {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.notification-type-icon.performance {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.notification-title {
  font-weight: 600;
  font-size: 14px;
  color: #374151;
}

.notification-time {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
  margin-left: 8px;
}

.notification-message {
  font-size: 14px;
  color: #4b5563;
  margin: 0 0 8px;
  line-height: 1.4;
}

.notification-action {
  margin-top: 5px;
}

.action-link {
  background: none;
  border: none;
  color: #3b7ddd;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
}

.action-link:hover {
  text-decoration: underline;
}

.notification-actions {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: none;
  background-color: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #e5e7eb;
  color: #374151;
}
</style> 