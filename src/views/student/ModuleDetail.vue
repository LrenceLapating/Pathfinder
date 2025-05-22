<template>
  <div class="module-detail">
    <div class="module-header">
      <div class="header-content">
        <h1>{{ module.title }}</h1>
        <div class="module-meta">
          <span class="duration">
            <i class="fas fa-clock"></i>
            {{ module.duration }}
          </span>
          <span class="lessons">
            <i class="fas fa-book"></i>
            {{ module.lessons }} lessons
          </span>
          <span :class="['status-badge', module.status]">
            {{ module.status }}
          </span>
        </div>
      </div>
      <div class="progress-overview">
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
          <div class="progress-info">
            <span class="progress-text">{{ module.progress }}%</span>
            <span class="progress-label">Completed</span>
          </div>
        </div>
      </div>
    </div>

    <div class="module-content">
      <div class="content-main">
        <!-- Module Description -->
        <div class="description-card">
          <h2>About this Module</h2>
          <p>{{ module.description }}</p>
          <div class="learning-objectives">
            <h3>Learning Objectives</h3>
            <ul>
              <li v-for="objective in module.objectives" 
                  :key="objective">
                {{ objective }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Lessons List -->
        <div class="lessons-list">
          <h2>Lessons</h2>
          <div v-for="lesson in module.lessons" 
               :key="lesson.id" 
               class="lesson-card"
               :class="{ 'completed': lesson.completed }">
            <div class="lesson-info">
              <div class="lesson-status">
                <i :class="[
                  'fas', 
                  lesson.completed ? 'fa-check-circle' : 'fa-circle',
                  lesson.completed ? 'completed' : ''
                ]"></i>
              </div>
              <div class="lesson-content">
                <h3>{{ lesson.title }}</h3>
                <p>{{ lesson.description }}</p>
                <div class="lesson-meta">
                  <span class="duration">
                    <i class="fas fa-clock"></i>
                    {{ lesson.duration }}
                  </span>
                  <span class="type">
                    <i :class="getLessonTypeIcon(lesson.type)"></i>
                    {{ lesson.type }}
                  </span>
                </div>
              </div>
            </div>
            <button 
              class="start-btn"
              @click="startLesson(lesson)"
              :disabled="!lesson.available"
            >
              {{ getLessonButtonText(lesson) }}
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="content-sidebar">
        <!-- Resources -->
        <div class="resources-card">
          <h2>Resources</h2>
          <div class="resources-list">
            <a v-for="resource in module.resources" 
               :key="resource.id"
               :href="resource.url"
               class="resource-item"
               target="_blank">
              <i :class="getResourceIcon(resource.type)"></i>
              <span>{{ resource.title }}</span>
            </a>
          </div>
        </div>

        <!-- Prerequisites -->
        <div class="prerequisites-card">
          <h2>Prerequisites</h2>
          <div class="prerequisites-list">
            <div v-for="prereq in module.prerequisites" 
                 :key="prereq.id"
                 class="prerequisite-item">
              <i :class="[
                'fas fa-check-circle',
                prereq.completed ? 'completed' : ''
              ]"></i>
              <span>{{ prereq.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModuleDetail',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      module: {
        id: 1,
        title: 'Introduction to Calculus',
        description: 'Master the fundamentals of calculus including limits, derivatives, and integrals. This module provides a comprehensive introduction to calculus concepts with practical examples and interactive exercises.',
        duration: '4 hours',
        lessons: [
          {
            id: 1,
            title: 'Understanding Limits',
            description: 'Learn about the concept of limits and their applications.',
            duration: '45 min',
            type: 'video',
            completed: true,
            available: true
          },
          {
            id: 2,
            title: 'Introduction to Derivatives',
            description: 'Explore the basics of derivatives and their geometric interpretation.',
            duration: '60 min',
            type: 'interactive',
            completed: false,
            available: true
          },
          {
            id: 3,
            title: 'Practice with Derivatives',
            description: 'Solve problems involving derivatives.',
            duration: '45 min',
            type: 'exercise',
            completed: false,
            available: false
          }
        ],
        objectives: [
          'Understand the concept of limits and continuity',
          'Master the rules of differentiation',
          'Apply derivatives to solve real-world problems',
          'Grasp the fundamentals of integration'
        ],
        resources: [
          {
            id: 1,
            title: 'Calculus Textbook',
            type: 'pdf',
            url: '#'
          },
          {
            id: 2,
            title: 'Practice Problems',
            type: 'document',
            url: '#'
          },
          {
            id: 3,
            title: 'Video Tutorials',
            type: 'video',
            url: '#'
          }
        ],
        prerequisites: [
          {
            id: 1,
            title: 'Pre-Calculus',
            completed: true
          },
          {
            id: 2,
            title: 'Advanced Algebra',
            completed: true
          }
        ],
        status: 'in-progress',
        progress: 60
      }
    }
  },
  methods: {
    getLessonTypeIcon(type) {
      const icons = {
        video: 'fas fa-play-circle',
        interactive: 'fas fa-laptop-code',
        exercise: 'fas fa-pencil-alt'
      }
      return icons[type] || 'fas fa-book'
    },
    getResourceIcon(type) {
      const icons = {
        pdf: 'fas fa-file-pdf',
        document: 'fas fa-file-alt',
        video: 'fas fa-video'
      }
      return icons[type] || 'fas fa-file'
    },
    getLessonButtonText(lesson) {
      if (lesson.completed) return 'Review'
      if (!lesson.available) return 'Locked'
      return 'Start'
    },
    startLesson(lesson) {
      // Implement lesson navigation
      console.log('Starting lesson:', lesson.id)
    }
  }
}
</script>

<style scoped>
.module-detail {
  padding: 2rem;
}

.module-header {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content h1 {
  margin: 0 0 1rem 0;
}

.module-meta {
  display: flex;
  gap: 1.5rem;
  color: #666;
}

.module-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
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
  width: 120px;
  height: 120px;
  position: relative;
}

.progress-circle svg {
  transform: rotate(-90deg);
}

.progress-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-text {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #4CAF50;
}

.progress-label {
  font-size: 0.9rem;
  color: #666;
}

.module-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.content-main > div,
.content-sidebar > div {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.description-card h2,
.lessons-list h2 {
  margin: 0 0 1rem 0;
}

.learning-objectives {
  margin-top: 1.5rem;
}

.learning-objectives h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.learning-objectives ul {
  margin: 0;
  padding-left: 1.5rem;
}

.learning-objectives li {
  margin-bottom: 0.5rem;
  color: #666;
}

.lesson-card {
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.lesson-card.completed {
  border-color: #4CAF50;
}

.lesson-info {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.lesson-status i {
  font-size: 1.5rem;
  color: #ddd;
}

.lesson-status i.completed {
  color: #4CAF50;
}

.lesson-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.lesson-content p {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.lesson-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.lesson-meta span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.start-btn {
  padding: 0.5rem 1.5rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
}

.start-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.resources-list,
.prerequisites-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: #f5f7fa;
  border-radius: 5px;
  color: inherit;
  text-decoration: none;
  transition: background 0.3s ease;
}

.resource-item:hover {
  background: #e8e8e8;
}

.prerequisite-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: #f5f7fa;
  border-radius: 5px;
}

.prerequisite-item i {
  color: #ddd;
}

.prerequisite-item i.completed {
  color: #4CAF50;
}

@media (max-width: 1024px) {
  .module-content {
    grid-template-columns: 1fr;
  }

  .module-header {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .module-meta {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .module-detail {
    padding: 1rem;
  }

  .lesson-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .start-btn {
    width: 100%;
  }
}
</style> 