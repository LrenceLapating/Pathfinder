<template>
  <div class="smart-schedule">
    <div class="schedule-header">
      <h1>Smart Schedule</h1>
      <div class="header-actions">
        <div class="view-toggle">
          <button 
            :class="['toggle-btn', { active: currentView === 'calendar' }]"
            @click="currentView = 'calendar'"
          >
            <i class="fas fa-calendar-alt"></i>
            Calendar
          </button>
          <button 
            :class="['toggle-btn', { active: currentView === 'timeline' }]"
            @click="currentView = 'timeline'"
          >
            <i class="fas fa-stream"></i>
            Timeline
          </button>
        </div>
        <button class="add-task-btn" @click="showAddTask = true">
          <i class="fas fa-plus"></i>
          Add Task
        </button>
      </div>
    </div>

    <div class="schedule-content">
      <!-- Main Schedule Area -->
      <div class="schedule-main">
        <!-- Calendar View -->
        <div v-if="currentView === 'calendar'" class="calendar-view">
          <div class="calendar-header">
            <button @click="previousMonth">
              <i class="fas fa-chevron-left"></i>
            </button>
            <h2>{{ currentMonthYear }}</h2>
            <button @click="nextMonth">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <div class="calendar-grid">
            <div class="weekday-header" v-for="day in weekDays" :key="day">
              {{ day }}
            </div>
            <div 
              v-for="date in calendarDates" 
              :key="date.date"
              :class="['calendar-day', { 
                'current-month': date.currentMonth,
                'has-tasks': hasTasksOnDate(date.date)
              }]"
              @click="selectDate(date)"
            >
              <span class="date-number">{{ new Date(date.date).getDate() }}</span>
              <div class="task-indicators">
                <span 
                  v-for="task in getTasksForDate(date.date)"
                  :key="task.id"
                  :class="['task-dot', task.priority]"
                ></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline View -->
        <div v-else class="timeline-view">
          <div v-for="(tasks, date) in groupedTasks" :key="date" class="timeline-day">
            <div class="timeline-date">
              <h3>{{ formatDate(date) }}</h3>
              <span class="task-count">{{ tasks.length }} tasks</span>
            </div>
            <div class="timeline-tasks">
              <div 
                v-for="task in tasks" 
                :key="task.id"
                :class="['task-card', task.priority]"
              >
                <div class="task-time">{{ formatTime(task.startTime) }}</div>
                <div class="task-content">
                  <h4>{{ task.title }}</h4>
                  <p>{{ task.description }}</p>
                  <div class="task-meta">
                    <span class="duration">
                      <i class="fas fa-clock"></i>
                      {{ task.duration }} min
                    </span>
                    <span :class="['priority-tag', task.priority]">
                      {{ task.priority }}
                    </span>
                  </div>
                </div>
                <div class="task-actions">
                  <button @click="editTask(task)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteTask(task.id)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Recommendations Sidebar -->
      <div class="schedule-sidebar">
        <div class="ai-recommendations">
          <div class="section-header">
            <h2>AI Recommendations</h2>
            <button @click="refreshRecommendations" class="refresh-btn">
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>

          <!-- Study Time Optimization -->
          <div class="recommendation-card">
            <div class="card-header">
              <i class="fas fa-brain"></i>
              <h3>Optimal Study Times</h3>
            </div>
            <div class="card-content">
              <p>Based on your performance data:</p>
              <ul>
                <li>Peak focus hours: 9 AM - 11 AM</li>
                <li>Best subjects for evening: Mathematics</li>
                <li>Recommended breaks: Every 45 minutes</li>
              </ul>
              <button @click="applyOptimalTimes" class="apply-btn">
                Apply to Schedule
              </button>
            </div>
          </div>

          <!-- Workload Balance -->
          <div class="recommendation-card">
            <div class="card-header">
              <i class="fas fa-balance-scale"></i>
              <h3>Workload Balance</h3>
            </div>
            <div class="card-content">
              <div class="balance-chart">
                <div 
                  v-for="(subject, index) in workloadBalance" 
                  :key="index"
                  :style="{ width: subject.percentage + '%' }"
                  :class="['balance-bar', subject.status]"
                >
                  {{ subject.name }}
                </div>
              </div>
              <p>{{ workloadMessage }}</p>
              <button @click="balanceWorkload" class="apply-btn">
                Balance Schedule
              </button>
            </div>
          </div>

          <!-- Upcoming Deadlines -->
          <div class="recommendation-card">
            <div class="card-header">
              <i class="fas fa-exclamation-circle"></i>
              <h3>Priority Alerts</h3>
            </div>
            <div class="card-content">
              <div v-for="alert in priorityAlerts" 
                   :key="alert.id"
                   class="alert-item">
                <i :class="alert.icon"></i>
                <div class="alert-content">
                  <h4>{{ alert.title }}</h4>
                  <p>{{ alert.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Task Modal -->
    <div v-if="showAddTask" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingTask ? 'Edit Task' : 'Add New Task' }}</h2>
          <button class="close-btn" @click="closeTaskModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Title</label>
            <input v-model="taskForm.title" type="text" placeholder="Enter task title">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="taskForm.description" 
              placeholder="Task description"
            ></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Date</label>
              <input v-model="taskForm.date" type="date">
            </div>
            <div class="form-group">
              <label>Start Time</label>
              <input v-model="taskForm.startTime" type="time">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Duration (minutes)</label>
              <input v-model="taskForm.duration" type="number" min="0">
            </div>
            <div class="form-group">
              <label>Priority</label>
              <select v-model="taskForm.priority">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeTaskModal">Cancel</button>
          <button class="save-btn" @click="saveTask">Save Task</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmartSchedule',
  data() {
    return {
      currentView: 'calendar',
      showAddTask: false,
      editingTask: null,
      currentDate: new Date(),
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      taskForm: {
        title: '',
        description: '',
        date: '',
        startTime: '',
        duration: 30,
        priority: 'medium'
      },
      tasks: [
        {
          id: 1,
          title: 'Math Assignment',
          description: 'Complete calculus homework',
          date: '2024-02-20',
          startTime: '09:00',
          duration: 60,
          priority: 'high'
        }
      ],
      workloadBalance: [
        { name: 'Math', percentage: 40, status: 'balanced' },
        { name: 'Physics', percentage: 30, status: 'high' },
        { name: 'English', percentage: 20, status: 'low' },
        { name: 'History', percentage: 10, status: 'balanced' }
      ],
      priorityAlerts: [
        {
          id: 1,
          icon: 'fas fa-exclamation-triangle',
          title: 'Upcoming Test',
          message: 'Physics test in 3 days - increase study time'
        },
        {
          id: 2,
          icon: 'fas fa-clock',
          title: 'Assignment Due',
          message: 'Math assignment due tomorrow'
        }
      ]
    }
  },
  computed: {
    currentMonthYear() {
      return this.currentDate.toLocaleString('default', { 
        month: 'long', 
        year: 'numeric' 
      })
    },
    calendarDates() {
      // Generate calendar dates for current month view
      const dates = []
      const firstDay = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        1
      )
      const lastDay = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        0
      )
      
      // Add previous month's days
      const firstDayOfWeek = firstDay.getDay()
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(firstDay)
        date.setDate(date.getDate() - i)
        dates.push({
          date: date.toISOString().split('T')[0],
          currentMonth: false
        })
      }
      
      // Add current month's days
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          i
        )
        dates.push({
          date: date.toISOString().split('T')[0],
          currentMonth: true
        })
      }
      
      // Add next month's days
      const remainingDays = 42 - dates.length
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(lastDay)
        date.setDate(date.getDate() + i)
        dates.push({
          date: date.toISOString().split('T')[0],
          currentMonth: false
        })
      }
      
      return dates
    },
    groupedTasks() {
      const grouped = {}
      this.tasks.forEach(task => {
        if (!grouped[task.date]) {
          grouped[task.date] = []
        }
        grouped[task.date].push(task)
      })
      return grouped
    },
    workloadMessage() {
      const highLoad = this.workloadBalance.find(s => s.status === 'high')
      if (highLoad) {
        return `Consider reducing time spent on ${highLoad.name}`
      }
      return 'Workload is well balanced'
    }
  },
  methods: {
    previousMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      )
    },
    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      )
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      })
    },
    formatTime(time) {
      return time
    },
    hasTasksOnDate(date) {
      return this.tasks.some(task => task.date === date)
    },
    getTasksForDate(date) {
      return this.tasks.filter(task => task.date === date)
    },
    selectDate(date) {
      this.taskForm.date = date.date
      this.showAddTask = true
    },
    editTask(task) {
      this.editingTask = task
      this.taskForm = { ...task }
      this.showAddTask = true
    },
    deleteTask(taskId) {
      this.tasks = this.tasks.filter(task => task.id !== taskId)
    },
    closeTaskModal() {
      this.showAddTask = false
      this.editingTask = null
      this.taskForm = {
        title: '',
        description: '',
        date: '',
        startTime: '',
        duration: 30,
        priority: 'medium'
      }
    },
    saveTask() {
      if (this.editingTask) {
        const index = this.tasks.findIndex(t => t.id === this.editingTask.id)
        this.tasks[index] = { ...this.taskForm, id: this.editingTask.id }
      } else {
        this.tasks.push({
          ...this.taskForm,
          id: Date.now()
        })
      }
      this.closeTaskModal()
    },
    refreshRecommendations() {
      // Implement AI recommendations refresh
    },
    applyOptimalTimes() {
      // Implement optimal times application
    },
    balanceWorkload() {
      // Implement workload balancing
    }
  }
}
</script>

<style scoped>
.smart-schedule {
  padding: 2rem;
}

.schedule-header {
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.view-toggle {
  display: flex;
  gap: 1rem;
}

.toggle-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #4CAF50;
  border-radius: 25px;
  background: white;
  color: #4CAF50;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-btn.active {
  background: #4CAF50;
  color: white;
}

.add-task-btn {
  padding: 0.75rem 1.5rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.schedule-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

/* Calendar Styles */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-header button {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #eee;
  border: 1px solid #eee;
}

.weekday-header {
  background: white;
  padding: 1rem;
  text-align: center;
  font-weight: 500;
}

.calendar-day {
  background: white;
  padding: 1rem;
  min-height: 100px;
  cursor: pointer;
}

.calendar-day:hover {
  background: #f5f7fa;
}

.calendar-day.current-month {
  color: #333;
}

.calendar-day:not(.current-month) {
  color: #ccc;
}

.date-number {
  font-weight: 500;
}

.task-indicators {
  display: flex;
  gap: 0.3rem;
  margin-top: 0.5rem;
}

.task-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.task-dot.high {
  background: #f44336;
}

.task-dot.medium {
  background: #FF9800;
}

.task-dot.low {
  background: #4CAF50;
}

/* Timeline Styles */
.timeline-day {
  margin-bottom: 2rem;
}

.timeline-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.timeline-date h3 {
  margin: 0;
}

.task-count {
  color: #666;
  font-size: 0.9rem;
}

.task-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.task-card.high {
  border-left: 4px solid #f44336;
}

.task-card.medium {
  border-left: 4px solid #FF9800;
}

.task-card.low {
  border-left: 4px solid #4CAF50;
}

.task-time {
  font-weight: 500;
  color: #666;
}

.task-content {
  flex: 1;
}

.task-content h4 {
  margin: 0 0 0.5rem 0;
}

.task-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.task-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.duration {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #666;
}

.priority-tag {
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
}

.priority-tag.high {
  background: #FFEBEE;
  color: #f44336;
}

.priority-tag.medium {
  background: #FFF3E0;
  color: #FF9800;
}

.priority-tag.low {
  background: #E8F5E9;
  color: #4CAF50;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.task-actions button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}

/* AI Recommendations Styles */
.ai-recommendations {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.refresh-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.2rem;
}

.recommendation-card {
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

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.balance-chart {
  margin: 1rem 0;
}

.balance-bar {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  color: white;
  font-size: 0.9rem;
  border-radius: 5px;
}

.balance-bar.high {
  background: #f44336;
}

.balance-bar.balanced {
  background: #4CAF50;
}

.balance-bar.low {
  background: #FF9800;
}

.apply-btn {
  width: 100%;
  padding: 0.75rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
}

.alert-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 5px;
  margin-bottom: 0.5rem;
}

.alert-item i {
  color: #f44336;
}

.alert-content h4 {
  margin: 0 0 0.3rem 0;
  font-size: 1rem;
}

.alert-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

/* Modal Styles */
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
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

.form-group textarea {
  height: 100px;
  resize: vertical;
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

@media (max-width: 1024px) {
  .schedule-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .smart-schedule {
    padding: 1rem;
  }

  .header-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .view-toggle {
    width: 100%;
  }

  .toggle-btn {
    flex: 1;
    justify-content: center;
  }

  .calendar-grid {
    font-size: 0.9rem;
  }

  .calendar-day {
    padding: 0.5rem;
    min-height: 80px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style> 