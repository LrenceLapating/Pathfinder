<template>
  <div class="modules-list">
    <div class="modules-header">
      <h1><i class="fas fa-graduation-cap"></i> Learning Modules</h1>
      <div class="filter-section">
        <div class="search-wrapper">
          <i class="fas fa-search"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search modules..."
            class="search-input"
          >
        </div>
        <div class="select-wrapper">
          <i class="fas fa-filter"></i>
          <select v-model="selectedSubject" class="subject-filter">
            <option value="">All Subjects</option>
            <option v-for="subject in subjects" 
                    :key="subject.id" 
                    :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="modules-grid">
      <div v-for="module in filteredModules" 
           :key="module.id" 
           class="module-card"
           :class="{ 'completed': module.completed }">
        <div class="module-header">
          <span :class="['status-badge', module.status]">
            <i :class="getStatusIcon(module.status)"></i>
            {{ module.status }}
          </span>
          <div class="progress-circle">
            <svg viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                stroke-width="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4CAF50"
                stroke-width="3"
                :stroke-dasharray="module.progress + ', 100'"
              />
            </svg>
            <span class="progress-text">{{ module.progress }}%</span>
          </div>
        </div>
        
        <div class="module-content">
          <div class="module-title">
            <i :class="getSubjectIcon(module.subject)"></i>
            <h2>{{ module.title }}</h2>
          </div>
          <p>{{ module.description }}</p>
          
          <div class="module-meta">
            <span class="duration">
              <i class="fas fa-clock"></i>
              {{ module.duration }}
            </span>
            <span class="lessons">
              <i class="fas fa-book"></i>
              {{ module.lessons }} lessons
            </span>
            <span class="difficulty" v-if="module.difficulty">
              <i class="fas fa-signal"></i>
              {{ module.difficulty }}
            </span>
          </div>
        </div>

        <div class="module-footer">
          <button 
            class="start-btn"
            @click="startModule(module)"
            :disabled="!module.available"
          >
            <i :class="getButtonIcon(module)"></i>
            {{ module.completed ? 'Review' : module.available ? 'Start' : 'Locked' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModulesList',
  data() {
    return {
      searchQuery: '',
      selectedSubject: '',
      subjects: [
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'Physics' },
        { id: 3, name: 'Literature' }
      ],
      modules: [
        {
          id: 1,
          title: 'Introduction to Calculus',
          description: 'Learn the fundamentals of calculus including limits, derivatives, and integrals.',
          subject: 1,
          status: 'available',
          progress: 100,
          completed: true,
          duration: '4 hours',
          lessons: 8,
          available: true,
          difficulty: 'Intermediate'
        },
        {
          id: 2,
          title: 'Advanced Algebra',
          description: 'Master advanced algebraic concepts and problem-solving techniques.',
          subject: 1,
          status: 'in-progress',
          progress: 60,
          completed: false,
          duration: '6 hours',
          lessons: 12,
          available: true,
          difficulty: 'Advanced'
        },
        {
          id: 3,
          title: 'Classical Mechanics',
          description: 'Study motion, forces, and energy in physical systems.',
          subject: 2,
          status: 'locked',
          progress: 0,
          completed: false,
          duration: '5 hours',
          lessons: 10,
          available: false,
          difficulty: 'Advanced'
        }
      ]
    }
  },
  computed: {
    filteredModules() {
      return this.modules.filter(module => {
        const matchesSearch = module.title.toLowerCase()
          .includes(this.searchQuery.toLowerCase())
        const matchesSubject = !this.selectedSubject || 
          module.subject === this.selectedSubject
        return matchesSearch && matchesSubject
      })
    }
  },
  methods: {
    getStatusIcon(status) {
      const icons = {
        'available': 'fas fa-check-circle',
        'in-progress': 'fas fa-spinner fa-spin',
        'locked': 'fas fa-lock'
      }
      return icons[status] || 'fas fa-info-circle'
    },
    getSubjectIcon(subjectId) {
      const icons = {
        1: 'fas fa-square-root-alt', // Mathematics
        2: 'fas fa-atom', // Physics
        3: 'fas fa-book' // Literature
      }
      return icons[subjectId] || 'fas fa-book'
    },
    getButtonIcon(module) {
      if (!module.available) return 'fas fa-lock'
      if (module.completed) return 'fas fa-redo'
      return 'fas fa-play'
    },
    startModule(module) {
      this.$router.push(`/student/modules/${module.id}`)
    }
  }
}
</script>

<style scoped>
.modules-list {
  padding: 2rem;
}

.modules-header {
  margin-bottom: 2rem;
}

.filter-section {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

.search-wrapper,
.select-wrapper {
  position: relative;
  flex: 1;
}

.search-wrapper i,
.select-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-input,
.subject-filter {
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  width: 100%;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.module-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.module-card:hover {
  transform: translateY(-5px);
}

.module-card.completed {
  border: 2px solid #4CAF50;
}

.module-header {
  padding: 1rem;
  background: #f5f7fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.status-badge.available {
  background: #E8F5E9;
  color: #4CAF50;
}

.status-badge.in-progress {
  background: #FFF3E0;
  color: #FF9800;
}

.status-badge.locked {
  background: #FFEBEE;
  color: #f44336;
}

.progress-circle {
  position: relative;
  width: 36px;
  height: 36px;
}

.progress-circle svg {
  transform: rotate(-90deg);
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: 500;
}

.module-content {
  padding: 1.5rem;
}

.module-content h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.module-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.module-meta {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.module-meta span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.module-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.start-btn {
  width: 100%;
  padding: 0.8rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.start-btn:hover {
  background: #43A047;
}

.start-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.modules-header h1 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.modules-header h1 i {
  color: var(--primary-color);
}

.module-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.module-title i {
  color: var(--primary-color);
  font-size: 1.2rem;
}

.module-title h2 {
  margin: 0;
  font-size: 1.2rem;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.status-badge i {
  font-size: 0.9rem;
}

.start-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.start-btn i {
  font-size: 0.9rem;
}

.difficulty i {
  color: #666;
}

@media (max-width: 768px) {
  .modules-list {
    padding: 1rem;
  }

  .filter-section {
    flex-direction: column;
  }

  .modules-grid {
    grid-template-columns: 1fr;
  }
}
</style> 