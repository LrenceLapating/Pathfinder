<template>
  <div class="remedial-enrichment">
    <div class="section-header">
      <h1>Additional Learning Resources</h1>
      <div class="view-toggle">
        <button 
          :class="['toggle-btn', { active: currentView === 'remedial' }]"
          @click="currentView = 'remedial'"
        >
          Remedial Support
        </button>
        <button 
          :class="['toggle-btn', { active: currentView === 'enrichment' }]"
          @click="currentView = 'enrichment'"
        >
          Enrichment Activities
        </button>
      </div>
    </div>

    <div class="content-section">
      <!-- Remedial Content -->
      <div v-if="currentView === 'remedial'" class="remedial-content">
        <div class="recommendation-section">
          <h2>Recommended Practice Areas</h2>
          <div class="recommendation-cards">
            <div v-for="area in recommendedAreas" 
                 :key="area.id" 
                 class="recommendation-card">
              <div class="card-header">
                <i :class="area.icon"></i>
                <h3>{{ area.title }}</h3>
              </div>
              <p>{{ area.description }}</p>
              <div class="progress-section">
                <div class="progress-bar">
                  <div 
                    :style="{ width: area.mastery + '%' }" 
                    class="progress"
                  ></div>
                </div>
                <span class="progress-label">{{ area.mastery }}% Mastery</span>
              </div>
              <button @click="startPractice(area)" class="practice-btn">
                Start Practice
              </button>
            </div>
          </div>
        </div>

        <div class="resources-section">
          <h2>Support Resources</h2>
          <div class="resource-grid">
            <div v-for="resource in supportResources" 
                 :key="resource.id" 
                 class="resource-card">
              <div class="resource-icon">
                <i :class="resource.icon"></i>
              </div>
              <div class="resource-content">
                <h4>{{ resource.title }}</h4>
                <p>{{ resource.description }}</p>
                <div class="resource-meta">
                  <span class="duration">
                    <i class="fas fa-clock"></i>
                    {{ resource.duration }} min
                  </span>
                  <span class="type">{{ resource.type }}</span>
                </div>
              </div>
              <button @click="openResource(resource)" class="resource-btn">
                View Resource
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Enrichment Content -->
      <div v-else class="enrichment-content">
        <div class="challenges-section">
          <h2>Advanced Challenges</h2>
          <div class="challenge-cards">
            <div v-for="challenge in advancedChallenges" 
                 :key="challenge.id" 
                 class="challenge-card">
              <div class="challenge-header">
                <div class="challenge-icon">
                  <i :class="challenge.icon"></i>
                </div>
                <div class="challenge-info">
                  <h3>{{ challenge.title }}</h3>
                  <div class="challenge-meta">
                    <span class="difficulty">
                      <i class="fas fa-star"></i>
                      {{ challenge.difficulty }}
                    </span>
                    <span class="xp">
                      +{{ challenge.xp }} XP
                    </span>
                  </div>
                </div>
              </div>
              <p>{{ challenge.description }}</p>
              <div class="challenge-stats">
                <span>
                  <i class="fas fa-users"></i>
                  {{ challenge.participants }} participants
                </span>
                <span>
                  <i class="fas fa-trophy"></i>
                  {{ challenge.completions }} completed
                </span>
              </div>
              <button @click="startChallenge(challenge)" class="challenge-btn">
                Accept Challenge
              </button>
            </div>
          </div>
        </div>

        <div class="projects-section">
          <h2>Extended Learning Projects</h2>
          <div class="project-cards">
            <div v-for="project in extendedProjects" 
                 :key="project.id" 
                 class="project-card">
              <img :src="project.image" :alt="project.title" class="project-image">
              <div class="project-content">
                <h3>{{ project.title }}</h3>
                <p>{{ project.description }}</p>
                <div class="project-meta">
                  <span class="duration">
                    <i class="fas fa-calendar"></i>
                    {{ project.duration }}
                  </span>
                  <span class="skills">
                    <i class="fas fa-tools"></i>
                    {{ project.skills.join(', ') }}
                  </span>
                </div>
                <button @click="startProject(project)" class="project-btn">
                  Start Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RemedialEnrichment',
  data() {
    return {
      currentView: 'remedial',
      recommendedAreas: [
        {
          id: 1,
          title: 'Algebra Fundamentals',
          description: 'Review basic algebraic concepts and equations',
          icon: 'fas fa-square-root-alt',
          mastery: 65
        },
        {
          id: 2,
          title: 'Reading Comprehension',
          description: 'Practice understanding complex texts',
          icon: 'fas fa-book-reader',
          mastery: 78
        },
        {
          id: 3,
          title: 'Scientific Method',
          description: 'Strengthen your understanding of experimental design',
          icon: 'fas fa-flask',
          mastery: 45
        }
      ],
      supportResources: [
        {
          id: 1,
          title: 'Video Tutorial: Solving Equations',
          description: 'Step-by-step guide to solving linear equations',
          icon: 'fas fa-play-circle',
          type: 'Video',
          duration: 15
        },
        {
          id: 2,
          title: 'Interactive Grammar Guide',
          description: 'Practice with common grammar rules',
          icon: 'fas fa-pencil-alt',
          type: 'Interactive',
          duration: 20
        },
        {
          id: 3,
          title: 'Science Concept Maps',
          description: 'Visual guides to key scientific concepts',
          icon: 'fas fa-project-diagram',
          type: 'Study Guide',
          duration: 30
        }
      ],
      advancedChallenges: [
        {
          id: 1,
          title: 'Advanced Calculus Challenge',
          description: 'Test your skills with complex integration problems',
          icon: 'fas fa-infinity',
          difficulty: 'Expert',
          xp: 500,
          participants: 156,
          completions: 43
        },
        {
          id: 2,
          title: 'Literature Analysis',
          description: 'Deep dive into Shakespeare\'s complex themes',
          icon: 'fas fa-feather-alt',
          difficulty: 'Advanced',
          xp: 400,
          participants: 234,
          completions: 89
        },
        {
          id: 3,
          title: 'Physics Olympiad Prep',
          description: 'Competition-level physics problems',
          icon: 'fas fa-atom',
          difficulty: 'Expert',
          xp: 600,
          participants: 98,
          completions: 27
        }
      ],
      extendedProjects: [
        {
          id: 1,
          title: 'Research Project: Climate Change',
          description: 'Conduct an in-depth analysis of climate data',
          image: '/images/climate-project.jpg',
          duration: '4 weeks',
          skills: ['Research', 'Data Analysis', 'Scientific Writing']
        },
        {
          id: 2,
          title: 'Literary Magazine',
          description: 'Create and publish original literary works',
          image: '/images/literature-project.jpg',
          duration: '6 weeks',
          skills: ['Creative Writing', 'Editing', 'Publishing']
        },
        {
          id: 3,
          title: 'Math Modeling Competition',
          description: 'Solve real-world problems using mathematical models',
          image: '/images/math-project.jpg',
          duration: '3 weeks',
          skills: ['Mathematical Modeling', 'Problem Solving', 'Programming']
        }
      ]
    }
  },
  methods: {
    startPractice(area) {
      // Navigate to practice session
      this.$router.push(`/student/practice/${area.id}`)
    },
    openResource(resource) {
      // Open resource in modal or new page
      this.$emit('open-resource', resource)
    },
    startChallenge(challenge) {
      // Navigate to challenge page
      this.$router.push(`/student/challenges/${challenge.id}`)
    },
    startProject(project) {
      // Navigate to project page
      this.$router.push(`/student/projects/${project.id}`)
    }
  }
}
</script>

<style scoped>
.remedial-enrichment {
  padding: 2rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h1 {
  margin-bottom: 1rem;
}

.view-toggle {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.toggle-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #4CAF50;
  border-radius: 25px;
  background: white;
  color: #4CAF50;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: #4CAF50;
  color: white;
}

.content-section {
  margin-top: 2rem;
}

/* Remedial Content Styles */
.recommendation-cards,
.resource-grid,
.challenge-cards,
.project-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.recommendation-card,
.resource-card,
.challenge-card,
.project-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.card-header i {
  font-size: 1.5rem;
  color: #4CAF50;
}

.progress-section {
  margin: 1rem 0;
}

.progress-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  margin-bottom: 0.5rem;
}

.progress {
  height: 100%;
  background: #4CAF50;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-label {
  font-size: 0.9rem;
  color: #666;
}

.practice-btn,
.resource-btn,
.challenge-btn,
.project-btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  background: #4CAF50;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.practice-btn:hover,
.resource-btn:hover,
.challenge-btn:hover,
.project-btn:hover {
  background: #388E3C;
}

/* Resource Card Styles */
.resource-card {
  display: flex;
  flex-direction: column;
}

.resource-icon {
  width: 50px;
  height: 50px;
  background: #E8F5E9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.resource-icon i {
  font-size: 1.5rem;
  color: #4CAF50;
}

.resource-meta {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #666;
}

/* Challenge Card Styles */
.challenge-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.challenge-icon {
  width: 50px;
  height: 50px;
  background: #E8F5E9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.challenge-icon i {
  font-size: 1.5rem;
  color: #4CAF50;
}

.challenge-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.difficulty {
  color: #FFD700;
}

.xp {
  color: #4CAF50;
}

.challenge-stats {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #666;
}

/* Project Card Styles */
.project-card {
  overflow: hidden;
}

.project-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #666;
}

.skills {
  color: #2196F3;
}

@media (max-width: 768px) {
  .remedial-enrichment {
    padding: 1rem;
  }

  .view-toggle {
    flex-direction: column;
  }

  .recommendation-cards,
  .resource-grid,
  .challenge-cards,
  .project-cards {
    grid-template-columns: 1fr;
  }

  .challenge-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style> 