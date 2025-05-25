<template>
  <div class="resource-manager">
    <!-- Header Section -->
    <div class="resource-header">
      <div class="header-left">
        <h1>Resource Manager</h1>
        <p class="subtitle">Manage and organize educational resources</p>
      </div>
      <div class="header-actions">
        <button class="secondary-btn" @click="importResources">
          <i class="fas fa-file-import"></i>
          Import Resources
        </button>
        <button class="primary-btn" @click="createResource">
          <i class="fas fa-plus"></i>
          Add Resource
        </button>
      </div>
    </div>

    <!-- Resource Categories -->
    <div class="categories-section">
      <div class="category-card" v-for="category in categories" :key="category.id">
        <div class="category-icon">
          <i :class="category.icon"></i>
        </div>
        <div class="category-content">
          <h3>{{ category.name }}</h3>
          <p>{{ category.count }} items</p>
        </div>
      </div>
    </div>

    <!-- Resource Management -->
    <div class="resources-section">
      <div class="section-header">
        <h2>Resources Library</h2>
        <div class="filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search resources..."
              @input="filterResources"
            />
          </div>
          <select v-model="selectedCategory" @change="filterResources">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <select v-model="selectedType" @change="filterResources">
            <option value="">All Types</option>
            <option value="document">Documents</option>
            <option value="video">Videos</option>
            <option value="quiz">Quizzes</option>
            <option value="interactive">Interactive</option>
          </select>
        </div>
      </div>

      <div class="resources-grid">
        <div v-for="resource in filteredResources" :key="resource.id" class="resource-card">
          <div class="resource-preview">
            <img v-if="resource.thumbnail" :src="resource.thumbnail" :alt="resource.title" />
            <div v-else class="preview-placeholder">
              <i :class="getResourceIcon(resource.type)"></i>
            </div>
          </div>

          <div class="resource-content">
            <div class="resource-header">
              <h3>{{ resource.title }}</h3>
              <span class="resource-type" :class="resource.type">
                {{ resource.type }}
              </span>
            </div>
            <p class="resource-description">{{ resource.description }}</p>
            <div class="resource-meta">
              <span><i class="fas fa-folder"></i> {{ resource.category }}</span>
              <span><i class="fas fa-clock"></i> {{ resource.duration }}</span>
              <span><i class="fas fa-users"></i> {{ resource.usageCount }} uses</span>
            </div>
          </div>

          <div class="resource-actions">
            <button class="icon-btn" @click="previewResource(resource)" title="Preview">
              <i class="fas fa-eye"></i>
            </button>
            <button class="icon-btn" @click="editResource(resource)" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="icon-btn" @click="shareResource(resource)" title="Share">
              <i class="fas fa-share-alt"></i>
            </button>
            <button class="icon-btn" @click="downloadResource(resource)" title="Download">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Resource Analytics -->
    <div class="analytics-section">
      <h2>Resource Analytics</h2>
      <div class="analytics-grid">
        <div class="analytics-card">
          <h3>Usage by Category</h3>
          <div class="chart-container">
            <canvas ref="categoryChart"></canvas>
          </div>
        </div>

        <div class="analytics-card">
          <h3>Popular Resources</h3>
          <div class="popular-resources">
            <div v-for="resource in popularResources" :key="resource.id" class="popular-item">
              <div class="resource-rank">{{ resource.rank }}</div>
              <div class="resource-info">
                <h4>{{ resource.title }}</h4>
                <p>{{ resource.usageCount }} uses this month</p>
              </div>
              <div class="resource-trend" :class="resource.trend > 0 ? 'positive' : 'negative'">
                <i :class="resource.trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ Math.abs(resource.trend) }}%
              </div>
            </div>
          </div>
        </div>

        <div class="analytics-card">
          <h3>Student Engagement</h3>
          <div class="chart-container">
            <canvas ref="engagementChart"></canvas>
          </div>
        </div>

        <div class="analytics-card">
          <h3>Resource Growth</h3>
          <div class="chart-container">
            <canvas ref="growthChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto'

export default {
  name: 'ResourceManager',

  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      selectedType: '',
      categories: [
        {
          id: 1,
          name: 'Lecture Materials',
          icon: 'fas fa-book',
          count: 125
        },
        {
          id: 2,
          name: 'Practice Exercises',
          icon: 'fas fa-tasks',
          count: 84
        },
        {
          id: 3,
          name: 'Video Tutorials',
          icon: 'fas fa-video',
          count: 56
        },
        {
          id: 4,
          name: 'Assessments',
          icon: 'fas fa-clipboard-check',
          count: 32
        }
      ],
      resources: [
        {
          id: 1,
          title: 'Introduction to Algebra',
          type: 'document',
          category: 'Lecture Materials',
          description: 'Comprehensive guide to basic algebraic concepts',
          thumbnail: null,
          duration: '45 mins',
          usageCount: 256
        },
        // Add more resources...
      ],
      popularResources: [
        {
          id: 1,
          rank: 1,
          title: 'Advanced Calculus Tutorial',
          usageCount: 1250,
          trend: 15
        },
        // Add more popular resources...
      ],
      charts: {
        category: null,
        engagement: null,
        growth: null
      }
    }
  },

  computed: {
    filteredResources() {
      return this.resources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesCategory = !this.selectedCategory || resource.category === this.selectedCategory
        const matchesType = !this.selectedType || resource.type === this.selectedType
        return matchesSearch && matchesCategory && matchesType
      })
    }
  },

  mounted() {
    this.initializeCharts()
  },

  methods: {
    initializeCharts() {
      // Initialize Category Usage Chart
      this.charts.category = new Chart(this.$refs.categoryChart, {
        type: 'doughnut',
        data: {
          labels: this.categories.map(c => c.name),
          datasets: [{
            data: this.categories.map(c => c.count),
            backgroundColor: [
              '#2563EB',
              '#10B981',
              '#F59E0B',
              '#EF4444'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      })

      // Initialize Engagement Chart
      this.charts.engagement = new Chart(this.$refs.engagementChart, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Student Engagement',
            data: [450, 520, 480, 600],
            borderColor: '#2563EB',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      })

      // Initialize Growth Chart
      this.charts.growth = new Chart(this.$refs.growthChart, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{
            label: 'New Resources',
            data: [25, 30, 35, 40, 45],
            backgroundColor: '#2563EB'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      })
    },

    getResourceIcon(type) {
      const icons = {
        document: 'fas fa-file-alt',
        video: 'fas fa-video',
        quiz: 'fas fa-question-circle',
        interactive: 'fas fa-laptop'
      }
      return icons[type] || 'fas fa-file'
    },

    createResource() {
      // Implement resource creation
    },

    importResources() {
      // Implement resource import
    },

    filterResources() {
      // Implement resource filtering
    },

    previewResource(resource) {
      // Implement resource preview
    },

    editResource(resource) {
      // Implement resource edit
    },

    shareResource(resource) {
      // Implement resource sharing
    },

    downloadResource(resource) {
      // Implement resource download
    }
  }
}
</script>

<style scoped>
.resource-manager {
  padding: 1.5rem;
}

.resource-header {
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

.categories-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.category-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #EBF5FF;
  color: #2563EB;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.category-content h3 {
  margin: 0;
  font-size: 1rem;
  color: #1E293B;
}

.category-content p {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #64748B;
}

.resources-section {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1E293B;
}

.filters {
  display: flex;
  gap: 1rem;
}

.search-box {
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
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  min-width: 250px;
}

.filters select {
  padding: 0.75rem 2rem 0.75rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.resource-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.resource-preview {
  height: 160px;
  background: #F8FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resource-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #EBF5FF;
  color: #2563EB;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.resource-content {
  padding: 1rem;
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.resource-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #1E293B;
}

.resource-type {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.resource-type.document {
  background: #EBF5FF;
  color: #2563EB;
}

.resource-type.video {
  background: #FEF3C7;
  color: #D97706;
}

.resource-type.quiz {
  background: #F0FDF4;
  color: #10B981;
}

.resource-type.interactive {
  background: #FEE2E2;
  color: #EF4444;
}

.resource-description {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: #64748B;
  line-height: 1.4;
}

.resource-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #64748B;
}

.resource-meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.resource-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #E2E8F0;
}

.analytics-section {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.analytics-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #1E293B;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.analytics-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.analytics-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #1E293B;
}

.chart-container {
  height: 200px;
  position: relative;
}

.popular-resources {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.popular-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
}

.popular-item:hover {
  background: #F8FAFC;
}

.resource-rank {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: #EBF5FF;
  color: #2563EB;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
}

.resource-info {
  flex: 1;
}

.resource-info h4 {
  margin: 0;
  font-size: 0.875rem;
  color: #1E293B;
}

.resource-info p {
  margin: 0.25rem 0 0 0;
  font-size: 0.75rem;
  color: #64748B;
}

.resource-trend {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.resource-trend.positive {
  color: #10B981;
}

.resource-trend.negative {
  color: #EF4444;
}

.primary-btn,
.secondary-btn,
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