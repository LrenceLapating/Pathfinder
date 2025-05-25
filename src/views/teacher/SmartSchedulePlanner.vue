<template>
  <div class="schedule-planner">
    <!-- Header Section -->
    <div class="planner-header">
      <div class="header-left">
        <h1>Smart Schedule Planner</h1>
        <p class="subtitle">Intelligent class scheduling and resource allocation</p>
      </div>
      <div class="header-actions">
        <button class="secondary-btn" @click="importSchedule">
          <i class="fas fa-file-import"></i>
          Import Schedule
        </button>
        <button class="primary-btn" @click="generateSchedule">
          <i class="fas fa-magic"></i>
          Generate Schedule
        </button>
      </div>
    </div>

    <!-- Planning Tools -->
    <div class="planning-tools">
      <div class="tool-section">
        <h2>Schedule Parameters</h2>
        <div class="parameters-grid">
          <div class="parameter-card">
            <label>Term</label>
            <select v-model="scheduleParams.term">
              <option value="fall">Fall 2024</option>
              <option value="spring">Spring 2025</option>
              <option value="summer">Summer 2025</option>
            </select>
          </div>

          <div class="parameter-card">
            <label>Days Per Week</label>
            <div class="checkbox-group">
              <label v-for="day in weekDays" :key="day">
                <input type="checkbox" v-model="scheduleParams.days" :value="day">
                {{ day }}
              </label>
            </div>
          </div>

          <div class="parameter-card">
            <label>Class Duration (minutes)</label>
            <input type="number" v-model="scheduleParams.duration" min="30" step="15">
          </div>

          <div class="parameter-card">
            <label>Break Duration (minutes)</label>
            <input type="number" v-model="scheduleParams.breakDuration" min="5" step="5">
          </div>
        </div>
      </div>

      <div class="tool-section">
        <h2>Resource Allocation</h2>
        <div class="resource-grid">
          <div class="resource-card" v-for="resource in resources" :key="resource.id">
            <div class="resource-header">
              <h3>{{ resource.name }}</h3>
              <span class="resource-status" :class="resource.status">
                {{ resource.status }}
              </span>
            </div>
            <div class="resource-details">
              <p>Capacity: {{ resource.capacity }}</p>
              <p>Equipment: {{ resource.equipment.join(', ') }}</p>
            </div>
            <div class="resource-actions">
              <button class="icon-btn" @click="viewResourceDetails(resource)">
                <i class="fas fa-eye"></i>
              </button>
              <button class="icon-btn" @click="editResource(resource)">
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule Calendar -->
    <div class="schedule-calendar">
      <div class="calendar-header">
        <h2>Class Schedule</h2>
        <div class="calendar-actions">
          <button class="icon-btn" @click="previousWeek">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="current-week">Week of {{ currentWeek }}</span>
          <button class="icon-btn" @click="nextWeek">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div class="calendar-grid">
        <div class="time-column">
          <div class="time-slot" v-for="time in timeSlots" :key="time">
            {{ time }}
          </div>
        </div>
        <div class="day-column" v-for="day in activeDays" :key="day">
          <div class="day-header">{{ day }}</div>
          <div class="class-slots">
            <div 
              v-for="(classItem, index) in getClassesForDay(day)" 
              :key="index"
              class="class-slot"
              :style="getClassSlotStyle(classItem)"
            >
              <div class="class-content">
                <h4>{{ classItem.name }}</h4>
                <p>{{ classItem.teacher }}</p>
                <p>{{ classItem.room }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conflict Resolution -->
    <div class="conflicts-section" v-if="conflicts.length > 0">
      <h2>Schedule Conflicts</h2>
      <div class="conflicts-list">
        <div v-for="conflict in conflicts" :key="conflict.id" class="conflict-item">
          <div class="conflict-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="conflict-content">
            <h4>{{ conflict.type }}</h4>
            <p>{{ conflict.description }}</p>
          </div>
          <div class="conflict-actions">
            <button class="action-btn" @click="resolveConflict(conflict)">
              Resolve
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmartSchedulePlanner',

  data() {
    return {
      scheduleParams: {
        term: 'fall',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        duration: 60,
        breakDuration: 15
      },
      weekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      resources: [
        {
          id: 1,
          name: 'Room 101',
          status: 'available',
          capacity: 30,
          equipment: ['Projector', 'Whiteboard', 'Computer']
        },
        // Add more resources...
      ],
      currentWeek: 'September 1, 2024',
      timeSlots: [
        '8:00 AM',
        '9:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '1:00 PM',
        '2:00 PM',
        '3:00 PM',
        '4:00 PM'
      ],
      conflicts: [
        {
          id: 1,
          type: 'Room Conflict',
          description: 'Room 101 is double-booked on Monday at 10:00 AM'
        },
        // Add more conflicts...
      ]
    }
  },

  computed: {
    activeDays() {
      return this.scheduleParams.days
    }
  },

  methods: {
    importSchedule() {
      // Implement schedule import
    },

    generateSchedule() {
      // Implement AI-powered schedule generation
    },

    viewResourceDetails(resource) {
      // Show resource details modal
    },

    editResource(resource) {
      // Show resource edit modal
    },

    previousWeek() {
      // Navigate to previous week
    },

    nextWeek() {
      // Navigate to next week
    },

    getClassesForDay(day) {
      // Return classes for the given day
      return []
    },

    getClassSlotStyle(classItem) {
      // Calculate position and height based on time
      return {
        top: '0px',
        height: '60px'
      }
    },

    resolveConflict(conflict) {
      // Show conflict resolution dialog
    }
  }
}
</script>

<style scoped>
.schedule-planner {
  padding: 1.5rem;
}

.planner-header {
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

.tool-section {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.tool-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #1E293B;
}

.parameters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.parameter-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.parameter-card label {
  font-size: 0.875rem;
  color: #64748B;
}

.parameter-card select,
.parameter-card input[type="number"] {
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.resource-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.resource-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #1E293B;
}

.resource-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.resource-status.available {
  background: #DCFCE7;
  color: #10B981;
}

.resource-status.occupied {
  background: #FEE2E2;
  color: #EF4444;
}

.resource-details p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #64748B;
}

.resource-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.schedule-calendar {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.calendar-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1E293B;
}

.calendar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-week {
  font-size: 0.875rem;
  color: #64748B;
}

.calendar-grid {
  display: grid;
  grid-template-columns: auto repeat(5, 1fr);
  gap: 1px;
  background: #E2E8F0;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.time-column {
  background: #F8FAFC;
  padding: 0.5rem;
}

.time-slot {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #64748B;
}

.day-column {
  background: white;
}

.day-header {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: #1E293B;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
}

.class-slots {
  position: relative;
  height: 540px; /* 9 hours * 60px */
}

.class-slot {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 0.5rem;
  background: #EBF5FF;
  border-left: 4px solid #2563EB;
  border-radius: 0.25rem;
  padding: 0.5rem;
}

.class-content h4 {
  margin: 0;
  font-size: 0.875rem;
  color: #1E293B;
}

.class-content p {
  margin: 0.25rem 0 0 0;
  font-size: 0.75rem;
  color: #64748B;
}

.conflicts-section {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.conflicts-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #1E293B;
}

.conflict-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #E2E8F0;
}

.conflict-item:last-child {
  border-bottom: none;
}

.conflict-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #FEE2E2;
  color: #EF4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: 1rem;
}

.conflict-content {
  flex: 1;
}

.conflict-content h4 {
  margin: 0;
  font-size: 1rem;
  color: #1E293B;
}

.conflict-content p {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #64748B;
}

.conflict-actions {
  margin-left: 1rem;
}

.primary-btn,
.secondary-btn,
.action-btn,
.icon-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn {
  background: #2563EB;
  color: white;
  border: none;
}

.primary-btn:hover {
  background: #1D4ED8;
}

.secondary-btn {
  background: white;
  color: #1E293B;
  border: 1px solid #E2E8F0;
}

.secondary-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.action-btn {
  padding: 0.5rem 1rem;
  background: #F8FAFC;
  color: #2563EB;
  border: 1px solid #E2E8F0;
}

.action-btn:hover {
  background: #EBF5FF;
  border-color: #2563EB;
}

.icon-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: #64748B;
}

.icon-btn:hover {
  color: #2563EB;
  background: #F1F5F9;
}
</style> 