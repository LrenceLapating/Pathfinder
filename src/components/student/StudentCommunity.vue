<template>
  <div class="student-community">
    <div class="community-header">
      <h1>Student Community</h1>
      <div class="header-actions">
        <button class="create-post-btn" @click="showCreatePost = true">
          <i class="fas fa-plus"></i>
          Create Post
        </button>
        <div class="filter-section">
          <select v-model="selectedTopic" class="topic-filter">
            <option value="">All Topics</option>
            <option v-for="topic in topics" 
                    :key="topic.id" 
                    :value="topic.id">
              {{ topic.name }}
            </option>
          </select>
          <select v-model="sortBy" class="sort-filter">
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>
    </div>

    <div class="community-content">
      <!-- Discussion Feed -->
      <div class="discussion-feed">
        <div v-for="post in filteredPosts" 
             :key="post.id" 
             class="post-card">
          <div class="post-header">
            <div class="user-info">
              <img :src="post.author.avatar" :alt="post.author.name" class="user-avatar">
              <div class="post-meta">
                <h3>{{ post.author.name }}</h3>
                <span class="post-time">{{ formatTime(post.timestamp) }}</span>
              </div>
            </div>
            <div class="topic-tag" :style="{ background: getTopicColor(post.topic) }">
              {{ getTopicName(post.topic) }}
            </div>
          </div>
          
          <div class="post-content">
            <h2>{{ post.title }}</h2>
            <p>{{ post.content }}</p>
            <div v-if="post.image" class="post-image">
              <img :src="post.image" :alt="post.title">
            </div>
          </div>

          <div class="post-actions">
            <button :class="['action-btn', { active: post.liked }]" @click="toggleLike(post)">
              <i class="fas fa-heart"></i>
              {{ post.likes }} Likes
            </button>
            <button class="action-btn" @click="toggleComments(post)">
              <i class="fas fa-comment"></i>
              {{ post.comments.length }} Comments
            </button>
            <button class="action-btn" @click="sharePost(post)">
              <i class="fas fa-share"></i>
              Share
            </button>
          </div>

          <!-- Comments Section -->
          <div v-if="post.showComments" class="comments-section">
            <div class="comment-input">
              <img :src="currentUser.avatar" :alt="currentUser.name" class="user-avatar">
              <input 
                v-model="post.newComment" 
                type="text" 
                placeholder="Write a comment..."
                @keyup.enter="addComment(post)"
              >
              <button @click="addComment(post)">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>

            <div class="comments-list">
              <div v-for="comment in post.comments" 
                   :key="comment.id" 
                   class="comment">
                <img :src="comment.author.avatar" :alt="comment.author.name" class="user-avatar">
                <div class="comment-content">
                  <div class="comment-header">
                    <h4>{{ comment.author.name }}</h4>
                    <span class="comment-time">{{ formatTime(comment.timestamp) }}</span>
                  </div>
                  <p>{{ comment.content }}</p>
                  <div class="comment-actions">
                    <button @click="toggleCommentLike(comment)">
                      <i class="fas fa-heart"></i>
                      {{ comment.likes }}
                    </button>
                    <button @click="replyToComment(comment)">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Community Sidebar -->
      <div class="community-sidebar">
        <!-- Study Groups -->
        <div class="sidebar-section study-groups">
          <h2>Study Groups</h2>
          <div class="group-list">
            <div v-for="group in studyGroups" 
                 :key="group.id" 
                 class="group-card">
              <div class="group-info">
                <h3>{{ group.name }}</h3>
                <p>{{ group.members }} members</p>
              </div>
              <button :class="['join-btn', { joined: group.joined }]" @click="toggleGroup(group)">
                {{ group.joined ? 'Joined' : 'Join' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Trending Topics -->
        <div class="sidebar-section trending-topics">
          <h2>Trending Topics</h2>
          <div class="topic-list">
            <div v-for="topic in trendingTopics" 
                 :key="topic.id" 
                 class="topic-item">
              <span class="topic-name">#{{ topic.name }}</span>
              <span class="post-count">{{ topic.posts }} posts</span>
            </div>
          </div>
        </div>

        <!-- Active Users -->
        <div class="sidebar-section active-users">
          <h2>Active Now</h2>
          <div class="users-list">
            <div v-for="user in activeUsers" 
                 :key="user.id" 
                 class="user-item">
              <div class="user-status">
                <img :src="user.avatar" :alt="user.name" class="user-avatar">
                <span class="status-indicator" :class="user.status"></span>
              </div>
              <span class="user-name">{{ user.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Post Modal -->
    <div v-if="showCreatePost" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Create Post</h2>
          <button class="close-btn" @click="showCreatePost = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Title</label>
            <input v-model="newPost.title" type="text" placeholder="Enter post title">
          </div>
          <div class="form-group">
            <label>Content</label>
            <textarea 
              v-model="newPost.content" 
              placeholder="What's on your mind?"
            ></textarea>
          </div>
          <div class="form-group">
            <label>Topic</label>
            <select v-model="newPost.topic">
              <option v-for="topic in topics" 
                      :key="topic.id" 
                      :value="topic.id">
                {{ topic.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Add Image</label>
            <div class="image-upload">
              <input type="file" @change="handleImageUpload" accept="image/*">
              <div class="upload-placeholder">
                <i class="fas fa-image"></i>
                <span>Click to upload image</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showCreatePost = false">Cancel</button>
          <button class="post-btn" @click="createPost">Post</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentCommunity',
  data() {
    return {
      showCreatePost: false,
      selectedTopic: '',
      sortBy: 'recent',
      currentUser: {
        id: 1,
        name: 'John Doe',
        avatar: '/path/to/avatar.jpg'
      },
      newPost: {
        title: '',
        content: '',
        topic: '',
        image: null
      },
      topics: [
        { id: 1, name: 'Mathematics', color: '#4CAF50' },
        { id: 2, name: 'Physics', color: '#2196F3' },
        { id: 3, name: 'Literature', color: '#FF9800' },
        { id: 4, name: 'Computer Science', color: '#9C27B0' }
      ],
      posts: [
        {
          id: 1,
          author: {
            name: 'Jane Smith',
            avatar: '/path/to/avatar.jpg'
          },
          title: 'Need help with Calculus',
          content: 'Can someone explain the chain rule?',
          topic: 1,
          timestamp: '2024-02-20T15:30:00',
          likes: 15,
          liked: false,
          comments: [
            {
              id: 1,
              author: {
                name: 'Mike Johnson',
                avatar: '/path/to/avatar.jpg'
              },
              content: 'I can help! The chain rule is...',
              timestamp: '2024-02-20T15:35:00',
              likes: 5
            }
          ],
          showComments: false,
          newComment: ''
        }
      ],
      studyGroups: [
        {
          id: 1,
          name: 'Calculus Study Group',
          members: 25,
          joined: false
        },
        {
          id: 2,
          name: 'Physics Lab Partners',
          members: 18,
          joined: true
        }
      ],
      trendingTopics: [
        { id: 1, name: 'calculus', posts: 156 },
        { id: 2, name: 'physics', posts: 89 },
        { id: 3, name: 'literature', posts: 67 }
      ],
      activeUsers: [
        {
          id: 1,
          name: 'Alice Brown',
          avatar: '/path/to/avatar.jpg',
          status: 'online'
        },
        {
          id: 2,
          name: 'Bob Wilson',
          avatar: '/path/to/avatar.jpg',
          status: 'away'
        }
      ]
    }
  },
  computed: {
    filteredPosts() {
      let filtered = [...this.posts]
      
      if (this.selectedTopic) {
        filtered = filtered.filter(post => post.topic === this.selectedTopic)
      }

      switch (this.sortBy) {
        case 'popular':
          filtered.sort((a, b) => b.likes - a.likes)
          break
        case 'trending':
          filtered.sort((a, b) => b.comments.length - a.comments.length)
          break
        default:
          filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      }

      return filtered
    }
  },
  methods: {
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString()
    },
    getTopicColor(topicId) {
      const topic = this.topics.find(t => t.id === topicId)
      return topic ? topic.color : '#666'
    },
    getTopicName(topicId) {
      const topic = this.topics.find(t => t.id === topicId)
      return topic ? topic.name : ''
    },
    toggleLike(post) {
      post.liked = !post.liked
      post.likes += post.liked ? 1 : -1
    },
    toggleComments(post) {
      post.showComments = !post.showComments
    },
    addComment(post) {
      if (!post.newComment.trim()) return

      post.comments.push({
        id: Date.now(),
        author: this.currentUser,
        content: post.newComment,
        timestamp: new Date().toISOString(),
        likes: 0
      })
      post.newComment = ''
    },
    toggleCommentLike(comment) {
      comment.likes++
    },
    replyToComment(comment) {
      // Implement reply functionality
    },
    sharePost(post) {
      // Implement share functionality
    },
    toggleGroup(group) {
      group.joined = !group.joined
      group.members += group.joined ? 1 : -1
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.newPost.image = URL.createObjectURL(file)
      }
    },
    createPost() {
      const post = {
        id: Date.now(),
        author: this.currentUser,
        ...this.newPost,
        timestamp: new Date().toISOString(),
        likes: 0,
        liked: false,
        comments: [],
        showComments: false,
        newComment: ''
      }
      this.posts.unshift(post)
      this.showCreatePost = false
      this.newPost = {
        title: '',
        content: '',
        topic: '',
        image: null
      }
    }
  }
}
</script>

<style scoped>
.student-community {
  padding: 2rem;
}

.community-header {
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.create-post-btn {
  padding: 0.75rem 1.5rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-section {
  display: flex;
  gap: 1rem;
}

.topic-filter,
.sort-filter {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
}

.community-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

/* Post Card Styles */
.post-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.post-meta h3 {
  margin: 0;
  font-size: 1rem;
}

.post-time {
  font-size: 0.9rem;
  color: #666;
}

.topic-tag {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  color: white;
  font-size: 0.9rem;
}

.post-content {
  margin-bottom: 1rem;
}

.post-content h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.post-image img {
  width: 100%;
  border-radius: 10px;
  margin-top: 1rem;
}

.post-actions {
  display: flex;
  gap: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.action-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn.active {
  color: #4CAF50;
}

/* Comments Section */
.comments-section {
  margin-top: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.comment-input {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.comment-input input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
}

.comment {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.comment-content {
  flex: 1;
  background: #f5f7fa;
  padding: 1rem;
  border-radius: 10px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.comment-header h4 {
  margin: 0;
  font-size: 0.9rem;
}

.comment-time {
  font-size: 0.8rem;
  color: #666;
}

.comment-actions {
  margin-top: 0.5rem;
  display: flex;
  gap: 1rem;
}

.comment-actions button {
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
}

/* Sidebar Styles */
.community-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-section {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.sidebar-section h2 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.group-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.group-info h3 {
  margin: 0;
  font-size: 1rem;
}

.group-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.join-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
}

.join-btn.joined {
  background: #f5f7fa;
  color: #666;
  border: 1px solid #ddd;
}

.topic-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.post-count {
  color: #666;
  font-size: 0.9rem;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-status {
  position: relative;
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.online {
  background: #4CAF50;
}

.status-indicator.away {
  background: #FF9800;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 600px;
  max-width: 90%;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

.form-group textarea {
  height: 150px;
  resize: vertical;
}

.image-upload {
  border: 2px dashed #ddd;
  border-radius: 5px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
}

.image-upload input {
  display: none;
}

.upload-placeholder {
  color: #666;
}

.upload-placeholder i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn,
.post-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background: #f5f7fa;
  color: #666;
}

.post-btn {
  background: #4CAF50;
  color: white;
}

@media (max-width: 1024px) {
  .community-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .student-community {
    padding: 1rem;
  }

  .header-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-section {
    width: 100%;
  }

  .topic-filter,
  .sort-filter {
    flex: 1;
  }

  .post-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .post-actions {
    justify-content: space-between;
  }
}
</style> 