<template>
  <div class="modules-list">
    <div class="modules-header">
      <h1>Learning Modules</h1>
      <div class="filter-section">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search modules..."
          class="search-input"
        >
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

    <div class="modules-grid">
      <div v-for="module in filteredModules" 
           :key="module.id" 
           class="module-card"
           :class="{ 'completed': module.completed }">
        <div class="module-header">
          <span :class="['status-badge', module.status]">
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
          <h2>{{ module.title }}</h2>
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
          </div>
        </div>

        <div class="module-footer">
          <button 
            class="start-btn"
            @click="startModule(module)"
            :disabled="!module.available"
          >
            {{ module.completed ? 'Review' : 'Start' }}
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
          available: true
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
          available: true
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
          available: false
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

.search-input,
.subject-filter {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

.search-input {
  flex: 1;
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