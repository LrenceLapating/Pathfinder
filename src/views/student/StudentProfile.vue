<template>
  <div class="student-profile">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-cover">
        <button class="edit-cover-btn">
          <i class="fas fa-camera"></i>
          Change Cover
        </button>
      </div>
      <div class="profile-info">
        <div class="profile-avatar">
          <img :src="profile.avatar" :alt="profile.name">
          <button class="edit-avatar-btn">
            <i class="fas fa-camera"></i>
          </button>
        </div>
        <div class="profile-details">
          <h1>{{ profile.name }}</h1>
          <p class="profile-bio">{{ profile.bio }}</p>
          <div class="profile-stats">
            <div class="stat">
              <span class="stat-value">{{ profile.completedCourses }}</span>
              <span class="stat-label">Courses Completed</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ profile.totalXP }}</span>
              <span class="stat-label">Total XP</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ profile.achievements }}</span>
              <span class="stat-label">Achievements</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <!-- Learning Goals Section -->
      <div class="profile-section goals-section">
        <div class="section-header">
          <h2>Learning Goals</h2>
          <button class="add-goal-btn" @click="showAddGoalModal = true">
            <i class="fas fa-plus"></i>
            Add Goal
          </button>
        </div>
        
        <div class="goals-timeline">
          <div v-for="goal in goals" :key="goal.id" class="goal-card">
            <div class="goal-status" :class="goal.status">
              <i :class="getStatusIcon(goal.status)"></i>
            </div>
            <div class="goal-content">
              <h3>{{ goal.title }}</h3>
              <p>{{ goal.description }}</p>
              <div class="goal-meta">
                <span class="deadline">
                  <i class="fas fa-calendar"></i>
                  {{ formatDate(goal.deadline) }}
                </span>
                <span class="progress">
                  {{ goal.progress }}% Complete
                </span>
              </div>
              <div class="progress-bar">
                <div :style="{ width: goal.progress + '%' }" class="progress"></div>
              </div>
              <div class="goal-actions">
                <button @click="editGoal(goal)">
                  <i class="fas fa-edit"></i>
                  Edit
                </button>
                <button @click="deleteGoal(goal.id)">
                  <i class="fas fa-trash"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills & Interests -->
      <div class="profile-section skills-section">
        <div class="section-header">
          <h2>Skills & Interests</h2>
          <button class="edit-skills-btn" @click="showEditSkillsModal = true">
            <i class="fas fa-edit"></i>
            Edit
          </button>
        </div>
        
        <div class="skills-grid">
          <div v-for="skill in skills" :key="skill.id" class="skill-card">
            <div class="skill-icon">
              <i :class="skill.icon"></i>
            </div>
            <div class="skill-info">
              <h3>{{ skill.name }}</h3>
              <div class="skill-level">
                <div class="level-bar">
                  <div :style="{ width: skill.level + '%' }" class="level"></div>
                </div>
                <span>Level {{ Math.floor(skill.level / 20) + 1 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievements Wall -->
      <div class="profile-section achievements-section">
        <div class="section-header">
          <h2>Achievements</h2>
        </div>
        
        <div class="achievements-grid">
          <div v-for="achievement in achievements" 
               :key="achievement.id" 
               class="achievement-card"
               :class="{ 'locked': !achievement.earned }">
            <div class="achievement-icon">
              <i :class="achievement.icon"></i>
            </div>
            <div class="achievement-info">
              <h3>{{ achievement.name }}</h3>
              <p>{{ achievement.description }}</p>
              <div v-if="!achievement.earned" class="achievement-progress">
                {{ achievement.progress }}/{{ achievement.required }}
              </div>
              <div v-else class="earned-date">
                Earned {{ formatDate(achievement.earnedDate) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Goal Modal -->
    <div v-if="showAddGoalModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingGoal ? 'Edit Goal' : 'Add New Goal' }}</h2>
          <button class="close-btn" @click="closeGoalModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Goal Title</label>
            <input v-model="goalForm.title" type="text" placeholder="Enter goal title">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="goalForm.description" 
              placeholder="Describe your goal"
            ></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Deadline</label>
              <input v-model="goalForm.deadline" type="date">
            </div>
            <div class="form-group">
              <label>Status</label>
              <select v-model="goalForm.status">
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeGoalModal">Cancel</button>
          <button class="save-btn" @click="saveGoal">Save Goal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentProfile',
  data() {
    return {
      showAddGoalModal: false,
      showEditSkillsModal: false,
      editingGoal: null,
      profile: {
        name: 'John Doe',
        avatar: '/path/to/avatar.jpg',
        bio: 'Passionate learner | Math enthusiast',
        completedCourses: 12,
        totalXP: 2500,
        achievements: 15
      },
      goalForm: {
        title: '',
        description: '',
        deadline: '',
        status: 'not-started'
      },
      goals: [
        {
          id: 1,
          title: 'Master Calculus',
          description: 'Complete advanced calculus course with distinction',
          deadline: '2024-06-30',
          status: 'in-progress',
          progress: 65
        },
        {
          id: 2,
          title: 'Learn Python Programming',
          description: 'Complete Python certification course',
          deadline: '2024-05-15',
          status: 'not-started',
          progress: 0
        }
      ],
      skills: [
        {
          id: 1,
          name: 'Mathematics',
          icon: 'fas fa-square-root-alt',
          level: 80
        },
        {
          id: 2,
          name: 'Physics',
          icon: 'fas fa-atom',
          level: 60
        },
        {
          id: 3,
          name: 'Programming',
          icon: 'fas fa-code',
          level: 40
        }
      ],
      achievements: [
        {
          id: 1,
          name: 'Math Master',
          description: 'Complete 10 math courses with distinction',
          icon: 'fas fa-medal',
          earned: true,
          earnedDate: '2024-01-15'
        },
        {
          id: 2,
          name: 'Quick Learner',
          description: 'Complete 5 courses in one month',
          icon: 'fas fa-bolt',
          earned: false,
          progress: 3,
          required: 5
        }
      ]
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    getStatusIcon(status) {
      const icons = {
        'not-started': 'fas fa-circle',
        'in-progress': 'fas fa-spinner',
        'completed': 'fas fa-check-circle'
      }
      return icons[status]
    },
    editGoal(goal) {
      this.editingGoal = goal
      this.goalForm = { ...goal }
      this.showAddGoalModal = true
    },
    deleteGoal(goalId) {
      this.goals = this.goals.filter(goal => goal.id !== goalId)
    },
    closeGoalModal() {
      this.showAddGoalModal = false
      this.editingGoal = null
      this.goalForm = {
        title: '',
        description: '',
        deadline: '',
        status: 'not-started'
      }
    },
    saveGoal() {
      if (this.editingGoal) {
        const index = this.goals.findIndex(goal => goal.id === this.editingGoal.id)
        this.goals[index] = { ...this.goalForm, id: this.editingGoal.id }
      } else {
        this.goals.push({
          ...this.goalForm,
          id: Date.now(),
          progress: 0
        })
      }
      this.closeGoalModal()
    }
  }
}
</script>

<style scoped>
.student-profile {
  min-height: 100vh;
  background: #f5f7fa;
}

.profile-header {
  position: relative;
  margin-bottom: 2rem;
}

.profile-cover {
  height: 200px;
  background: linear-gradient(45deg, #4CAF50, #2196F3);
  position: relative;
}

.edit-cover-btn {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(255,255,255,0.9);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.profile-info {
  display: flex;
  gap: 2rem;
  padding: 0 2rem;
  margin-top: -60px;
}

.profile-avatar {
  position: relative;
  width: 120px;
  height: 120px;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-details {
  flex: 1;
}

.profile-details h1 {
  margin: 0;
  color: #333;
}

.profile-bio {
  color: #666;
  margin: 0.5rem 0;
}

.profile-stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #4CAF50;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.profile-content {
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.profile-section {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
}

.add-goal-btn,
.edit-skills-btn {
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.goals-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 10px;
}

.goal-status {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.goal-status.not-started {
  background: #f5f7fa;
  color: #666;
}

.goal-status.in-progress {
  background: #FFF3E0;
  color: #FF9800;
}

.goal-status.completed {
  background: #E8F5E9;
  color: #4CAF50;
}

.goal-content {
  flex: 1;
}

.goal-content h3 {
  margin: 0 0 0.5rem 0;
}

.goal-meta {
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
}

.progress-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  margin: 0.5rem 0;
}

.progress {
  height: 100%;
  background: #4CAF50;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.goal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.goal-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.skill-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 10px;
}

.skill-icon {
  width: 40px;
  height: 40px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skill-info {
  flex: 1;
}

.skill-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.skill-level {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.level-bar {
  flex: 1;
  height: 6px;
  background: #eee;
  border-radius: 3px;
}

.level {
  height: 100%;
  background: #4CAF50;
  border-radius: 3px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.achievement-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 10px;
}

.achievement-card.locked {
  opacity: 0.7;
}

.achievement-icon {
  width: 40px;
  height: 40px;
  background: #FFD700;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.achievement-info {
  flex: 1;
}

.achievement-info h3 {
  margin: 0 0 0.3rem 0;
  font-size: 1rem;
}

.achievement-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.achievement-progress,
.earned-date {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #666;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: inherit;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn,
.save-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background: #f5f7fa;
  color: #666;
}

.save-btn {
  background: #4CAF50;
  color: white;
}

@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-stats {
    justify-content: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style> 