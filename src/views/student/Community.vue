<template>
  <div class="community">
    <div class="page-header">
      <h1><i class="fas fa-users"></i> Community</h1>
      <div class="header-actions">
        <button class="action-btn primary" @click="createPost">
          <i class="fas fa-plus"></i>
          Create Post
        </button>
      </div>
    </div>

    <div class="community-layout">
      <!-- Main Content -->
      <div class="main-content">
        <!-- Discussion Feed -->
        <div class="section">
          <div class="section-header">
            <h2>Recent Discussions</h2>
            <div class="filters">
              <select v-model="selectedSubject" class="filter-select">
                <option value="">All Subjects</option>
                <option v-for="subject in subjects" :key="subject" :value="subject">
                  {{ subject }}
                </option>
              </select>
              <select v-model="selectedSort" class="filter-select">
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="unanswered">Unanswered</option>
              </select>
            </div>
          </div>

          <div class="posts-list">
            <div v-for="post in filteredPosts" :key="post.id" class="post-card">
              <div class="post-header">
                <div class="user-info">
                  <img :src="post.author.avatar" :alt="post.author.name" class="avatar">
                  <div class="user-details">
                    <span class="name">{{ post.author.name }}</span>
                    <span class="time">{{ formatTime(post.timestamp) }}</span>
                  </div>
                </div>
                <div class="post-badges">
                  <span class="subject-badge">{{ post.subject }}</span>
                  <span v-if="post.solved" class="solved-badge">
                    <i class="fas fa-check-circle"></i> Solved
                  </span>
                </div>
              </div>
              
              <div class="post-content">
                <h3>{{ post.title }}</h3>
                <p>{{ post.content }}</p>
              </div>

              <div class="post-footer">
                <div class="interactions">
                  <button class="interaction-btn" @click="upvotePost(post)">
                    <i class="fas fa-arrow-up"></i>
                    {{ post.upvotes }}
                  </button>
                  <button class="interaction-btn" @click="showComments(post)">
                    <i class="fas fa-comment"></i>
                    {{ post.comments.length }}
                  </button>
                  <button class="interaction-btn" @click="sharePost(post)">
                    <i class="fas fa-share"></i>
                  </button>
                </div>
                <button class="view-btn" @click="viewPost(post)">
                  View Discussion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Study Groups -->
        <div class="section">
          <h2>Your Study Groups</h2>
          <div class="study-groups">
            <div v-for="group in studyGroups" :key="group.id" class="group-card">
              <div class="group-icon">
                <i :class="getSubjectIcon(group.subject)"></i>
              </div>
              <div class="group-info">
                <h4>{{ group.name }}</h4>
                <p>{{ group.members }} members</p>
              </div>
              <button class="join-btn" v-if="!group.joined" @click="joinGroup(group)">
                Join
              </button>
              <button class="view-btn" v-else @click="viewGroup(group)">
                View
              </button>
            </div>
          </div>
        </div>

        <!-- Active Users -->
        <div class="section">
          <h2>Active Now</h2>
          <div class="active-users">
            <div v-for="user in activeUsers" :key="user.id" class="user-card">
              <img :src="user.avatar" :alt="user.name" class="avatar">
              <div class="user-info">
                <span class="name">{{ user.name }}</span>
                <span class="status">{{ user.status }}</span>
              </div>
              <button class="message-btn" @click="messageUser(user)">
                <i class="fas fa-comment"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Community',
  data() {
    return {
      selectedSubject: '',
      selectedSort: 'recent',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'],
      posts: [
        {
          id: 1,
          title: 'Help with Calculus Integration',
          content: 'I\'m struggling with solving this integration problem...',
          author: {
            name: 'John Doe',
            avatar: '/avatars/john.jpg'
          },
          subject: 'Mathematics',
          timestamp: new Date('2024-03-15T10:30:00'),
          upvotes: 12,
          comments: [
            { id: 1, content: 'Have you tried using u-substitution?' }
          ],
          solved: true
        },
        {
          id: 2,
          title: 'Physics Lab Report Format',
          content: 'Can someone share a template for the lab report?',
          author: {
            name: 'Jane Smith',
            avatar: '/avatars/jane.jpg'
          },
          subject: 'Physics',
          timestamp: new Date('2024-03-15T09:15:00'),
          upvotes: 8,
          comments: [],
          solved: false
        }
      ],
      studyGroups: [
        {
          id: 1,
          name: 'Calculus Study Group',
          subject: 'Mathematics',
          members: 15,
          joined: true
        },
        {
          id: 2,
          name: 'Physics Olympiad Prep',
          subject: 'Physics',
          members: 12,
          joined: false
        }
      ],
      activeUsers: [
        {
          id: 1,
          name: 'Alice Johnson',
          avatar: '/avatars/alice.jpg',
          status: 'Studying Mathematics'
        },
        {
          id: 2,
          name: 'Bob Wilson',
          avatar: '/avatars/bob.jpg',
          status: 'Available for help'
        }
      ]
    }
  },
  computed: {
    filteredPosts() {
      let filtered = [...this.posts]
      
      if (this.selectedSubject) {
        filtered = filtered.filter(post => post.subject === this.selectedSubject)
      }

      switch (this.selectedSort) {
        case 'popular':
          filtered.sort((a, b) => b.upvotes - a.upvotes)
          break
        case 'unanswered':
          filtered = filtered.filter(post => post.comments.length === 0)
          break
        default:
          filtered.sort((a, b) => b.timestamp - a.timestamp)
      }

      return filtered
    }
  },
  methods: {
    formatTime(timestamp) {
      const now = new Date()
      const diff = now - timestamp
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)

      if (days > 0) return `${days}d ago`
      if (hours > 0) return `${hours}h ago`
      if (minutes > 0) return `${minutes}m ago`
      return 'Just now'
    },
    getSubjectIcon(subject) {
      const icons = {
        'Mathematics': 'fas fa-square-root-alt',
        'Physics': 'fas fa-atom',
        'Chemistry': 'fas fa-flask',
        'Biology': 'fas fa-dna',
        'English': 'fas fa-book',
        'History': 'fas fa-landmark'
      }
      return icons[subject] || 'fas fa-book'
    },
    createPost() {
      // Implement post creation logic
      console.log('Creating new post')
    },
    upvotePost(post) {
      post.upvotes++
    },
    showComments(post) {
      // Implement comments view logic
      console.log('Showing comments for post:', post.id)
    },
    sharePost(post) {
      // Implement share logic
      console.log('Sharing post:', post.id)
    },
    viewPost(post) {
      // Navigate to post detail view
      this.$router.push(`/student/community/post/${post.id}`)
    },
    joinGroup(group) {
      group.joined = true
      group.members++
    },
    viewGroup(group) {
      // Navigate to group detail view
      this.$router.push(`/student/community/group/${group.id}`)
    },
    messageUser(user) {
      // Implement messaging logic
      console.log('Messaging user:', user.name)
    }
  }
}
</script>

<style scoped>
.community {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1A1A1A;
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: #C84C1C;
  color: white;
  border: none;
}

.action-btn.primary:hover {
  background: #B43D0E;
}

.community-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #1A1A1A;
}

.filters {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  color: #64748B;
}

.post-card {
  background: #F8FAFC;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 500;
  color: #1A1A1A;
}

.time {
  font-size: 0.9rem;
  color: #64748B;
}

.post-badges {
  display: flex;
  gap: 0.5rem;
}

.subject-badge {
  padding: 0.25rem 0.5rem;
  background: #E0E7FF;
  color: #3730A3;
  border-radius: 20px;
  font-size: 0.8rem;
}

.solved-badge {
  padding: 0.25rem 0.5rem;
  background: #DCFCE7;
  color: #166534;
  border-radius: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.post-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #1A1A1A;
}

.post-content p {
  margin: 0;
  color: #64748B;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #E2E8F0;
}

.interactions {
  display: flex;
  gap: 1rem;
}

.interaction-btn {
  background: none;
  border: none;
  color: #64748B;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.3s ease;
}

.interaction-btn:hover {
  color: #C84C1C;
}

.view-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  color: #64748B;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn:hover {
  border-color: #C84C1C;
  color: #C84C1C;
}

.study-groups {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.group-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #F8FAFC;
  border-radius: 8px;
}

.group-icon {
  width: 40px;
  height: 40px;
  background: #C84C1C;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.group-info {
  flex: 1;
}

.group-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #1A1A1A;
}

.group-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #64748B;
}

.join-btn {
  padding: 0.5rem 1rem;
  background: #C84C1C;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.join-btn:hover {
  background: #B43D0E;
}

.active-users {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #F8FAFC;
  border-radius: 8px;
}

.message-btn {
  width: 32px;
  height: 32px;
  background: #E2E8F0;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
  cursor: pointer;
  transition: all 0.3s ease;
}

.message-btn:hover {
  background: #C84C1C;
  color: white;
}

.status {
  font-size: 0.8rem;
  color: #64748B;
}
</style> 