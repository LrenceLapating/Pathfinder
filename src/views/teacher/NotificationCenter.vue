<template>
  <div class="notification-center">
    <!-- Header Section -->
    <div class="notification-header">
      <div class="header-left">
        <h1>Notification Center</h1>
        <p class="subtitle">Manage your notifications and alerts</p>
      </div>
      <div class="header-actions">
        <button class="secondary-btn" @click="markAllAsRead">
          <i class="fas fa-check-double"></i>
          Mark All as Read
        </button>
        <button class="primary-btn" @click="openSettings">
          <i class="fas fa-cog"></i>
          Settings
        </button>
      </div>
    </div>

    <div class="notification-container">
      <!-- Notification Filters -->
      <div class="notification-filters">
        <div class="filter-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="tab-btn"
            :class="{ active: selectedTab === tab.id }"
            @click="selectTab(tab.id)"
          >
            <i :class="tab.icon"></i>
            {{ tab.name }}
            <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
          </button>
        </div>

        <div class="filter-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search notifications..."
              @input="searchNotifications"
            />
          </div>
          <select v-model="selectedPriority" @change="filterNotifications">
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select v-model="selectedType" @change="filterNotifications">
            <option value="">All Types</option>
            <option value="assignment">Assignments</option>
            <option value="message">Messages</option>
            <option value="alert">Alerts</option>
            <option value="reminder">Reminders</option>
          </select>
        </div>
      </div>

      <!-- Notification List -->
      <div class="notification-list">
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.read, [notification.priority]: true }"
        >
          <div class="notification-icon">
            <i :class="getNotificationIcon(notification.type)"></i>
          </div>
          
          <div class="notification-content">
            <div class="notification-header">
              <h4>{{ notification.title }}</h4>
              <div class="notification-meta">
                <span class="notification-time">{{ notification.time }}</span>
                <span class="notification-type" :class="notification.type">
                  {{ notification.type }}
                </span>
                <span v-if="notification.priority" class="priority-badge" :class="notification.priority">
                  {{ notification.priority }}
                </span>
              </div>
            </div>
            <p class="notification-message">{{ notification.message }}</p>
            <div class="notification-actions">
              <button v-if="notification.actionLabel" class="action-btn" @click="handleAction(notification)">
                {{ notification.actionLabel }}
              </button>
              <button class="icon-btn" @click="markAsRead(notification)" :title="notification.read ? 'Mark as unread' : 'Mark as read'">
                <i :class="notification.read ? 'far fa-envelope-open' : 'far fa-envelope'"></i>
              </button>
              <button class="icon-btn" @click="deleteNotification(notification)" title="Delete">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredNotifications.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-bell-slash"></i>
          </div>
          <h3>No notifications</h3>
          <p>You're all caught up!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationCenter',

  data() {
    return {
      searchQuery: '',
      selectedTab: 'all',
      selectedPriority: '',
      selectedType: '',
      tabs: [
        { id: 'all', name: 'All', icon: 'fas fa-inbox', count: 12 },
        { id: 'unread', name: 'Unread', icon: 'fas fa-envelope', count: 5 },
        { id: 'important', name: 'Important', icon: 'fas fa-star', count: 3 },
        { id: 'archived', name: 'Archived', icon: 'fas fa-archive' }
      ],
      notifications: [
        {
          id: 1,
          type: 'assignment',
          priority: 'high',
          title: 'New Assignment Submissions',
          message: '5 students have submitted their Math homework',
          time: '10 minutes ago',
          read: false,
          actionLabel: 'Review Submissions'
        },
        {
          id: 2,
          type: 'message',
          priority: 'medium',
          title: 'Parent Meeting Request',
          message: 'John Smith\'s parent requested a meeting to discuss progress',
          time: '1 hour ago',
          read: false,
          actionLabel: 'Schedule Meeting'
        },
        {
          id: 3,
          type: 'alert',
          priority: 'high',
          title: 'System Maintenance',
          message: 'The system will be under maintenance tonight from 10 PM to 2 AM',
          time: '2 hours ago',
          read: true
        },
        {
          id: 4,
          type: 'reminder',
          priority: 'low',
          title: 'Weekly Report Due',
          message: 'Remember to submit your weekly progress report',
          time: '1 day ago',
          read: true,
          actionLabel: 'Submit Report'
        }
      ]
    }
  },

  computed: {
    filteredNotifications() {
      return this.notifications.filter(notification => {
        const matchesSearch = notification.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            notification.message.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesPriority = !this.selectedPriority || notification.priority === this.selectedPriority
        const matchesType = !this.selectedType || notification.type === this.selectedType
        const matchesTab = this.selectedTab === 'all' ||
                          (this.selectedTab === 'unread' && !notification.read) ||
                          (this.selectedTab === 'important' && notification.priority === 'high') ||
                          (this.selectedTab === 'archived' && notification.archived)
        
        return matchesSearch && matchesPriority && matchesType && matchesTab
      })
    }
  },

  methods: {
    getNotificationIcon(type) {
      const icons = {
        assignment: 'fas fa-book',
        message: 'fas fa-envelope',
        alert: 'fas fa-exclamation-triangle',
        reminder: 'fas fa-clock'
      }
      return icons[type] || 'fas fa-bell'
    },

    selectTab(tabId) {
      this.selectedTab = tabId
    },

    searchNotifications() {
      // Implement notification search
    },

    filterNotifications() {
      // Implement notification filtering
    },

    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.read = true
      })
    },

    markAsRead(notification) {
      notification.read = !notification.read
    },

    deleteNotification(notification) {
      const index = this.notifications.indexOf(notification)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    handleAction(notification) {
      // Implement notification action handling
    },

    openSettings() {
      // Implement notification settings
    }
  }
}
</script>

<style scoped>
.notification-center {
  padding: 1.5rem;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-left h1 {
  margin: 0;
  font-size: 1.875rem;
  color: #1E293B;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  color: #64748B;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.notification-container {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.notification-filters {
  margin-bottom: 1.5rem;
}

.filter-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #E2E8F0;
  padding-bottom: 1rem;
}

.tab-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: #64748B;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: #F1F5F9;
}

.tab-btn.active {
  background: #EBF5FF;
  color: #2563EB;
}

.tab-count {
  background: #E2E8F0;
  color: #64748B;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.tab-btn.active .tab-count {
  background: #2563EB;
  color: white;
}

.filter-actions {
  display: flex;
  gap: 1rem;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748B;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.filter-actions select {
  padding: 0.75rem 2rem 0.75rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: white;
  border: 1px solid #E2E8F0;
  transition: all 0.3s ease;
}

.notification-item:hover {
  background: #F8FAFC;
}

.notification-item.unread {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.notification-item.high {
  border-left: 4px solid #EF4444;
}

.notification-item.medium {
  border-left: 4px solid #F59E0B;
}

.notification-item.low {
  border-left: 4px solid #10B981;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #EBF5FF;
  color: #2563EB;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.notification-content {
  flex: 1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.notification-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #1E293B;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notification-time {
  font-size: 0.75rem;
  color: #64748B;
}

.notification-type {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.notification-type.assignment {
  background: #EBF5FF;
  color: #2563EB;
}

.notification-type.message {
  background: #F0FDF4;
  color: #10B981;
}

.notification-type.alert {
  background: #FEF2F2;
  color: #EF4444;
}

.notification-type.reminder {
  background: #FEF3C7;
  color: #D97706;
}

.priority-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.priority-badge.high {
  background: #FEF2F2;
  color: #EF4444;
}

.priority-badge.medium {
  background: #FEF3C7;
  color: #D97706;
}

.priority-badge.low {
  background: #F0FDF4;
  color: #10B981;
}

.notification-message {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: #64748B;
  line-height: 1.4;
}

.notification-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #64748B;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #CBD5E1;
}

.empty-state h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1E293B;
}

.empty-state p {
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
}

.primary-btn,
.secondary-btn,
.action-btn,
.icon-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn {
  background: #2563EB;
  color: white;
  border: none;
}

.primary-btn:hover {
  background: #1D4ED8;
}

.secondary-btn {
  background: white;
  color: #1E293B;
  border: 1px solid #E2E8F0;
}

.secondary-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.action-btn {
  padding: 0.5rem 1rem;
  background: #F8FAFC;
  color: #2563EB;
  border: 1px solid #E2E8F0;
}

.action-btn:hover {
  background: #EBF5FF;
  border-color: #2563EB;
}

.icon-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: #64748B;
}

.icon-btn:hover {
  color: #2563EB;
  background: #F1F5F9;
}
</style> 