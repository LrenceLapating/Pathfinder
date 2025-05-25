<template>
  <div class="remedial-enrichment">
    <div class="page-header">
      <h1><i class="fas fa-graduation-cap"></i> Learning Support</h1>
      <div class="header-actions">
        <button class="action-btn">
          <i class="fas fa-filter"></i>
          Filter
        </button>
        <button class="action-btn">
          <i class="fas fa-sort"></i>
          Sort
        </button>
      </div>
    </div>

    <div class="content-grid">
      <!-- Support Resources -->
      <div class="section">
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

      <!-- Advanced Challenges -->
      <div class="section">
        <h2>Advanced Challenges</h2>
        <div class="challenge-grid">
          <div v-for="challenge in advancedChallenges" 
               :key="challenge.id" 
               class="challenge-card">
            <div class="challenge-header">
              <div class="challenge-icon">
                <i :class="challenge.icon"></i>
              </div>
              <div class="difficulty-badge" :class="challenge.difficulty.toLowerCase()">
                {{ challenge.difficulty }}
              </div>
            </div>
            <div class="challenge-content">
              <h4>{{ challenge.title }}</h4>
              <p>{{ challenge.description }}</p>
              <div class="challenge-stats">
                <div class="stat">
                  <i class="fas fa-star"></i>
                  {{ challenge.xp }} XP
                </div>
                <div class="stat">
                  <i class="fas fa-users"></i>
                  {{ challenge.participants }} participants
                </div>
                <div class="stat">
                  <i class="fas fa-check-circle"></i>
                  {{ challenge.completions }} completions
                </div>
              </div>
            </div>
            <button @click="startChallenge(challenge)" class="challenge-btn">
              Accept Challenge
            </button>
          </div>
        </div>
      </div>

      <!-- Progress Tracking -->
      <div class="section">
        <h2>Your Progress</h2>
        <div class="progress-cards">
          <div class="progress-card">
            <h3>Completed Resources</h3>
            <div class="progress-stat">
              <span class="value">12</span>
              <span class="label">resources</span>
            </div>
            <div class="progress-bar">
              <div class="progress" style="width: 60%"></div>
            </div>
          </div>
          <div class="progress-card">
            <h3>Challenges Completed</h3>
            <div class="progress-stat">
              <span class="value">5</span>
              <span class="label">challenges</span>
            </div>
            <div class="progress-bar">
              <div class="progress" style="width: 40%"></div>
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
      ]
    }
  },
  methods: {
    openResource(resource) {
      // Implement resource opening logic
      console.log('Opening resource:', resource)
    },
    startChallenge(challenge) {
      // Implement challenge starting logic
      console.log('Starting challenge:', challenge)
    }
  }
}
</script>

<style scoped>
.remedial-enrichment {
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

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748B;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #CBD5E1;
  background: #F8FAFC;
}

.content-grid {
  display: grid;
  gap: 2rem;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  color: #1A1A1A;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.resource-card {
  background: #F8FAFC;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.resource-icon {
  width: 48px;
  height: 48px;
  background: #C84C1C;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.resource-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #1A1A1A;
}

.resource-content p {
  margin: 0;
  color: #64748B;
  font-size: 0.9rem;
}

.resource-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #64748B;
}

.duration {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.resource-btn {
  padding: 0.5rem;
  background: #C84C1C;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.resource-btn:hover {
  background: #B43D0E;
}

.challenge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.challenge-card {
  background: #F8FAFC;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.challenge-icon {
  width: 48px;
  height: 48px;
  background: #2563EB;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.difficulty-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.difficulty-badge.expert {
  background: #FEE2E2;
  color: #991B1B;
}

.difficulty-badge.advanced {
  background: #E0E7FF;
  color: #3730A3;
}

.challenge-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #1A1A1A;
}

.challenge-content p {
  margin: 0;
  color: #64748B;
  font-size: 0.9rem;
}

.challenge-stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #64748B;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.challenge-btn {
  padding: 0.5rem;
  background: #2563EB;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.challenge-btn:hover {
  background: #1D4ED8;
}

.progress-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.progress-card {
  background: #F8FAFC;
  border-radius: 8px;
  padding: 1.5rem;
}

.progress-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #1A1A1A;
}

.progress-stat {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.progress-stat .value {
  font-size: 2rem;
  font-weight: 600;
  color: #1A1A1A;
}

.progress-stat .label {
  color: #64748B;
}

.progress-bar {
  height: 6px;
  background: #E2E8F0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar .progress {
  height: 100%;
  background: #C84C1C;
  border-radius: 3px;
  transition: width 0.3s ease;
}
</style> 