<template>
  <div class="study-guide">
    <div class="guide-header">
      <h1>Personalized Study Guides</h1>
      <p class="subtitle">Focus on your weak topics to improve your mastery</p>
    </div>

    <div class="guide-content">
      <!-- Study Guide Grid -->
      <div class="guides-grid">
        <div v-for="guide in studyGuides" :key="guide.id" class="guide-card">
          <div class="guide-card-header" :style="{ backgroundColor: getMasteryColor(guide.masteryLevel) }">
            <div class="subject-badge">{{ guide.subject }}</div>
            <h2>{{ guide.topic }}</h2>
            <div class="mastery-level">
              <span>Mastery: {{ guide.masteryLevel }}%</span>
              <div class="progress-bar">
                <div class="progress" :style="{ width: `${guide.masteryLevel}%` }"></div>
              </div>
            </div>
          </div>

          <div class="guide-card-content">
            <!-- Progress Tracker -->
            <div class="progress-tracker">
              <span class="progress-text">{{ guide.completedItems }} / {{ guide.totalItems }} completed</span>
              <div class="progress-bar">
                <div class="progress" :style="{ width: `${guide.completionPercentage}%` }"></div>
              </div>
            </div>

            <!-- Resource Boxes Grid -->
            <div class="resource-grid">
              <!-- Key Concepts Box -->
              <div class="resource-box" @click="openModal('concepts', guide)">
                <div class="resource-icon">
                  <i class="fas fa-lightbulb"></i>
                </div>
                <div class="resource-title">Key Concepts</div>
                <div class="resource-status" :class="{ completed: guide.conceptsRead }">
                  <i :class="guide.conceptsRead ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                </div>
              </div>

              <!-- Practice Questions Box -->
              <div class="resource-box" @click="openModal('questions', guide)">
                <div class="resource-icon">
                  <i class="fas fa-tasks"></i>
                </div>
                <div class="resource-title">Practice Questions</div>
                <div class="resource-status" :class="{ completed: isResourceCompleted(guide.practiceQuestions) }">
                  <i :class="isResourceCompleted(guide.practiceQuestions) ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                </div>
              </div>

              <!-- Video Tutorial Box -->
              <div class="resource-box" @click="openModal('video', guide)">
                <div class="resource-icon">
                  <i class="fas fa-video"></i>
                </div>
                <div class="resource-title">Video Tutorial</div>
                <div class="resource-status" :class="{ completed: guide.videoWatched }">
                  <i :class="guide.videoWatched ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                </div>
              </div>

              <!-- Study Schedule Box -->
              <div class="resource-box" @click="openModal('schedule', guide)">
                <div class="resource-icon">
                  <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="resource-title">Study Schedule</div>
                <div class="resource-status" :class="{ completed: isResourceCompleted(guide.studySchedule) }">
                  <i :class="isResourceCompleted(guide.studySchedule) ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                </div>
              </div>
            </div>

            <!-- Take Practice Quiz -->
            <div class="guide-actions">
              <button class="quiz-btn" @click="startQuiz(guide.id)">
                <i class="fas fa-clipboard-check"></i>
                Take Practice Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for displaying resource content -->
    <transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-header" :style="{ backgroundColor: getMasteryColor(currentGuide?.masteryLevel) }">
            <h2>{{ modalTitle }}</h2>
            <button @click="closeModal" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <!-- Key Concepts Content -->
            <div v-if="modalType === 'concepts'" class="modal-content">
              <div class="concept-summary">
                <p>{{ currentGuide?.conceptSummary }}</p>
              </div>
              <div class="completion-checkbox">
                <label>
                  <input type="checkbox" v-model="currentGuide.conceptsRead" @change="updateProgress(currentGuide.id)">
                  <span>Mark as read</span>
                </label>
              </div>
            </div>

            <!-- Practice Questions Content -->
            <div v-if="modalType === 'questions'" class="modal-content">
              <div class="practice-questions">
                <div v-for="(question, index) in currentGuide?.practiceQuestions" :key="index" class="practice-question">
                  <div class="question-header">
                    <h4>Question {{ index + 1 }}</h4>
                    <div class="completion-checkbox">
                      <label>
                        <input type="checkbox" v-model="question.completed" @change="updateProgress(currentGuide.id)">
                        <span>Completed</span>
                      </label>
                    </div>
                  </div>
                  <p>{{ question.text }}</p>
                  <div class="question-hint" v-if="question.hint">
                    <button @click="question.showHint = !question.showHint" class="hint-toggle">
                      {{ question.showHint ? 'Hide Hint' : 'Show Hint' }}
                    </button>
                    <p v-if="question.showHint" class="hint-text">{{ question.hint }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Video Tutorial Content -->
            <div v-if="modalType === 'video'" class="modal-content">
              <div class="video-tutorial">
                <div class="video-placeholder">
                  <img :src="currentGuide?.videoThumbnail" alt="Video thumbnail">
                  <button class="play-btn" @click="markVideoWatched(currentGuide.id)">
                    <i class="fas fa-play"></i>
                  </button>
                </div>
                <div class="video-info">
                  <h4>{{ currentGuide?.videoTitle }}</h4>
                  <p>{{ currentGuide?.videoDuration }}</p>
                </div>
                <div class="completion-checkbox">
                  <label>
                    <input type="checkbox" v-model="currentGuide.videoWatched" @change="updateProgress(currentGuide.id)">
                    <span>Mark as watched</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Study Schedule Content -->
            <div v-if="modalType === 'schedule'" class="modal-content">
              <div class="study-schedule">
                <div v-for="(session, index) in currentGuide?.studySchedule" :key="index" class="schedule-item">
                  <div class="schedule-day">{{ session.day }}</div>
                  <div class="schedule-content">
                    <h4>{{ session.focus }}</h4>
                    <p>{{ session.duration }} minutes</p>
                    <p class="schedule-description">{{ session.description }}</p>
                  </div>
                  <div class="completion-checkbox">
                    <label>
                      <input type="checkbox" v-model="session.completed" @change="updateProgress(currentGuide.id)">
                      <span>Completed</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'StudyGuide',
  data() {
    return {
      showModal: false,
      modalType: null,
      currentGuide: null,
      studyGuides: [
        {
          id: 1,
          subject: 'Mathematics',
          topic: 'Quadratic Equations',
          masteryLevel: 65,
          completedItems: 3,
          totalItems: 12,
          completionPercentage: 25,
          conceptSummary: 'Quadratic equations are polynomial equations of the second degree, typically written in the form ax² + bx + c = 0 where a ≠ 0. These equations can be solved using factoring, completing the square, or the quadratic formula.',
          conceptsRead: false,
          practiceQuestions: [
            {
              text: 'Solve the quadratic equation: x² - 5x + 6 = 0',
              hint: 'Try factoring the equation into (x-a)(x-b) form.',
              completed: true,
              showHint: false
            },
            {
              text: 'Find the values of x for which the expression x² - 4x - 12 is equal to zero.',
              hint: 'Use the quadratic formula: x = [-b ± √(b² - 4ac)]/2a',
              completed: true,
              showHint: false
            },
            {
              text: 'A ball is thrown upward from a height of 6 feet with an initial velocity of 40 feet per second. The height h of the ball after t seconds is given by h = -16t² + 40t + 6. After how many seconds will the ball hit the ground?',
              hint: 'Set h = 0 and solve for t.',
              completed: false,
              showHint: false
            }
          ],
          videoTitle: 'Understanding Quadratic Equations',
          videoDuration: '12:45',
          videoThumbnail: 'https://via.placeholder.com/320x180?text=Quadratic+Equations',
          videoWatched: true,
          studySchedule: [
            {
              day: 'Monday',
              focus: 'Concept Review',
              duration: 30,
              description: 'Review the key concepts and formulas for quadratic equations.',
              completed: true
            },
            {
              day: 'Wednesday',
              focus: 'Practice Problems',
              duration: 45,
              description: 'Work through practice problems focusing on factoring and the quadratic formula.',
              completed: false
            },
            {
              day: 'Friday',
              focus: 'Application Problems',
              duration: 30,
              description: 'Solve word problems involving quadratic equations.',
              completed: false
            }
          ]
        },
        {
          id: 2,
          subject: 'Physics',
          topic: 'Newton\'s Laws',
          masteryLevel: 68,
          completedItems: 2,
          totalItems: 10,
          completionPercentage: 20,
          conceptSummary: 'Newton\'s three laws of motion describe the relationship between an object and the forces acting on it. These laws form the foundation for classical mechanics and explain how objects move or remain at rest.',
          conceptsRead: true,
          practiceQuestions: [
            {
              text: 'A 2 kg object experiences a net force of 10 N. What is its acceleration?',
              hint: 'Use Newton\'s Second Law: F = ma',
              completed: true,
              showHint: false
            },
            {
              text: 'Explain how Newton\'s Third Law applies when a person is walking on the ground.',
              hint: 'Think about the action-reaction pair of forces between the person\'s feet and the ground.',
              completed: false,
              showHint: false
            }
          ],
          videoTitle: 'Newton\'s Laws of Motion Explained',
          videoDuration: '15:20',
          videoThumbnail: 'https://via.placeholder.com/320x180?text=Newton\'s+Laws',
          videoWatched: false,
          studySchedule: [
            {
              day: 'Tuesday',
              focus: 'First and Second Laws',
              duration: 40,
              description: 'Study inertia and F=ma with examples.',
              completed: true
            },
            {
              day: 'Thursday',
              focus: 'Third Law and Applications',
              duration: 35,
              description: 'Focus on action-reaction pairs and real-world applications.',
              completed: false
            }
          ]
        },
        {
          id: 3,
          subject: 'Biology',
          topic: 'Cell Division',
          masteryLevel: 60,
          completedItems: 1,
          totalItems: 8,
          completionPercentage: 12.5,
          conceptSummary: 'Cell division is the process by which a parent cell divides into two or more daughter cells. The two main types of cell division are mitosis (for growth and repair) and meiosis (for sexual reproduction).',
          conceptsRead: true,
          practiceQuestions: [
            {
              text: 'Compare and contrast mitosis and meiosis.',
              hint: 'Consider the number of divisions, chromosome number in daughter cells, and purpose.',
              completed: false,
              showHint: false
            },
            {
              text: 'Describe the phases of mitosis in order.',
              hint: 'Remember PMAT: Prophase, Metaphase, Anaphase, Telophase.',
              completed: false,
              showHint: false
            }
          ],
          videoTitle: 'Cell Division: Mitosis and Meiosis',
          videoDuration: '18:35',
          videoThumbnail: 'https://via.placeholder.com/320x180?text=Cell+Division',
          videoWatched: false,
          studySchedule: [
            {
              day: 'Monday',
              focus: 'Mitosis',
              duration: 30,
              description: 'Study the phases and purpose of mitosis.',
              completed: false
            },
            {
              day: 'Wednesday',
              focus: 'Meiosis',
              duration: 45,
              description: 'Focus on the stages of meiosis and genetic variation.',
              completed: false
            }
          ]
        }
      ]
    }
  },
  computed: {
    modalTitle() {
      switch(this.modalType) {
        case 'concepts': return 'Key Concepts';
        case 'questions': return 'Practice Questions';
        case 'video': return 'Video Tutorial';
        case 'schedule': return 'Study Schedule';
        default: return '';
      }
    }
  },
  methods: {
    getMasteryColor(level) {
      if (level >= 80) return '#4CAF50';
      if (level >= 60) return '#FF9800';
      return '#F44336';
    },
    updateProgress(guideId) {
      const guide = this.studyGuides.find(g => g.id === guideId);
      if (!guide) return;
      
      // Count completed items
      let completed = 0;
      
      // Concepts read
      if (guide.conceptsRead) completed++;
      
      // Practice questions
      guide.practiceQuestions.forEach(q => {
        if (q.completed) completed++;
      });
      
      // Video watched
      if (guide.videoWatched) completed++;
      
      // Study schedule sessions
      guide.studySchedule.forEach(s => {
        if (s.completed) completed++;
      });
      
      guide.completedItems = completed;
      guide.completionPercentage = Math.round((completed / guide.totalItems) * 100);
    },
    markVideoWatched(guideId) {
      const guide = this.studyGuides.find(g => g.id === guideId);
      if (guide) {
        guide.videoWatched = true;
        this.updateProgress(guideId);
      }
    },
    startQuiz(guideId) {
      // Navigate to quiz page
      this.$router.push(`/student/quiz/${guideId}`);
    },
    openModal(type, guide) {
      this.modalType = type;
      this.currentGuide = guide;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    isResourceCompleted(items) {
      if (!items || items.length === 0) return false;
      return items.every(item => item.completed);
    }
  }
}
</script>

<style scoped>
.study-guide {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 2rem 1.5rem;
}

.guide-header {
  text-align: center;
  margin-bottom: 2rem;
}

.guide-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #1a237e;
}

.subtitle {
  color: #616161;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.guide-content {
  max-width: 1200px;
  margin: 0 auto;
}

.guides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.guide-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.guide-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.guide-card-header {
  padding: 1.5rem;
  color: white;
  position: relative;
}

.subject-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.guide-card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.mastery-level {
  font-size: 0.9rem;
}

.progress-bar {
  height: 0.5rem;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 0.25rem;
  overflow: hidden;
  margin-top: 0.5rem;
}

.progress {
  height: 100%;
  background-color: white;
  border-radius: 0.25rem;
}

.guide-card-content {
  padding: 1.5rem;
}

.progress-tracker {
  margin-bottom: 1.5rem;
}

.progress-tracker .progress-bar {
  background-color: #e0e0e0;
}

.progress-tracker .progress {
  background-color: #4CAF50;
}

.progress-text {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #616161;
}

/* Resource Boxes Grid */
.resource-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.resource-box {
  background-color: #f5f5f5;
  border-radius: 0.5rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid transparent;
}

.resource-box:hover {
  background-color: #e3f2fd;
  border-color: #C84C1C;
  transform: translateY(-3px);
}

.resource-icon {
  width: 50px;
  height: 50px;
  background-color: #1a237e;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
}

.resource-title {
  font-weight: 600;
  color: #333;
  text-align: center;
  font-size: 0.95rem;
}

.resource-status {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-size: 1.1rem;
  color: #bdbdbd;
}

.resource-status.completed {
  color: #4CAF50;
}

.guide-actions {
  display: flex;
  justify-content: center;
}

.quiz-btn {
  background-color: #C84C1C;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.quiz-btn:hover {
  background-color: #a33d16;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-content {
  max-height: 70vh;
  overflow-y: auto;
}

/* Content Styles */
.concept-summary {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.concept-summary p {
  margin: 0;
  line-height: 1.6;
}

.completion-checkbox {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.completion-checkbox label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.practice-questions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.practice-question {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.question-header h4 {
  margin: 0;
  font-size: 1rem;
}

.question-hint {
  margin-top: 1rem;
}

.hint-toggle {
  background-color: transparent;
  border: none;
  color: #1a237e;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
  text-decoration: underline;
}

.hint-text {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: #e3f2fd;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  color: #0d47a1;
}

.video-tutorial {
  margin-bottom: 1rem;
}

.video-placeholder {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.video-placeholder img {
  width: 100%;
  display: block;
}

.play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
}

.video-info {
  margin-bottom: 0.75rem;
}

.video-info h4 {
  margin: 0;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.video-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #616161;
}

.study-schedule {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.schedule-item {
  display: flex;
  background-color: #f5f5f5;
  border-radius: 0.5rem;
  overflow: hidden;
}

.schedule-day {
  background-color: #1a237e;
  color: white;
  padding: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.schedule-content {
  flex: 1;
  padding: 1rem;
}

.schedule-content h4 {
  margin: 0;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.schedule-content p {
  margin: 0;
  font-size: 0.9rem;
}

.schedule-description {
  margin-top: 0.5rem !important;
  color: #616161;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .study-guide {
    padding: 1.5rem 1rem;
  }
  
  .guide-header h1 {
    font-size: 1.75rem;
  }
  
  .guides-grid {
    grid-template-columns: 1fr;
  }
  
  .resource-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .schedule-item {
    flex-direction: column;
  }
  
  .schedule-day {
    width: 100%;
    padding: 0.5rem;
  }
  
  .question-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .question-header .completion-checkbox {
    margin-top: 0.5rem;
  }
}

@media (max-width: 480px) {
  .resource-grid {
    grid-template-columns: 1fr;
  }
}
</style> 