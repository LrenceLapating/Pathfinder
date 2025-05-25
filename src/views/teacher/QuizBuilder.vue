<template>
  <div class="quiz-builder">
    <!-- Header Section -->
    <div class="builder-header">
      <div class="header-left">
        <h1>{{ isEditing ? 'Edit Quiz' : 'Create New Quiz' }}</h1>
        <p class="subtitle">Design assessments with various question types and settings</p>
      </div>
      <div class="header-actions">
        <button class="secondary-btn" @click="previewQuiz" v-if="questions.length > 0">
          <i class="fas fa-eye"></i>
          Preview
        </button>
        <button class="primary-btn" @click="saveQuiz">
          <i class="fas fa-save"></i>
          {{ isEditing ? 'Update Quiz' : 'Save Quiz' }}
        </button>
      </div>
    </div>

    <div class="builder-layout">
      <!-- Quiz Settings Panel -->
      <div class="settings-panel">
        <div class="panel-section">
          <h3>Quiz Settings</h3>
          <div class="form-group">
            <label>Quiz Title</label>
            <input 
              type="text" 
              v-model="quizTitle" 
              placeholder="Enter quiz title..."
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Subject/Module</label>
            <select v-model="selectedModule" class="form-select">
              <option value="">Select module</option>
              <option v-for="module in modules" :key="module.id" :value="module.id">
                {{ module.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="quizDescription" 
              placeholder="Enter quiz description..."
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Time Limit (minutes)</label>
              <input 
                type="number" 
                v-model="timeLimit" 
                min="0"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Passing Score (%)</label>
              <input 
                type="number" 
                v-model="passingScore" 
                min="0" 
                max="100"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="shuffleQuestions" />
              Shuffle Questions
            </label>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="showResults" />
              Show Results Immediately
            </label>
          </div>

          <div class="form-group">
            <label>Availability</label>
            <div class="date-inputs">
              <input 
                type="datetime-local" 
                v-model="startDate"
                class="form-input"
              />
              <span>to</span>
              <input 
                type="datetime-local" 
                v-model="endDate"
                class="form-input"
              />
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h3>Question Bank</h3>
          <div class="question-bank">
            <button 
              v-for="type in questionTypes" 
              :key="type.id"
              class="question-type-btn"
              @click="addQuestion(type.id)"
            >
              <i :class="type.icon"></i>
              {{ type.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Questions Editor -->
      <div class="questions-editor">
        <div class="editor-header">
          <h3>Questions ({{ questions.length }})</h3>
          <div class="editor-actions">
            <button class="action-btn" @click="importQuestions">
              <i class="fas fa-file-import"></i>
              Import
            </button>
            <button class="action-btn" @click="exportQuestions">
              <i class="fas fa-file-export"></i>
              Export
            </button>
          </div>
        </div>

        <draggable 
          v-model="questions" 
          class="questions-list"
          handle=".drag-handle"
          @start="drag=true" 
          @end="drag=false"
        >
          <div 
            v-for="(question, index) in questions" 
            :key="question.id"
            class="question-card"
          >
            <div class="question-header">
              <div class="drag-handle">
                <i class="fas fa-grip-vertical"></i>
              </div>
              <span class="question-number">Question {{ index + 1 }}</span>
              <div class="question-actions">
                <button class="icon-btn" @click="duplicateQuestion(index)">
                  <i class="fas fa-copy"></i>
                </button>
                <button class="icon-btn" @click="deleteQuestion(index)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <div class="question-content">
              <!-- Multiple Choice Question -->
              <template v-if="question.type === 'multiple_choice'">
                <div class="form-group">
                  <input 
                    type="text" 
                    v-model="question.text" 
                    placeholder="Enter question text..."
                    class="form-input question-text"
                  />
                </div>
                
                <div class="options-list">
                  <div 
                    v-for="(option, optIndex) in question.options" 
                    :key="optIndex"
                    class="option-item"
                  >
                    <input 
                      type="radio" 
                      :name="'q'+question.id" 
                      :value="optIndex"
                      v-model="question.correctOption"
                    />
                    <input 
                      type="text" 
                      v-model="option.text"
                      placeholder="Enter option text..."
                      class="form-input"
                    />
                    <button 
                      class="icon-btn"
                      @click="removeOption(question, optIndex)"
                      v-if="question.options.length > 2"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                
                <button 
                  class="add-option-btn"
                  @click="addOption(question)"
                  v-if="question.options.length < 6"
                >
                  <i class="fas fa-plus"></i>
                  Add Option
                </button>
              </template>

              <!-- True/False Question -->
              <template v-if="question.type === 'true_false'">
                <div class="form-group">
                  <input 
                    type="text" 
                    v-model="question.text" 
                    placeholder="Enter statement..."
                    class="form-input question-text"
                  />
                </div>
                
                <div class="true-false-options">
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      v-model="question.correctAnswer" 
                      :value="true"
                    />
                    True
                  </label>
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      v-model="question.correctAnswer" 
                      :value="false"
                    />
                    False
                  </label>
                </div>
              </template>

              <!-- Short Answer Question -->
              <template v-if="question.type === 'short_answer'">
                <div class="form-group">
                  <input 
                    type="text" 
                    v-model="question.text" 
                    placeholder="Enter question text..."
                    class="form-input question-text"
                  />
                </div>
                
                <div class="form-group">
                  <label>Accepted Answers (one per line)</label>
                  <textarea 
                    v-model="question.acceptedAnswers"
                    placeholder="Enter accepted answers..."
                    class="form-textarea"
                    rows="3"
                  ></textarea>
                </div>
              </template>

              <!-- Essay Question -->
              <template v-if="question.type === 'essay'">
                <div class="form-group">
                  <input 
                    type="text" 
                    v-model="question.text" 
                    placeholder="Enter question text..."
                    class="form-input question-text"
                  />
                </div>
                
                <div class="form-group">
                  <label>Word Limit</label>
                  <input 
                    type="number" 
                    v-model="question.wordLimit"
                    min="0"
                    class="form-input"
                  />
                </div>
                
                <div class="form-group">
                  <label>Rubric/Grading Criteria</label>
                  <textarea 
                    v-model="question.rubric"
                    placeholder="Enter grading criteria..."
                    class="form-textarea"
                    rows="3"
                  ></textarea>
                </div>
              </template>

              <!-- File Upload Question -->
              <template v-if="question.type === 'file_upload'">
                <div class="form-group">
                  <input 
                    type="text" 
                    v-model="question.text" 
                    placeholder="Enter question text..."
                    class="form-input question-text"
                  />
                </div>
                
                <div class="form-group">
                  <label>Allowed File Types</label>
                  <input 
                    type="text" 
                    v-model="question.allowedTypes"
                    placeholder="pdf,doc,jpg,png"
                    class="form-input"
                  />
                </div>
                
                <div class="form-group">
                  <label>Maximum File Size (MB)</label>
                  <input 
                    type="number" 
                    v-model="question.maxSize"
                    min="1"
                    class="form-input"
                  />
                </div>
              </template>

              <div class="question-footer">
                <div class="form-row">
                  <div class="form-group">
                    <label>Points</label>
                    <input 
                      type="number" 
                      v-model="question.points"
                      min="0"
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <label class="checkbox-label">
                      <input 
                        type="checkbox" 
                        v-model="question.required"
                      />
                      Required
                    </label>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Explanation (shown after submission)</label>
                  <textarea 
                    v-model="question.explanation"
                    placeholder="Enter explanation..."
                    class="form-textarea"
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </draggable>

        <div class="empty-state" v-if="questions.length === 0">
          <i class="fas fa-clipboard-list"></i>
          <p>No questions added yet. Select a question type from the question bank to get started.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuizBuilder',
  
  data() {
    return {
      isEditing: false,
      quizTitle: '',
      quizDescription: '',
      selectedModule: '',
      timeLimit: 60,
      passingScore: 70,
      shuffleQuestions: false,
      showResults: true,
      startDate: '',
      endDate: '',
      
      modules: [
        { id: 1, name: 'Mathematics - Algebra' },
        { id: 2, name: 'Mathematics - Geometry' },
        { id: 3, name: 'Physics - Mechanics' },
        // Add more modules...
      ],

      questionTypes: [
        { 
          id: 'multiple_choice',
          label: 'Multiple Choice',
          icon: 'fas fa-list-ul'
        },
        {
          id: 'true_false',
          label: 'True/False',
          icon: 'fas fa-toggle-on'
        },
        {
          id: 'short_answer',
          label: 'Short Answer',
          icon: 'fas fa-pencil-alt'
        },
        {
          id: 'essay',
          label: 'Essay',
          icon: 'fas fa-paragraph'
        },
        {
          id: 'file_upload',
          label: 'File Upload',
          icon: 'fas fa-file-upload'
        }
      ],

      questions: []
    }
  },

  methods: {
    addQuestion(type) {
      const newQuestion = {
        id: Date.now(),
        type,
        text: '',
        points: 1,
        required: true,
        explanation: ''
      }

      // Add type-specific properties
      switch (type) {
        case 'multiple_choice':
          newQuestion.options = [
            { text: '' },
            { text: '' }
          ]
          newQuestion.correctOption = 0
          break
        case 'true_false':
          newQuestion.correctAnswer = true
          break
        case 'short_answer':
          newQuestion.acceptedAnswers = ''
          break
        case 'essay':
          newQuestion.wordLimit = 500
          newQuestion.rubric = ''
          break
        case 'file_upload':
          newQuestion.allowedTypes = 'pdf,doc,docx'
          newQuestion.maxSize = 10
          break
      }

      this.questions.push(newQuestion)
    },

    duplicateQuestion(index) {
      const original = this.questions[index]
      const duplicate = JSON.parse(JSON.stringify(original))
      duplicate.id = Date.now()
      this.questions.splice(index + 1, 0, duplicate)
    },

    deleteQuestion(index) {
      if (confirm('Are you sure you want to delete this question?')) {
        this.questions.splice(index, 1)
      }
    },

    addOption(question) {
      if (question.options.length < 6) {
        question.options.push({ text: '' })
      }
    },

    removeOption(question, index) {
      if (question.options.length > 2) {
        question.options.splice(index, 1)
        if (question.correctOption === index) {
          question.correctOption = 0
        }
      }
    },

    previewQuiz() {
      // Implement quiz preview
    },

    saveQuiz() {
      // Validate and save quiz
      if (!this.quizTitle) {
        alert('Please enter a quiz title')
        return
      }

      if (!this.selectedModule) {
        alert('Please select a module')
        return
      }

      if (this.questions.length === 0) {
        alert('Please add at least one question')
        return
      }

      // TODO: Save quiz to backend
      console.log('Saving quiz:', {
        title: this.quizTitle,
        description: this.quizDescription,
        moduleId: this.selectedModule,
        settings: {
          timeLimit: this.timeLimit,
          passingScore: this.passingScore,
          shuffleQuestions: this.shuffleQuestions,
          showResults: this.showResults,
          startDate: this.startDate,
          endDate: this.endDate
        },
        questions: this.questions
      })
    },

    importQuestions() {
      // Implement question import
    },

    exportQuestions() {
      // Implement question export
    }
  }
}
</script>

<style scoped>
.quiz-builder {
  padding: 1.5rem;
}

.builder-header {
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

.builder-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;
}

.settings-panel {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.panel-section {
  padding: 1.5rem;
  border-bottom: 1px solid #E2E8F0;
}

.panel-section:last-child {
  border-bottom: none;
}

.panel-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #1E293B;
}

.form-group {
  margin-bottom: 1rem;
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

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1E293B;
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1E293B;
  background: white;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1E293B;
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

.date-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.question-bank {
  display: grid;
  gap: 0.5rem;
}

.question-type-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background: white;
  color: #1E293B;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.question-type-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.question-type-btn i {
  width: 20px;
  text-align: center;
  color: #2563EB;
}

.questions-editor {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  min-height: 500px;
}

.editor-header {
  padding: 1.5rem;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #1E293B;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
}

.questions-list {
  padding: 1.5rem;
}

.question-card {
  background: #F8FAFC;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
}

.question-header {
  background: #F1F5F9;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.drag-handle {
  cursor: move;
  color: #64748B;
}

.question-number {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1E293B;
}

.question-actions {
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
}

.question-content {
  padding: 1rem;
}

.question-text {
  font-size: 1rem;
}

.options-list {
  margin: 1rem 0;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.add-option-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px dashed #CBD5E1;
  border-radius: 0.5rem;
  background: transparent;
  color: #64748B;
  font-size: 0.875rem;
  cursor: pointer;
  width: 100%;
  justify-content: center;
}

.add-option-btn:hover {
  background: #F8FAFC;
  border-color: #94A3B8;
}

.true-false-options {
  display: flex;
  gap: 2rem;
  margin: 1rem 0;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.question-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #E2E8F0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #64748B;
  text-align: center;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0;
  max-width: 400px;
}

.primary-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: #2563EB;
  color: white;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.primary-btn:hover {
  background: #1D4ED8;
}

.secondary-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background: white;
  color: #1E293B;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.action-btn {
  padding: 0.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background: white;
  color: #64748B;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
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