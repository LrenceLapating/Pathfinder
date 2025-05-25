<template>
  <div class="smart-schedule">
    <div class="schedule-header">
      <h1><i class="fas fa-calendar-alt"></i> Smart Schedule</h1>
      <div class="view-controls">
        <button 
          v-for="view in viewOptions" 
          :key="view.value"
          :class="['view-btn', { active: currentView === view.value }]"
          @click="currentView = view.value"
        >
          <i :class="view.icon"></i>
          {{ view.label }}
        </button>
      </div>
    </div>

    <div class="schedule-container">
      <!-- Schedule Grid -->
      <div class="schedule-grid">
        <div class="time-slots">
          <div v-for="hour in timeSlots" :key="hour" class="time-slot">
            {{ formatTime(hour) }}
          </div>
        </div>
        <div class="schedule-content">
          <div 
            v-for="task in todaySchedule" 
            :key="task.id"
            :style="getTaskStyle(task)"
            :class="['schedule-task', { completed: task.completed }]"
          >
            <div class="task-content">
              <h3>{{ task.title }}</h3>
              <p>{{ task.description }}</p>
            </div>
            <div class="task-actions">
              <button @click="toggleTaskCompletion(task)" class="complete-btn">
                <i :class="task.completed ? 'fas fa-check-circle' : 'far fa-circle'"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Smart Recommendations -->
      <div class="recommendations">
        <h2>Smart Recommendations</h2>
        
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmartSchedule',
  data() {
    return {
      currentView: 'day',
      viewOptions: [
        { label: 'Day', value: 'day', icon: 'fas fa-calendar-day' },
        { label: 'Week', value: 'week', icon: 'fas fa-calendar-week' },
        { label: 'Month', value: 'month', icon: 'fas fa-calendar' }
      ],
      timeSlots: Array.from({ length: 24 }, (_, i) => i),
      todaySchedule: [
        {
          id: 1,
          time: '09:00 AM',
          title: 'Math Practice',
          description: 'Algebra equations and inequalities',
          completed: false,
          startHour: 9,
          duration: 2
        },
        {
          id: 2,
          time: '11:00 AM',
          title: 'Science Quiz',
          description: 'Chapter 5: Forces and Motion',
          completed: false,
          startHour: 11,
          duration: 1
        },
        {
          id: 3,
          time: '02:00 PM',
          title: 'English Essay',
          description: 'Literature analysis draft',
          completed: false,
          startHour: 14,
          duration: 2
        }
      ],
      workloadBalance: [
        { name: 'Math', percentage: 35, status: 'balanced' },
        { name: 'Science', percentage: 25, status: 'low' },
        { name: 'English', percentage: 40, status: 'high' }
      ]
    }
  },
  computed: {
    workloadMessage() {
      const highSubjects = this.workloadBalance.filter(s => s.status === 'high')
      const lowSubjects = this.workloadBalance.filter(s => s.status === 'low')
      
      if (highSubjects.length > 0) {
        return `Consider reducing time for ${highSubjects.map(s => s.name).join(', ')}`
      } else if (lowSubjects.length > 0) {
        return `Consider increasing time for ${lowSubjects.map(s => s.name).join(', ')}`
      }
      return 'Your workload is well balanced!'
    }
  },
  methods: {
    formatTime(hour) {
      return `${hour.toString().padStart(2, '0')}:00`
    },
    getTaskStyle(task) {
      return {
        gridRow: `${task.startHour + 1} / span ${task.duration}`,
        backgroundColor: this.getTaskColor(task)
      }
    },
    getTaskColor(task) {
      if (task.completed) return '#E2E8F0'
      if (task.title.includes('Math')) return '#E3F2FD'
      if (task.title.includes('Science')) return '#F3E5F5'
      if (task.title.includes('English')) return '#E8F5E9'
      return '#FFF3E0'
    },
    toggleTaskCompletion(task) {
      task.completed = !task.completed
      this.updateSchedule(task)
    },
    async updateSchedule(task) {
      try {
        // API call to update task status
        console.log('Updating task:', task)
      } catch (error) {
        console.error('Error updating task:', error)
      }
    },
    applyOptimalTimes() {
      // Implement optimal times application logic
      console.log('Applying optimal study times')
    },
    balanceWorkload() {
      // Implement workload balancing logic
      console.log('Balancing workload')
    }
  }
}
</script>

<style scoped>
.smart-schedule {
  padding: 2rem;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.schedule-header h1 {
  margin: 0;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1A1A1A;
}

.view-controls {
  display: flex;
  gap: 0.5rem;
  background: #f8f9fa;
  padding: 0.25rem;
  border-radius: 8px;
}

.view-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  transition: all 0.3s ease;
}

.view-btn.active {
  background: white;
  color: #C84C1C;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.schedule-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.schedule-grid {
  display: grid;
  grid-template-columns: 80px 1fr;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  height: calc(100vh - 200px);
  overflow-y: auto;
}

.time-slots {
  border-right: 1px solid #E2E8F0;
  padding: 1rem 0;
}

.time-slot {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
  font-size: 0.9rem;
}

.schedule-content {
  display: grid;
  grid-template-rows: repeat(24, 60px);
  padding: 1rem;
  position: relative;
}

.schedule-task {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid #E2E8F0;
  transition: all 0.3s ease;
}

.schedule-task.completed {
  opacity: 0.7;
}

.task-content h3 {
  margin: 0;
  font-size: 1rem;
  color: #1A1A1A;
}

.task-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #64748B;
}

.task-actions {
  display: flex;
  justify-content: flex-end;
}

.complete-btn {
  background: none;
  border: none;
  color: #C84C1C;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
}

.recommendations {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendations h2 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #1A1A1A;
}

.recommendation-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.card-header i {
  color: #C84C1C;
  font-size: 1.2rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #1A1A1A;
}

.card-content ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #64748B;
}

.card-content li {
  margin-bottom: 0.5rem;
}

.apply-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #C84C1C;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.apply-btn:hover {
  background: #B43D0E;
}

.balance-chart {
  display: flex;
  height: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  margin: 1rem 0;
}

.balance-bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  transition: width 0.3s ease;
}

.balance-bar.high {
  background: #EF4444;
}

.balance-bar.balanced {
  background: #10B981;
}

.balance-bar.low {
  background: #F59E0B;
}
</style> 