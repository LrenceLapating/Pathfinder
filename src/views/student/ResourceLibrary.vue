<template>
  <div class="resource-library">
    <div class="library-header">
      <div class="search-section">
        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search resources..."
            @input="filterResources"
          >
        </div>
        <div class="filter-tags">
          <button 
            v-for="tag in filterTags" 
            :key="tag.id"
            :class="['filter-tag', { active: selectedTags.includes(tag.id) }]"
            @click="toggleTag(tag.id)"
          >
            <i :class="tag.icon"></i>
            {{ tag.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="library-content">
      <!-- Resource Categories -->
      <div class="categories-section">
        <h2>Categories</h2>
        <div class="category-list">
          <div 
            v-for="category in categories" 
            :key="category.id"
            :class="['category-item', { active: selectedCategory === category.id }]"
            @click="selectCategory(category.id)"
          >
            <i :class="category.icon"></i>
            <div class="category-info">
              <h3>{{ category.name }}</h3>
              <p>{{ category.count }} resources</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Resource Grid -->
      <div class="resources-grid">
        <div 
          v-for="resource in filteredResources" 
          :key="resource.id"
          class="resource-card"
        >
          <div class="resource-preview">
            <img v-if="resource.type === 'video'" src="/video-thumbnail.jpg" :alt="resource.title">
            <img v-else-if="resource.type === 'document'" src="/document-thumbnail.jpg" :alt="resource.title">
            <img v-else-if="resource.type === 'image'" :src="resource.url" :alt="resource.title">
            <div class="resource-type">
              <i :class="getResourceIcon(resource.type)"></i>
            </div>
          </div>
          <div class="resource-info">
            <h3>{{ resource.title }}</h3>
            <p>{{ resource.description }}</p>
            <div class="resource-meta">
              <span class="duration" v-if="resource.duration">
                <i class="fas fa-clock"></i>
                {{ resource.duration }}
              </span>
              <span class="difficulty" :class="resource.difficulty">
                {{ resource.difficulty }}
              </span>
            </div>
            <div class="resource-actions">
              <button class="preview-btn" @click="previewResource(resource)">
                <i class="fas fa-eye"></i>
                Preview
              </button>
              <button class="download-btn" v-if="resource.downloadable" @click="downloadResource(resource)">
                <i class="fas fa-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resource Preview Modal -->
    <div v-if="showPreview" class="preview-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ selectedResource.title }}</h2>
          <button class="close-btn" @click="closePreview">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="selectedResource.type === 'video'" class="video-player">
            <video controls>
              <source :src="selectedResource.url" type="video/mp4">
            </video>
          </div>
          <div v-else-if="selectedResource.type === 'document'" class="document-viewer">
            <iframe :src="selectedResource.url"></iframe>
          </div>
          <div v-else-if="selectedResource.type === 'image'" class="image-viewer">
            <img :src="selectedResource.url" :alt="selectedResource.title">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResourceLibrary',
  data() {
    return {
      searchQuery: '',
      selectedTags: [],
      selectedCategory: null,
      showPreview: false,
      selectedResource: null,
      filterTags: [
        { id: 'video', name: 'Videos', icon: 'fas fa-video' },
        { id: 'document', name: 'Documents', icon: 'fas fa-file-alt' },
        { id: 'image', name: 'Images', icon: 'fas fa-image' },
        { id: 'interactive', name: 'Interactive', icon: 'fas fa-gamepad' }
      ],
      categories: [
        { 
          id: 'math',
          name: 'Mathematics',
          icon: 'fas fa-square-root-alt',
          count: 45
        },
        {
          id: 'physics',
          name: 'Physics',
          icon: 'fas fa-atom',
          count: 32
        },
        {
          id: 'english',
          name: 'English',
          icon: 'fas fa-book',
          count: 28
        },
        {
          id: 'history',
          name: 'History',
          icon: 'fas fa-landmark',
          count: 35
        }
      ],
      resources: [
        {
          id: 1,
          title: 'Introduction to Algebra',
          description: 'Learn the basics of algebraic expressions',
          type: 'video',
          category: 'math',
          difficulty: 'beginner',
          duration: '15:30',
          downloadable: true,
          url: '/path/to/video.mp4'
        },
        {
          id: 2,
          title: 'Physics Formulas Cheat Sheet',
          description: 'Quick reference guide for common physics formulas',
          type: 'document',
          category: 'physics',
          difficulty: 'intermediate',
          downloadable: true,
          url: '/path/to/document.pdf'
        }
        // Add more resources here
      ]
    }
  },
  computed: {
    filteredResources() {
      return this.resources.filter(resource => {
        const matchesSearch = this.searchQuery === '' || 
          resource.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesCategory = !this.selectedCategory || 
          resource.category === this.selectedCategory
        const matchesTags = this.selectedTags.length === 0 || 
          this.selectedTags.includes(resource.type)
        return matchesSearch && matchesCategory && matchesTags
      })
    }
  },
  methods: {
    filterResources() {
      // Implement real-time filtering
    },
    toggleTag(tagId) {
      const index = this.selectedTags.indexOf(tagId)
      if (index === -1) {
        this.selectedTags.push(tagId)
      } else {
        this.selectedTags.splice(index, 1)
      }
    },
    selectCategory(categoryId) {
      this.selectedCategory = this.selectedCategory === categoryId ? null : categoryId
    },
    getResourceIcon(type) {
      const icons = {
        video: 'fas fa-video',
        document: 'fas fa-file-alt',
        image: 'fas fa-image',
        interactive: 'fas fa-gamepad'
      }
      return icons[type] || 'fas fa-file'
    },
    previewResource(resource) {
      this.selectedResource = resource
      this.showPreview = true
    },
    closePreview() {
      this.showPreview = false
      this.selectedResource = null
    },
    downloadResource(resource) {
      // Implement download functionality
      window.open(resource.url, '_blank')
    }
  }
}
</script>

<style scoped>
.resource-library {
  padding: 2rem;
}

.library-header {
  margin-bottom: 2rem;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 30px;
  padding: 0.8rem 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-bar i {
  color: #666;
  margin-right: 1rem;
}

.search-bar input {
  border: none;
  flex: 1;
  font-size: 1rem;
  outline: none;
}

.filter-tags {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-tag {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.filter-tag.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.library-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.categories-section {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  background: #f5f7fa;
}

.category-item.active {
  background: #E8F5E9;
  color: #4CAF50;
}

.category-info h3 {
  margin: 0;
  font-size: 1rem;
}

.category-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.resource-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.resource-card:hover {
  transform: translateY(-5px);
}

.resource-preview {
  position: relative;
  height: 160px;
  background: #f5f7fa;
}

.resource-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.resource-type {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resource-info {
  padding: 1.5rem;
}

.resource-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.resource-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.resource-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.duration {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #666;
}

.difficulty {
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
}

.difficulty.beginner {
  background: #E8F5E9;
  color: #4CAF50;
}

.difficulty.intermediate {
  background: #FFF3E0;
  color: #FF9800;
}

.difficulty.advanced {
  background: #FFEBEE;
  color: #f44336;
}

.resource-actions {
  display: flex;
  gap: 1rem;
}

.preview-btn,
.download-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.preview-btn {
  background: #4CAF50;
  color: white;
  flex: 1;
}

.download-btn {
  background: #f5f7fa;
  color: #666;
  width: 40px;
  height: 40px;
  padding: 0;
  justify-content: center;
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow: hidden;
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

.video-player video,
.document-viewer iframe,
.image-viewer img {
  width: 100%;
  max-height: 70vh;
  border-radius: 5px;
}

@media (max-width: 1024px) {
  .library-content {
    grid-template-columns: 1fr;
  }

  .categories-section {
    margin-bottom: 2rem;
  }
}

@media (max-width: 768px) {
  .resource-library {
    padding: 1rem;
  }

  .resources-grid {
    grid-template-columns: 1fr;
  }
}
</style> 