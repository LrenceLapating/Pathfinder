<template>
  <div class="quiz-container">
    <!-- Quiz Header -->
    <div class="quiz-header" v-if="!quizCompleted">
      <div class="quiz-info">
        <h1>{{ quiz.title }}</h1>
        <p>{{ quiz.description }}</p>
      </div>
      <div class="quiz-progress">
        <div class="progress-text">
          Question {{ currentQuestionIndex + 1 }} of {{ quiz.questions.length }}
        </div>
        <div class="progress-bar">
          <div 
            :style="{ width: (currentQuestionIndex + 1) / quiz.questions.length * 100 + '%' }" 
            class="progress"
          ></div>
        </div>
      </div>
      <div v-if="quiz.timeLimit" class="timer">
        <i class="fas fa-clock"></i>
        {{ formatTime(timeRemaining) }}
      </div>
    </div>

    <!-- Quiz Content -->
    <div class="quiz-content" v-if="!quizCompleted">
      <div class="question-card">
        <div class="question-header">
          <span class="difficulty" :class="currentQuestion.difficulty">
            {{ currentQuestion.difficulty }}
          </span>
          <span class="points">
            {{ currentQuestion.points }} points
          </span>
        </div>

        <div class="question-content">
          <h2>{{ currentQuestion.question }}</h2>
          
          <!-- Question Media (if any) -->
          <div v-if="currentQuestion.media" class="question-media">
            <img v-if="currentQuestion.media.type === 'image'" :src="currentQuestion.media.url" :alt="currentQuestion.media.alt">
            <video v-if="currentQuestion.media.type === 'video'" controls>
              <source :src="currentQuestion.media.url" :type="currentQuestion.media.mimeType">
            </video>
          </div>

          <!-- Multiple Choice -->
          <div v-if="currentQuestion.type === 'multiple-choice'" class="options-grid">
            <button 
              v-for="option in currentQuestion.options" 
              :key="option.id"
              :class="['option-btn', {
                'selected': selectedAnswer === option.id,
                'correct': showFeedback && option.id === currentQuestion.correctAnswer,
                'incorrect': showFeedback && selectedAnswer === option.id && selectedAnswer !== currentQuestion.correctAnswer
              }]"
              @click="selectAnswer(option.id)"
              :disabled="showFeedback"
            >
              <span class="option-text">{{ option.text }}</span>
              <i v-if="showFeedback && option.id === currentQuestion.correctAnswer" 
                 class="fas fa-check"></i>
              <i v-if="showFeedback && selectedAnswer === option.id && selectedAnswer !== currentQuestion.correctAnswer" 
                 class="fas fa-times"></i>
            </button>
          </div>

          <!-- True/False -->
          <div v-if="currentQuestion.type === 'true-false'" class="true-false-buttons">
            <button 
              v-for="option in ['true', 'false']" 
              :key="option"
              :class="['tf-btn', {
                'selected': selectedAnswer === option,
                'correct': showFeedback && option === currentQuestion.correctAnswer,
                'incorrect': showFeedback && selectedAnswer === option && selectedAnswer !== currentQuestion.correctAnswer
              }]"
              @click="selectAnswer(option)"
              :disabled="showFeedback"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <!-- Feedback Section -->
        <div v-if="showFeedback" class="feedback-section" 
             :class="isCorrect ? 'correct-feedback' : 'incorrect-feedback'">
          <div class="feedback-header">
            <i :class="isCorrect ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
            <h3>{{ isCorrect ? 'Correct!' : 'Not quite right' }}</h3>
          </div>
          <p>{{ currentQuestion.explanation }}</p>
          <button class="next-btn" @click="nextQuestion">
            {{ isLastQuestion ? 'Complete Quiz' : 'Next Question' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quiz Results -->
    <div v-if="quizCompleted" class="quiz-results">
      <div class="results-card">
        <div class="results-header">
          <i class="fas fa-trophy"></i>
          <h2>Quiz Completed!</h2>
        </div>

        <div class="score-section">
          <div class="score-circle">
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                stroke-width="3"
              />
              <path d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                :stroke="scoreColor"
                stroke-width="3"
                :stroke-dasharray="score + ', 100'"
              />
            </svg>
            <div class="score-text">
              <span class="score-percentage">{{ score }}%</span>
              <span class="score-label">Score</span>
            </div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <i class="fas fa-check"></i>
            <span class="stat-value">{{ correctAnswers }}</span>
            <span class="stat-label">Correct</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-times"></i>
            <span class="stat-value">{{ quiz.questions.length - correctAnswers }}</span>
            <span class="stat-label">Incorrect</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-clock"></i>
            <span class="stat-value">{{ formatTime(timeTaken) }}</span>
            <span class="stat-label">Time</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-star"></i>
            <span class="stat-value">{{ earnedXP }}</span>
            <span class="stat-label">XP Earned</span>
          </div>
        </div>

        <div class="results-actions">
          <button class="review-btn" @click="reviewQuiz">
            <i class="fas fa-search"></i>
            Review Answers
          </button>
          <button class="retry-btn" @click="retryQuiz">
            <i class="fas fa-redo"></i>
            Try Again
          </button>
        </div>

        <!-- Earned Badges -->
        <div v-if="earnedBadges.length" class="earned-badges">
          <h3>Badges Earned</h3>
          <div class="badges-list">
            <div v-for="badge in earnedBadges" :key="badge.id" class="badge-item">
              <i :class="badge.icon"></i>
              <span>{{ badge.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Quiz',
  data() {
    return {
      quiz: {
        title: 'Mathematics Diagnostic Test',
        description: 'This quiz will help us understand your current math level',
        timeLimit: 1800, // 30 minutes in seconds
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            difficulty: 'easy',
            points: 10,
            question: 'What is 2 + 2?',
            options: [
              { id: 'a', text: '3' },
              { id: 'b', text: '4' },
              { id: 'c', text: '5' },
              { id: 'd', text: '6' }
            ],
            correctAnswer: 'b',
            explanation: '2 + 2 = 4 is a basic arithmetic operation.'
          },
          // Add more questions here
        ]
      },
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showFeedback: false,
      timeRemaining: 0,
      timeTaken: 0,
      quizCompleted: false,
      correctAnswers: 0,
      earnedXP: 0,
      earnedBadges: []
    }
  },
  computed: {
    currentQuestion() {
      return this.quiz.questions[this.currentQuestionIndex]
    },
    isLastQuestion() {
      return this.currentQuestionIndex === this.quiz.questions.length - 1
    },
    isCorrect() {
      return this.selectedAnswer === this.currentQuestion.correctAnswer
    },
    score() {
      return Math.round((this.correctAnswers / this.quiz.questions.length) * 100)
    },
    scoreColor() {
      if (this.score >= 80) return '#4CAF50'
      if (this.score >= 60) return '#FF9800'
      return '#f44336'
    }
  },
  created() {
    if (this.quiz.timeLimit) {
      this.timeRemaining = this.quiz.timeLimit
      this.startTimer()
    }
  },
  methods: {
    startTimer() {
      const timer = setInterval(() => {
        if (this.timeRemaining > 0 && !this.quizCompleted) {
          this.timeRemaining--
          this.timeTaken++
        } else {
          clearInterval(timer)
          if (!this.quizCompleted && this.timeRemaining === 0) {
            this.completeQuiz()
          }
        }
      }, 1000)
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return minutes + ':' + remainingSeconds.toString().padStart(2, '0')
    },
    selectAnswer(answer) {
      if (this.showFeedback) return
      this.selectedAnswer = answer
      this.showFeedback = true
      
      if (this.isCorrect) {
        this.correctAnswers++
        this.earnedXP += this.currentQuestion.points
      }
    },
    nextQuestion() {
      this.showFeedback = false
      this.selectedAnswer = null
      
      if (this.isLastQuestion) {
        this.completeQuiz()
      } else {
        this.currentQuestionIndex++
      }
    },
    completeQuiz() {
      this.quizCompleted = true
      this.checkBadges()
    },
    checkBadges() {
      // Example badge conditions
      if (this.score >= 90) {
        this.earnedBadges.push({
          id: 1,
          name: 'Excellence',
          icon: 'fas fa-crown'
        })
      }
      if (this.timeTaken < this.quiz.timeLimit / 2) {
        this.earnedBadges.push({
          id: 2,
          name: 'Speed Demon',
          icon: 'fas fa-bolt'
        })
      }
    },
    reviewQuiz() {
      // Implement quiz review functionality
    },
    retryQuiz() {
      this.currentQuestionIndex = 0
      this.selectedAnswer = null
      this.showFeedback = false
      this.quizCompleted = false
      this.correctAnswers = 0
      this.earnedXP = 0
      this.earnedBadges = []
      this.timeRemaining = this.quiz.timeLimit
      this.timeTaken = 0
      this.startTimer()
    }
  }
}
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.quiz-header {
  margin-bottom: 2rem;
}

.quiz-info h1 {
  margin: 0 0 0.5rem 0;
}

.quiz-info p {
  color: #666;
}

.quiz-progress {
  margin-top: 1rem;
}

.progress-text {
  margin-bottom: 0.5rem;
  color: #666;
}

.progress-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
}

.progress {
  height: 100%;
  background: #4CAF50;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.timer {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #666;
}

.question-card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.question-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.difficulty {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
}

.difficulty.easy {
  background: #E8F5E9;
  color: #4CAF50;
}

.difficulty.medium {
  background: #FFF3E0;
  color: #FF9800;
}

.difficulty.hard {
  background: #FFEBEE;
  color: #f44336;
}

.points {
  color: #666;
}

.question-content h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
}

.question-media {
  margin: 1rem 0;
  text-align: center;
}

.question-media img,
.question-media video {
  max-width: 100%;
  border-radius: 5px;
}

.options-grid {
  display: grid;
  gap: 1rem;
}

.option-btn {
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.option-btn:hover:not(:disabled) {
  border-color: #4CAF50;
}

.option-btn.selected {
  border-color: #4CAF50;
  background: #E8F5E9;
}

.option-btn.correct {
  border-color: #4CAF50;
  background: #E8F5E9;
}

.option-btn.incorrect {
  border-color: #f44336;
  background: #FFEBEE;
}

.true-false-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.tf-btn {
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.feedback-section {
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 10px;
}

.correct-feedback {
  background: #E8F5E9;
}

.incorrect-feedback {
  background: #FFEBEE;
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.feedback-header i {
  font-size: 1.5rem;
}

.correct-feedback i {
  color: #4CAF50;
}

.incorrect-feedback i {
  color: #f44336;
}

.next-btn {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.quiz-results {
  text-align: center;
}

.results-card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.results-header {
  margin-bottom: 2rem;
}

.results-header i {
  font-size: 3rem;
  color: #FFD700;
  margin-bottom: 1rem;
}

.score-section {
  margin: 2rem 0;
}

.score-circle {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.circular-chart {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-percentage {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
}

.score-label {
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.results-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.review-btn,
.retry-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.review-btn {
  background: #2196F3;
  color: white;
}

.retry-btn {
  background: #f5f7fa;
  color: #333;
}

.earned-badges {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.badges-list {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.badge-item i {
  font-size: 2rem;
  color: #FFD700;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .results-actions {
    flex-direction: column;
  }
}
</style> 