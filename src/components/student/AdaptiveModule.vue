<template>
  <div class="adaptive-module">
    <div class="module-header">
      <h2>{{ module.title }}</h2>
      <div class="difficulty-controls">
        <button 
          v-if="canDecreaseDifficulty" 
          @click="adjustDifficulty('decrease')" 
          class="difficulty-btn easier"
        >
          Need Easier Version
        </button>
        <button 
          v-if="canIncreaseDifficulty" 
          @click="adjustDifficulty('increase')" 
          class="difficulty-btn harder"
        >
          Ready for a Challenge
        </button>
      </div>
    </div>

    <div class="module-content">
      <!-- Dynamic content based on current difficulty -->
      <div v-if="loading" class="loading-state">
        Adjusting content to your level...
      </div>
      <div v-else>
        <div class="content-section" v-for="(section, index) in currentContent" :key="index">
          <component 
            :is="section.type" 
            v-bind="section.props"
            @response="trackResponse"
          />
        </div>
      </div>
    </div>

    <div class="performance-metrics" v-if="showMetrics">
      <div class="metric-card">
        <h3>Response Time</h3>
        <p>Average: {{ averageResponseTime }}s</p>
        <div class="progress-bar">
          <div :style="{ width: responseTimePercentage + '%' }" class="progress"></div>
        </div>
      </div>
      <div class="metric-card">
        <h3>Accuracy</h3>
        <p>{{ accuracy }}%</p>
        <div class="progress-bar">
          <div :style="{ width: accuracy + '%' }" class="progress"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdaptiveModule',
  props: {
    moduleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      module: null,
      currentDifficulty: 'medium',
      difficultyLevels: ['beginner', 'easy', 'medium', 'hard', 'expert'],
      loading: true,
      currentContent: [],
      performanceMetrics: {
        responseTimes: [],
        correctAnswers: 0,
        totalQuestions: 0
      },
      adaptiveThresholds: {
        responseTime: {
          tooSlow: 45, // seconds
          tooFast: 10  // seconds
        },
        accuracy: {
          decrease: 60, // below 60% suggests need for easier content
          increase: 85  // above 85% suggests ready for harder content
        }
      },
      showMetrics: false
    }
  },
  computed: {
    canDecreaseDifficulty() {
      return this.difficultyLevels.indexOf(this.currentDifficulty) > 0
    },
    canIncreaseDifficulty() {
      return this.difficultyLevels.indexOf(this.currentDifficulty) < this.difficultyLevels.length - 1
    },
    averageResponseTime() {
      if (this.performanceMetrics.responseTimes.length === 0) return 0
      const sum = this.performanceMetrics.responseTimes.reduce((a, b) => a + b, 0)
      return (sum / this.performanceMetrics.responseTimes.length).toFixed(1)
    },
    responseTimePercentage() {
      const avg = parseFloat(this.averageResponseTime)
      const optimal = 20 // optimal response time in seconds
      return Math.min(100, (optimal / avg) * 100)
    },
    accuracy() {
      if (this.performanceMetrics.totalQuestions === 0) return 0
      return Math.round((this.performanceMetrics.correctAnswers / this.performanceMetrics.totalQuestions) * 100)
    }
  },
  methods: {
    async loadModule() {
      try {
        this.loading = true
        // Fetch module data from API
        const response = await this.$api.modules.get(this.moduleId)
        this.module = response.data
        await this.loadContentForDifficulty(this.currentDifficulty)
      } catch (error) {
        console.error('Error loading module:', error)
      } finally {
        this.loading = false
      }
    },
    async loadContentForDifficulty(difficulty) {
      try {
        this.loading = true
        // Fetch content for specific difficulty
        const response = await this.$api.modules.getContent({
          moduleId: this.moduleId,
          difficulty
        })
        this.currentContent = response.data
      } catch (error) {
        console.error('Error loading content:', error)
      } finally {
        this.loading = false
      }
    },
    async adjustDifficulty(direction) {
      const currentIndex = this.difficultyLevels.indexOf(this.currentDifficulty)
      const newIndex = direction === 'increase' ? currentIndex + 1 : currentIndex - 1
      
      if (newIndex >= 0 && newIndex < this.difficultyLevels.length) {
        this.currentDifficulty = this.difficultyLevels[newIndex]
        await this.loadContentForDifficulty(this.currentDifficulty)
        
        // Reset performance metrics for new difficulty level
        this.resetMetrics()
      }
    },
    trackResponse(response) {
      // Track response time
      this.performanceMetrics.responseTimes.push(response.time)
      
      // Track accuracy
      if (response.correct) {
        this.performanceMetrics.correctAnswers++
      }
      this.performanceMetrics.totalQuestions++
      
      // Show metrics after collecting some data
      if (this.performanceMetrics.totalQuestions >= 3) {
        this.showMetrics = true
      }
      
      // Check if difficulty adjustment is needed
      this.checkForAutomaticAdjustment()
    },
    checkForAutomaticAdjustment() {
      if (this.performanceMetrics.totalQuestions < 5) return // Need minimum data
      
      const avgTime = parseFloat(this.averageResponseTime)
      
      // Check response time indicators
      if (avgTime > this.adaptiveThresholds.responseTime.tooSlow) {
        this.suggestEasier('Response time indicates content might be too challenging')
      } else if (avgTime < this.adaptiveThresholds.responseTime.tooFast && this.accuracy > 90) {
        this.suggestHarder('You\'re solving problems quickly and accurately')
      }
      
      // Check accuracy indicators
      if (this.accuracy < this.adaptiveThresholds.accuracy.decrease) {
        this.suggestEasier('Accuracy indicates content might be too challenging')
      } else if (this.accuracy > this.adaptiveThresholds.accuracy.increase) {
        this.suggestHarder('High accuracy indicates you\'re ready for more challenging content')
      }
    },
    suggestEasier(reason) {
      if (this.canDecreaseDifficulty) {
        this.$emit('difficulty-suggestion', {
          type: 'decrease',
          reason,
          currentMetrics: {
            accuracy: this.accuracy,
            responseTime: this.averageResponseTime
          }
        })
      }
    },
    suggestHarder(reason) {
      if (this.canIncreaseDifficulty) {
        this.$emit('difficulty-suggestion', {
          type: 'increase',
          reason,
          currentMetrics: {
            accuracy: this.accuracy,
            responseTime: this.averageResponseTime
          }
        })
      }
    },
    resetMetrics() {
      this.performanceMetrics = {
        responseTimes: [],
        correctAnswers: 0,
        totalQuestions: 0
      }
      this.showMetrics = false
    }
  },
  mounted() {
    this.loadModule()
  },
  watch: {
    moduleId: {
      handler: 'loadModule',
      immediate: true
    }
  }
}
</script>

<style scoped>
.adaptive-module {
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.module-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1A1A1A;
}

.difficulty-controls {
  display: flex;
  gap: 1rem;
}

.difficulty-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.difficulty-btn.easier {
  background: #FEF3C7;
  color: #92400E;
}

.difficulty-btn.harder {
  background: #C84C1C;
  color: white;
}

.difficulty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.performance-metrics {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-card {
  background: #F8FAFC;
  padding: 1.5rem;
  border-radius: 12px;
}

.metric-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #666;
}

.metric-card p {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1A1A1A;
}

.progress-bar {
  height: 6px;
  background: #E2E8F0;
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #C84C1C;
  transition: width 0.3s ease;
}

.content-section {
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .adaptive-module {
    padding: 1rem;
  }

  .module-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .difficulty-controls {
    width: 100%;
    justify-content: center;
  }
}
</style> 