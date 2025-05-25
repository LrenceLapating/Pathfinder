<template>
  <div class="module-management">
    <!-- Header Section -->
    <div class="module-header">
      <div class="header-left">
        <h1>Module Management</h1>
        <p class="subtitle">Create and manage learning modules for your courses</p>
      </div>
      <div class="header-actions">
        <button class="secondary-btn" @click="importModule">
          <i class="fas fa-file-import"></i>
          Import Module
        </button>
        <button class="primary-btn" @click="createModule">
          <i class="fas fa-plus"></i>
          Create Module
        </button>
      </div>
    </div>

    <!-- Module Overview -->
    <div class="module-overview">
      <div class="overview-card">
        <div class="overview-icon">
          <i class="fas fa-book"></i>
        </div>
        <div class="overview-content">
          <h3>Total Modules</h3>
          <p class="overview-value">{{ totalModules }}</p>
        </div>
      </div>

      <div class="overview-card">
        <div class="overview-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="overview-content">
          <h3>Active Students</h3>
          <p class="overview-value">{{ activeStudents }}</p>
        </div>
      </div>

      <div class="overview-card">
        <div class="overview-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="overview-content">
          <h3>Avg. Completion Rate</h3>
          <p class="overview-value">{{ avgCompletionRate }}%</p>
        </div>
      </div>

      <div class="overview-card">
        <div class="overview-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="overview-content">
          <h3>Avg. Time to Complete</h3>
          <p class="overview-value">{{ avgCompletionTime }} hours</p>
        </div>
      </div>
    </div>

    <!-- Module Management Tools -->
    <div class="management-tools">
      <div class="search-filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search modules..."
            @input="filterModules"
          />
        </div>

        <div class="filter-group">
          <select v-model="selectedSubject" @change="filterModules">
            <option value="">All Subjects</option>
            <option v-for="subject in subjects" :key="subject" :value="subject">
              {{ subject }}
            </option>
          </select>

          <select v-model="selectedLevel" @change="filterModules">
            <option value="">All Levels</option>
            <option v-for="level in levels" :key="level" :value="level">
              {{ level }}
            </option>
          </select>

          <select v-model="sortBy" @change="sortModules">
            <option value="name">Name</option>
            <option value="date">Date Created</option>
            <option value="students">Student Count</option>
            <option value="completion">Completion Rate</option>
          </select>
        </div>
      </div>

      <div class="bulk-actions" v-if="selectedModules.length > 0">
        <span class="selection-info">
          {{ selectedModules.length }} modules selected
        </span>
        <div class="action-buttons">
          <button class="action-btn" @click="duplicateSelected">
            <i class="fas fa-copy"></i>
            Duplicate
          </button>
          <button class="action-btn" @click="exportSelected">
            <i class="fas fa-file-export"></i>
            Export
          </button>
          <button class="action-btn" @click="archiveSelected">
            <i class="fas fa-archive"></i>
            Archive
          </button>
          <button class="danger-btn" @click="deleteSelected">
            <i class="fas fa-trash"></i>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Modules Grid -->
    <div class="modules-grid">
      <div 
        v-for="module in filteredModules" 
        :key="module.id"
        class="module-card"
        :class="{ 'selected': selectedModules.includes(module.id) }"
      >
        <div class="module-header">
          <input 
            type="checkbox" 
            :value="module.id" 
            v-model="selectedModules"
            class="module-checkbox"
          />
          <div class="module-status" :class="module.status">
            {{ module.status }}
          </div>
        </div>

        <div class="module-content">
          <h3 class="module-title">{{ module.name }}</h3>
          <p class="module-description">{{ module.description }}</p>
          
          <div class="module-meta">
            <span class="meta-item">
              <i class="fas fa-graduation-cap"></i>
              {{ module.subject }}
            </span>
            <span class="meta-item">
              <i class="fas fa-layer-group"></i>
              {{ module.level }}
            </span>
          </div>

          <div class="module-stats">
            <div class="stat-item">
              <span class="stat-label">Students</span>
              <span class="stat-value">{{ module.studentCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Completion</span>
              <span class="stat-value">{{ module.completionRate }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Avg. Score</span>
              <span class="stat-value">{{ module.averageScore }}%</span>
            </div>
          </div>

          <div class="module-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: module.completionRate + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <div class="module-actions">
          <button class="icon-btn" @click="editModule(module)" title="Edit Module">
            <i class="fas fa-edit"></i>
          </button>
          <button class="icon-btn" @click="previewModule(module)" title="Preview Module">
            <i class="fas fa-eye"></i>
          </button>
          <button class="icon-btn" @click="duplicateModule(module)" title="Duplicate Module">
            <i class="fas fa-copy"></i>
          </button>
          <div class="more-actions">
            <button class="icon-btn" @click="toggleMoreActions(module)">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <div v-if="module.showMoreActions" class="actions-dropdown">
              <button @click="exportModule(module)">
                <i class="fas fa-file-export"></i> Export
              </button>
              <button @click="archiveModule(module)">
                <i class="fas fa-archive"></i> Archive
              </button>
              <button @click="deleteModule(module)" class="danger">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-if="filteredModules.length === 0">
        <i class="fas fa-books"></i>
        <h3>No Modules Found</h3>
        <p>{{ searchQuery ? 'No modules match your search criteria.' : 'Get started by creating your first module.' }}</p>
        <button class="primary-btn" @click="createModule">
          <i class="fas fa-plus"></i>
          Create Module
        </button>
      </div>
    </div>

    <!-- Create/Edit Module Modal -->
    <div class="modal" v-if="showModuleModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingModule ? 'Edit Module' : 'Create New Module' }}</h2>
          <button class="close-btn" @click="closeModuleModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>Module Name</label>
            <input 
              type="text" 
              v-model="moduleForm.name"
              placeholder="Enter module name"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="moduleForm.description"
              placeholder="Enter module description"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Subject</label>
              <select v-model="moduleForm.subject" class="form-select">
                <option value="">Select subject</option>
                <option v-for="subject in subjects" :key="subject" :value="subject">
                  {{ subject }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Level</label>
              <select v-model="moduleForm.level" class="form-select">
                <option value="">Select level</option>
                <option v-for="level in levels" :key="level" :value="level">
                  {{ level }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Prerequisites</label>
            <select 
              v-model="moduleForm.prerequisites" 
              multiple
              class="form-select"
            >
              <option 
                v-for="module in availablePrerequisites" 
                :key="module.id" 
                :value="module.id"
              >
                {{ module.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Estimated Duration (hours)</label>
            <input 
              type="number" 
              v-model="moduleForm.duration"
              min="0"
              step="0.5"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="moduleForm.isPublished"
              />
              Publish module immediately
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button class="secondary-btn" @click="closeModuleModal">
            Cancel
          </button>
          <button class="primary-btn" @click="saveModule">
            {{ editingModule ? 'Update Module' : 'Create Module' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModuleManagement',
  
  data() {
    return {
      // Overview Stats
      totalModules: 24,
      activeStudents: 156,
      avgCompletionRate: 78,
      avgCompletionTime: 4.5,

      // Filters
      searchQuery: '',
      selectedSubject: '',
      selectedLevel: '',
      sortBy: 'name',
      selectedModules: [],

      // Module Form
      showModuleModal: false,
      editingModule: null,
      moduleForm: {
        name: '',
        description: '',
        subject: '',
        level: '',
        prerequisites: [],
        duration: 1,
        isPublished: false
      },

      // Options
      subjects: [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Computer Science'
      ],
      levels: [
        'Beginner',
        'Intermediate',
        'Advanced'
      ],

      // Mock Data
      modules: [
        {
          id: 1,
          name: 'Introduction to Algebra',
          description: 'Basic concepts of algebraic expressions and equations',
          subject: 'Mathematics',
          level: 'Beginner',
          status: 'published',
          studentCount: 45,
          completionRate: 82,
          averageScore: 76,
          prerequisites: []
        },
        // Add more modules...
      ]
    }
  },

  computed: {
    filteredModules() {
      // Implement filtering logic
      return this.modules
    },

    availablePrerequisites() {
      // Filter out current module and its dependencies
      return this.modules.filter(m => !this.editingModule || m.id !== this.editingModule.id)
    }
  },

  methods: {
    createModule() {
      this.editingModule = null
      this.moduleForm = {
        name: '',
        description: '',
        subject: '',
        level: '',
        prerequisites: [],
        duration: 1,
        isPublished: false
      }
      this.showModuleModal = true
    },

    editModule(module) {
      this.editingModule = module
      this.moduleForm = {
        name: module.name,
        description: module.description,
        subject: module.subject,
        level: module.level,
        prerequisites: [...module.prerequisites],
        duration: module.duration,
        isPublished: module.status === 'published'
      }
      this.showModuleModal = true
    },

    saveModule() {
      // Validate form
      if (!this.moduleForm.name) {
        alert('Please enter a module name')
        return
      }

      if (!this.moduleForm.subject) {
        alert('Please select a subject')
        return
      }

      if (!this.moduleForm.level) {
        alert('Please select a level')
        return
      }

      // TODO: Save module to backend
      console.log('Saving module:', {
        ...this.moduleForm,
        id: this.editingModule ? this.editingModule.id : Date.now()
      })

      this.closeModuleModal()
    },

    closeModuleModal() {
      this.showModuleModal = false
      this.editingModule = null
    },

    filterModules() {
      // Implement filter logic
    },

    sortModules() {
      // Implement sort logic
    },

    previewModule(module) {
      // Implement module preview
    },

    duplicateModule(module) {
      // Implement module duplication
    },

    exportModule(module) {
      // Implement module export
    },

    archiveModule(module) {
      // Implement module archival
    },

    deleteModule(module) {
      if (confirm('Are you sure you want to delete this module?')) {
        // Implement module deletion
      }
    },

    importModule() {
      // Implement module import
    },

    toggleMoreActions(module) {
      module.showMoreActions = !module.showMoreActions
    },

    // Bulk Actions
    duplicateSelected() {
      // Implement bulk duplication
    },

    exportSelected() {
      // Implement bulk export
    },

    archiveSelected() {
      // Implement bulk archival
    },

    deleteSelected() {
      if (confirm('Are you sure you want to delete the selected modules?')) {
        // Implement bulk deletion
      }
    }
  }
}
</script>

<style scoped>
.module-management {
  padding: 1.5rem;
}

.module-header {
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

.module-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.overview-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.overview-icon {
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

.overview-content h3 {
  margin: 0;
  font-size: 0.875rem;
  color: #64748B;
}

.overview-value {
  margin: 0.25rem 0 0 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1E293B;
}

.management-tools {
  margin-bottom: 2rem;
}

.search-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
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
  color: #1E293B;
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-group select {
  padding: 0.75rem 2rem 0.75rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background: white;
  color: #1E293B;
  font-size: 0.875rem;
}

.bulk-actions {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.selection-info {
  font-size: 0.875rem;
  color: #64748B;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.module-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.module-card.selected {
  border: 2px solid #2563EB;
}

.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.module-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #E2E8F0;
}

.module-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.module-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.module-status.published {
  background: #DCFCE7;
  color: #10B981;
}

.module-status.draft {
  background: #F1F5F9;
  color: #64748B;
}

.module-status.archived {
  background: #FEE2E2;
  color: #EF4444;
}

.module-content {
  padding: 1.5rem;
}

.module-title {
  margin: 0;
  font-size: 1.125rem;
  color: #1E293B;
}

.module-description {
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #64748B;
  line-height: 1.5;
}

.module-meta {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748B;
}

.module-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1rem 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748B;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1E293B;
}

.module-progress {
  margin-top: 1rem;
}

.progress-bar {
  height: 6px;
  background: #E2E8F0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #2563EB;
  transition: width 0.3s ease;
}

.module-actions {
  padding: 1rem;
  border-top: 1px solid #E2E8F0;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.more-actions {
  position: relative;
}

.actions-dropdown {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 160px;
}

.actions-dropdown button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: #1E293B;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.actions-dropdown button:hover {
  background: #F8FAFC;
}

.actions-dropdown button.danger {
  color: #EF4444;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.empty-state i {
  font-size: 3rem;
  color: #64748B;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #1E293B;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  color: #64748B;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1E293B;
}

.close-btn {
  background: transparent;
  border: none;
  color: #64748B;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #F1F5F9;
  color: #1E293B;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #E2E8F0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #64748B;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1E293B;
}

.form-textarea {
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.primary-btn,
.secondary-btn,
.action-btn,
.danger-btn {
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
  background: white;
  color: #64748B;
  border: 1px solid #E2E8F0;
}

.action-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.danger-btn {
  background: #FEE2E2;
  color: #EF4444;
  border: none;
}

.danger-btn:hover {
  background: #FEE2E2;
}

.icon-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: #64748B;
  cursor: pointer;
  transition: all 0.3s ease;
}

.icon-btn:hover {
  background: #F1F5F9;
  color: #2563EB;
}
</style> 