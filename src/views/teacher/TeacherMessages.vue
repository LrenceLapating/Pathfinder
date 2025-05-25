<template>
  <div class="messages">
    <!-- Header Section -->
    <div class="messages-header">
      <div class="header-left">
        <h1>Messages</h1>
        <p class="subtitle">Communicate with students and parents</p>
      </div>
      <div class="header-actions">
        <button class="primary-btn" @click="composeMessage">
          <i class="fas fa-pen"></i>
          New Message
        </button>
      </div>
    </div>

    <div class="messages-container">
      <!-- Contacts Sidebar -->
      <div class="contacts-sidebar">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search contacts..."
            @input="searchContacts"
          />
        </div>

        <div class="contact-filters">
          <button 
            v-for="filter in filters" 
            :key="filter.id"
            class="filter-btn"
            :class="{ active: selectedFilter === filter.id }"
            @click="selectFilter(filter.id)"
          >
            <i :class="filter.icon"></i>
            {{ filter.name }}
          </button>
        </div>

        <div class="contacts-list">
          <div 
            v-for="contact in filteredContacts" 
            :key="contact.id"
            class="contact-item"
            :class="{ active: selectedContact?.id === contact.id }"
            @click="selectContact(contact)"
          >
            <div class="contact-avatar">
              <img :src="contact.avatar" :alt="contact.name" />
              <span class="status-indicator" :class="contact.status"></span>
            </div>
            <div class="contact-info">
              <div class="contact-header">
                <h4>{{ contact.name }}</h4>
                <span class="message-time">{{ contact.lastMessage.time }}</span>
              </div>
              <p class="last-message">{{ contact.lastMessage.text }}</p>
            </div>
            <div class="contact-badges">
              <span v-if="contact.unread" class="unread-badge">{{ contact.unread }}</span>
              <span v-if="contact.type" class="contact-type" :class="contact.type">
                {{ contact.type }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Content -->
      <div class="message-content" v-if="selectedContact">
        <div class="message-header">
          <div class="contact-info">
            <img :src="selectedContact.avatar" :alt="selectedContact.name" class="contact-avatar" />
            <div class="contact-details">
              <h3>{{ selectedContact.name }}</h3>
              <p class="contact-status">
                <span class="status-dot" :class="selectedContact.status"></span>
                {{ selectedContact.status }}
              </p>
            </div>
          </div>
          <div class="message-actions">
            <button class="icon-btn" title="Video Call">
              <i class="fas fa-video"></i>
            </button>
            <button class="icon-btn" title="Voice Call">
              <i class="fas fa-phone"></i>
            </button>
            <button class="icon-btn" title="More Options">
              <i class="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>

        <div class="message-history" ref="messageHistory">
          <div 
            v-for="message in selectedContact.messages" 
            :key="message.id"
            class="message"
            :class="{ 'outgoing': message.type === 'sent', 'incoming': message.type === 'received' }"
          >
            <div class="message-bubble">
              {{ message.text }}
            </div>
            <div class="message-meta">
              <span class="message-time">{{ message.time }}</span>
              <span v-if="message.type === 'sent'" class="message-status">
                <i class="fas fa-check-double" :class="{ 'read': message.read }"></i>
              </span>
            </div>
          </div>
        </div>

        <div class="message-composer">
          <button class="icon-btn" title="Attach File">
            <i class="fas fa-paperclip"></i>
          </button>
          <div class="composer-input">
            <input 
              type="text" 
              v-model="newMessage" 
              placeholder="Type a message..."
              @keyup.enter="sendMessage"
            />
          </div>
          <button class="icon-btn" title="Send Message" @click="sendMessage">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-else>
        <div class="empty-icon">
          <i class="fas fa-comments"></i>
        </div>
        <h3>Select a conversation</h3>
        <p>Choose a contact to start messaging</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeacherMessages',

  data() {
    return {
      searchQuery: '',
      selectedFilter: 'all',
      selectedContact: null,
      newMessage: '',
      filters: [
        { id: 'all', name: 'All', icon: 'fas fa-inbox' },
        { id: 'students', name: 'Students', icon: 'fas fa-user-graduate' },
        { id: 'parents', name: 'Parents', icon: 'fas fa-users' },
        { id: 'starred', name: 'Starred', icon: 'fas fa-star' }
      ],
      contacts: [
        {
          id: 1,
          name: 'John Smith',
          avatar: '/avatars/student1.jpg',
          status: 'online',
          type: 'student',
          unread: 2,
          lastMessage: {
            text: 'Thank you for the feedback on my assignment',
            time: '10:30 AM'
          },
          messages: [
            {
              id: 1,
              type: 'received',
              text: 'Hello, I have a question about the homework',
              time: '10:15 AM',
              read: true
            },
            {
              id: 2,
              type: 'sent',
              text: 'Sure, what would you like to know?',
              time: '10:20 AM',
              read: true
            },
            {
              id: 3,
              type: 'received',
              text: 'Thank you for the feedback on my assignment',
              time: '10:30 AM',
              read: false
            }
          ]
        },
        // Add more contacts...
      ]
    }
  },

  computed: {
    filteredContacts() {
      return this.contacts.filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesFilter = this.selectedFilter === 'all' || contact.type === this.selectedFilter
        return matchesSearch && matchesFilter
      })
    }
  },

  methods: {
    searchContacts() {
      // Implement contact search
    },

    selectFilter(filterId) {
      this.selectedFilter = filterId
    },

    selectContact(contact) {
      this.selectedContact = contact
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },

    composeMessage() {
      // Implement new message composition
    },

    sendMessage() {
      if (!this.newMessage.trim()) return

      const message = {
        id: Date.now(),
        type: 'sent',
        text: this.newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      }

      this.selectedContact.messages.push(message)
      this.newMessage = ''

      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },

    scrollToBottom() {
      const messageHistory = this.$refs.messageHistory
      messageHistory.scrollTop = messageHistory.scrollHeight
    }
  }
}
</script>

<style scoped>
.messages {
  height: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.messages-header {
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

.messages-container {
  flex: 1;
  display: flex;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.contacts-sidebar {
  width: 320px;
  border-right: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
}

.search-box {
  padding: 1rem;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 2rem;
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

.contact-filters {
  padding: 0 1rem;
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-btn {
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

.filter-btn:hover {
  background: #F1F5F9;
}

.filter-btn.active {
  background: #EBF5FF;
  color: #2563EB;
}

.contacts-list {
  flex: 1;
  overflow-y: auto;
}

.contact-item {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.contact-item:hover {
  background: #F8FAFC;
}

.contact-item.active {
  background: #EBF5FF;
}

.contact-avatar {
  position: relative;
}

.contact-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  position: absolute;
  bottom: 0;
  right: 0;
}

.status-indicator.online {
  background: #10B981;
}

.status-indicator.offline {
  background: #64748B;
}

.status-indicator.away {
  background: #F59E0B;
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.contact-header h4 {
  margin: 0;
  font-size: 0.875rem;
  color: #1E293B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-time {
  font-size: 0.75rem;
  color: #64748B;
}

.last-message {
  margin: 0;
  font-size: 0.75rem;
  color: #64748B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-badges {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.unread-badge {
  background: #2563EB;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.contact-type {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.contact-type.student {
  background: #EBF5FF;
  color: #2563EB;
}

.contact-type.parent {
  background: #FEF3C7;
  color: #D97706;
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.message-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #E2E8F0;
}

.message-header .contact-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.message-header .contact-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.contact-details h3 {
  margin: 0;
  font-size: 1rem;
  color: #1E293B;
}

.contact-status {
  margin: 0.25rem 0 0 0;
  font-size: 0.75rem;
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online {
  background: #10B981;
}

.status-dot.offline {
  background: #64748B;
}

.status-dot.away {
  background: #F59E0B;
}

.message-actions {
  display: flex;
  gap: 0.5rem;
}

.message-history {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.message.outgoing {
  align-self: flex-end;
}

.message.incoming {
  align-self: flex-start;
}

.message-bubble {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  line-height: 1.4;
}

.message.outgoing .message-bubble {
  background: #2563EB;
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message.incoming .message-bubble {
  background: #F1F5F9;
  color: #1E293B;
  border-bottom-left-radius: 0.25rem;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #64748B;
}

.message.outgoing .message-meta {
  justify-content: flex-end;
}

.message-status i {
  font-size: 0.875rem;
}

.message-status i.read {
  color: #2563EB;
}

.message-composer {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid #E2E8F0;
}

.composer-input {
  flex: 1;
}

.composer-input input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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