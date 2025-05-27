<template>
  <div class="quiz-review">
    <div class="review-header">
      <h1>Quiz & Exam Review</h1>
      <div class="quiz-selector">
        <label for="quiz-select">Select Quiz:</label>
        <select id="quiz-select" v-model="selectedQuizId" @change="loadQuiz">
          <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
            {{ quiz.title }} ({{ formatDate(quiz.date) }})
          </option>
        </select>
      </div>
    </div>

    <div class="review-content" v-if="selectedQuiz">
      <div class="quiz-summary">
        <div class="summary-card">
          <div class="summary-header">
            <h2>{{ selectedQuiz.title }}</h2>
            <span class="quiz-date">{{ formatDate(selectedQuiz.date) }}</span>
          </div>
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-value">{{ selectedQuiz.score }}%</span>
              <span class="stat-label">Score</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ selectedQuiz.correctAnswers }}/{{ selectedQuiz.totalQuestions }}</span>
              <span class="stat-label">Correct</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ selectedQuiz.timeSpent }}</span>
              <span class="stat-label">Time</span>
            </div>
          </div>
        </div>
      </div>

      <div class="questions-review">
        <h2>Question Review</h2>
        <div class="questions-list">
          <div v-for="question in selectedQuiz.questions" :key="question.id" 
               :class="['question-card', { 'incorrect': !question.isCorrect }]">
            <div class="question-header">
              <span class="question-number">Question {{ question.number }}</span>
              <span :class="['question-status', question.isCorrect ? 'correct' : 'incorrect']">
                <i :class="question.isCorrect ? 'fas fa-check' : 'fas fa-times'"></i>
                {{ question.isCorrect ? 'Correct' : 'Incorrect' }}
              </span>
            </div>
            <div class="question-content">
              <h3>{{ question.text }}</h3>
              
              <!-- Multiple Choice -->
              <div v-if="question.type === 'multiple-choice'" class="options-list">
                <div v-for="option in question.options" :key="option.id"
                     :class="['option-item', {
                       'selected': option.id === question.selectedAnswer,
                       'correct': option.id === question.correctAnswer,
                       'incorrect': option.id === question.selectedAnswer && option.id !== question.correctAnswer
                     }]">
                  <span class="option-text">{{ option.text }}</span>
                  <span v-if="option.id === question.correctAnswer" class="option-icon correct">
                    <i class="fas fa-check"></i>
                  </span>
                  <span v-else-if="option.id === question.selectedAnswer" class="option-icon incorrect">
                    <i class="fas fa-times"></i>
                  </span>
                </div>
              </div>
              
              <!-- True/False -->
              <div v-if="question.type === 'true-false'" class="true-false-options">
                <div :class="['option-item', {
                  'selected': 'true' === question.selectedAnswer,
                  'correct': 'true' === question.correctAnswer,
                  'incorrect': 'true' === question.selectedAnswer && 'true' !== question.correctAnswer
                }]">
                  <span class="option-text">True</span>
                  <span v-if="'true' === question.correctAnswer" class="option-icon correct">
                    <i class="fas fa-check"></i>
                  </span>
                  <span v-else-if="'true' === question.selectedAnswer" class="option-icon incorrect">
                    <i class="fas fa-times"></i>
                  </span>
                </div>
                <div :class="['option-item', {
                  'selected': 'false' === question.selectedAnswer,
                  'correct': 'false' === question.correctAnswer,
                  'incorrect': 'false' === question.selectedAnswer && 'false' !== question.correctAnswer
                }]">
                  <span class="option-text">False</span>
                  <span v-if="'false' === question.correctAnswer" class="option-icon correct">
                    <i class="fas fa-check"></i>
                  </span>
                  <span v-else-if="'false' === question.selectedAnswer" class="option-icon incorrect">
                    <i class="fas fa-times"></i>
                  </span>
                </div>
              </div>
              
              <!-- Explanation Section (only for incorrect answers) -->
              <div v-if="!question.isCorrect" class="explanation-section">
                <h4><i class="fas fa-info-circle"></i> Explanation</h4>
                <p>{{ question.explanation }}</p>
                
                <!-- Link to Study Guide -->
                <div class="study-guide-link">
                  <h4><i class="fas fa-book"></i> Review Material</h4>
                  <router-link :to="`/student/study-guide/${question.relatedStudyGuideId}`" class="guide-link">
                    <i class="fas fa-external-link-alt"></i>
                    Study {{ question.relatedTopic }} in the Study Guide
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="review-actions">
        <button class="action-btn" @click="retakeQuiz">
          <i class="fas fa-redo"></i>
          Retake Quiz
        </button>
        <router-link :to="`/student/study-guide/${selectedQuiz.relatedStudyGuideId}`" class="action-btn primary">
          <i class="fas fa-book"></i>
          Go to Study Guide
        </router-link>
      </div>
    </div>

    <div class="no-quiz-selected" v-else>
      <div class="placeholder">
        <i class="fas fa-clipboard-list"></i>
        <p>Select a quiz from the dropdown to review your answers</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuizReview',
  data() {
    return {
      selectedQuizId: null,
      selectedQuiz: null,
      quizzes: [
        {
          id: 1,
          title: 'Mathematics Mid-Term',
          date: '2023-09-15T14:30:00',
          score: 78,
          correctAnswers: 7,
          totalQuestions: 9,
          timeSpent: '24:15',
          relatedStudyGuideId: 1,
          questions: [
            {
              id: 1,
              number: 1,
              type: 'multiple-choice',
              text: 'Solve for x: 2x² - 5x - 3 = 0',
              options: [
                { id: 'a', text: 'x = 3, x = -0.5' },
                { id: 'b', text: 'x = 3, x = 0.5' },
                { id: 'c', text: 'x = -3, x = 0.5' },
                { id: 'd', text: 'x = -3, x = -0.5' }
              ],
              selectedAnswer: 'a',
              correctAnswer: 'a',
              isCorrect: true,
              explanation: 'Using the quadratic formula: x = [-b ± √(b² - 4ac)]/2a, we get x = [5 ± √(25 + 24)]/4 = [5 ± √49]/4 = [5 ± 7]/4, which gives us x = 3 or x = -0.5'
            },
            {
              id: 2,
              number: 2,
              type: 'multiple-choice',
              text: 'Which of the following is a factor of x² - 9?',
              options: [
                { id: 'a', text: 'x - 3' },
                { id: 'b', text: 'x + 3' },
                { id: 'c', text: 'x - 9' },
                { id: 'd', text: 'Both A and B' }
              ],
              selectedAnswer: 'a',
              correctAnswer: 'd',
              isCorrect: false,
              explanation: 'x² - 9 = (x - 3)(x + 3), so both (x - 3) and (x + 3) are factors.',
              relatedStudyGuideId: 1,
              relatedTopic: 'Quadratic Equations'
            },
            {
              id: 3,
              number: 3,
              type: 'true-false',
              text: 'The quadratic formula can be used to solve any quadratic equation.',
              selectedAnswer: 'true',
              correctAnswer: 'true',
              isCorrect: true,
              explanation: 'The quadratic formula works for any quadratic equation in the form ax² + bx + c = 0, where a ≠ 0.'
            }
          ]
        },
        {
          id: 2,
          title: 'Physics Quiz: Newton\'s Laws',
          date: '2023-09-10T10:15:00',
          score: 70,
          correctAnswers: 7,
          totalQuestions: 10,
          timeSpent: '18:45',
          relatedStudyGuideId: 2,
          questions: [
            {
              id: 4,
              number: 1,
              type: 'multiple-choice',
              text: 'A 5 kg object experiences a net force of 20 N. What is its acceleration?',
              options: [
                { id: 'a', text: '0.25 m/s²' },
                { id: 'b', text: '4 m/s²' },
                { id: 'c', text: '100 m/s²' },
                { id: 'd', text: '25 m/s²' }
              ],
              selectedAnswer: 'b',
              correctAnswer: 'b',
              isCorrect: true,
              explanation: 'Using Newton\'s Second Law: F = ma, we get a = F/m = 20/5 = 4 m/s²'
            },
            {
              id: 5,
              number: 2,
              type: 'true-false',
              text: 'According to Newton\'s Third Law, for every action, there is an equal and opposite reaction that occurs simultaneously.',
              selectedAnswer: 'false',
              correctAnswer: 'true',
              isCorrect: false,
              explanation: 'Newton\'s Third Law states that for every action force, there is an equal and opposite reaction force. These forces act simultaneously on different objects.',
              relatedStudyGuideId: 2,
              relatedTopic: 'Newton\'s Laws'
            }
          ]
        }
      ]
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    },
    loadQuiz() {
      this.selectedQuiz = this.quizzes.find(quiz => quiz.id === this.selectedQuizId);
    },
    retakeQuiz() {
      // Navigate to take the quiz again (to be implemented)
      alert(`Retaking quiz: ${this.selectedQuiz.title}`);
    }
  }
}
</script>

<style scoped>
.quiz-review {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 2rem 1.5rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.review-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #1a237e;
}

.quiz-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.quiz-selector label {
  font-weight: 600;
  color: #333;
}

.quiz-selector select {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
}

.review-content {
  max-width: 900px;
  margin: 0 auto;
}

.quiz-summary {
  margin-bottom: 2rem;
}

.summary-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.summary-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.quiz-date {
  color: #757575;
  font-size: 0.9rem;
}

.summary-stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a237e;
}

.stat-label {
  font-size: 0.9rem;
  color: #757575;
  margin-top: 0.25rem;
}

.questions-review {
  margin-bottom: 2rem;
}

.questions-review h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: #333;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.question-card.incorrect {
  border-left: 4px solid #F44336;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.question-number {
  font-weight: 600;
  color: #333;
}

.question-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.question-status.correct {
  color: #4CAF50;
}

.question-status.incorrect {
  color: #F44336;
}

.question-content {
  padding: 1.5rem;
}

.question-content h3 {
  margin-top: 0;
  margin-bottom: 1.25rem;
  font-size: 1.1rem;
}

.options-list, .true-false-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
}

.option-item.selected {
  background-color: #e3f2fd;
  border-color: #90caf9;
}

.option-item.correct {
  background-color: #e8f5e9;
  border-color: #a5d6a7;
}

.option-item.incorrect {
  background-color: #ffebee;
  border-color: #ef9a9a;
}

.option-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.option-icon.correct {
  background-color: #4CAF50;
  color: white;
}

.option-icon.incorrect {
  background-color: #F44336;
  color: white;
}

.explanation-section {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.explanation-section h4 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.explanation-section p {
  margin: 0;
  line-height: 1.6;
}

.study-guide-link {
  margin-top: 1.5rem;
}

.guide-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #e8eaf6;
  color: #3f51b5;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.review-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  border: none;
  font-size: 1rem;
  background-color: #f5f5f5;
  color: #333;
}

.action-btn.primary {
  background-color: #1a237e;
  color: white;
}

.no-quiz-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.placeholder {
  text-align: center;
  color: #9e9e9e;
}

.placeholder i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.placeholder p {
  font-size: 1.1rem;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .quiz-review {
    padding: 1.5rem 1rem;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .summary-stats {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .question-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .review-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 