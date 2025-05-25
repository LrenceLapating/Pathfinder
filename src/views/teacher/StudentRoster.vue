<template>
  <div class="student-roster">
    <!-- Header Section -->
    <div class="roster-header">
      <div class="header-left">
        <h1>Student Roster</h1>
        <div class="roster-stats">
          <div class="stat">
            <span class="stat-value">{{ totalStudents }}</span>
            <span class="stat-label">Total Students</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ activeStudents }}</span>
            <span class="stat-label">Active Today</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ needsAttention }}</span>
            <span class="stat-label">Needs Attention</span>
          </div>
        </div>
      </div>
      
      <div class="header-actions">
        <button class="action-btn" @click="exportData">
          <i class="fas fa-download"></i>
          Export Data
        </button>
        <button class="primary-btn" @click="showAddStudent">
          <i class="fas fa-plus"></i>
          Add Student
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="roster-filters">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search by name, ID, or email..."
          @input="filterStudents"
        />
      </div>

      <div class="filter-group">
        <select v-model="selectedClass" @change="filterStudents">
          <option value="">All Classes</option>
          <option v-for="courseClass in courseClasses" :key="courseClass" :value="courseClass">
            {{ courseClass }}
          </option>
        </select>

        <select v-model="selectedStatus" @change="filterStudents">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="at_risk">At Risk</option>
        </select>

        <select v-model="sortBy" @change="sortStudents">
          <option value="name">Name</option>
          <option value="performance">Performance</option>
          <option value="last_active">Last Active</option>
          <option value="progress">Progress</option>
        </select>
      </div>
    </div>

    <!-- Student List -->
    <div class="student-list">
      <div class="list-header">
        <div class="header-cell">
          <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
        </div>
        <div class="header-cell">Student</div>
        <div class="header-cell">ID</div>
        <div class="header-cell">Class</div>
        <div class="header-cell">Performance</div>
        <div class="header-cell">Progress</div>
        <div class="header-cell">Last Active</div>
        <div class="header-cell">Status</div>
        <div class="header-cell">Actions</div>
      </div>

      <div v-for="student in filteredStudents" 
           :key="student.id" 
           class="student-row"
           :class="{ 'selected': selectedStudents.includes(student.id) }">
        <div class="cell">
          <input 
            type="checkbox" 
            :value="student.id" 
            v-model="selectedStudents"
          />
        </div>
        
        <div class="cell student-info">
          <img :src="student.avatar" :alt="student.name" class="student-avatar" />
          <div class="student-details">
            <h4>{{ student.name }}</h4>
            <p>{{ student.email }}</p>
          </div>
        </div>
        
        <div class="cell">{{ student.studentId }}</div>
        
        <div class="cell">{{ student.courseClass }}</div>
        
        <div class="cell">
          <div class="performance-indicator">
            <div class="progress-bar" :style="{ width: student.performance + '%' }"></div>
            <span>{{ student.performance }}%</span>
          </div>
        </div>
        
        <div class="cell">
          <div class="progress-indicator">
            <div class="progress-segments">
              <div v-for="(segment, index) in student.progressSegments"
                   :key="index"
                   class="segment"
                   :class="segment.status">
              </div>
            </div>
            <span>{{ student.progress }}%</span>
          </div>
        </div>
        
        <div class="cell">
          <span class="last-active" :title="student.lastActiveDate">
            {{ formatLastActive(student.lastActive) }}
          </span>
        </div>
        
        <div class="cell">
          <span class="status-badge" :class="student.status">
            {{ student.status }}
          </span>
        </div>
        
        <div class="cell actions">
          <button class="icon-btn" @click="viewProfile(student)" title="View Profile">
            <i class="fas fa-user"></i>
          </button>
          <button class="icon-btn" @click="viewPerformance(student)" title="View Performance">
            <i class="fas fa-chart-line"></i>
          </button>
          <button class="icon-btn" @click="sendMessage(student)" title="Send Message">
            <i class="fas fa-comment"></i>
          </button>
          <div class="more-actions">
            <button class="icon-btn" @click="toggleMoreActions(student)">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <div v-if="student.showMoreActions" class="actions-dropdown">
              <button @click="editStudent(student)">
                <i class="fas fa-edit"></i> Edit Details
              </button>
              <button @click="resetPassword(student)">
                <i class="fas fa-key"></i> Reset Password
              </button>
              <button @click="archiveStudent(student)" class="danger">
                <i class="fas fa-archive"></i> Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div class="bulk-actions" v-if="selectedStudents.length > 0">
      <span class="selection-info">
        {{ selectedStudents.length }} students selected
      </span>
      <div class="bulk-buttons">
        <button class="secondary-btn" @click="sendBulkMessage">
          <i class="fas fa-envelope"></i>
          Message
        </button>
        <button class="secondary-btn" @click="exportSelected">
          <i class="fas fa-download"></i>
          Export
        </button>
        <button class="secondary-btn" @click="assignToClass">
          <i class="fas fa-users"></i>
          Assign Class
        </button>
        <button class="danger-btn" @click="archiveSelected">
          <i class="fas fa-archive"></i>
          Archive
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="page-btn"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      
      <div class="page-numbers">
        <button 
          v-for="page in displayedPages"
          :key="page"
          @click="changePage(page)"
          :class="['page-btn', { active: currentPage === page }]"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="page-btn"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
      
      <select v-model="pageSize" @change="updatePageSize" class="page-size">
        <option :value="10">10 / page</option>
        <option :value="25">25 / page</option>
        <option :value="50">50 / page</option>
        <option :value="100">100 / page</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentRoster',
  
  data() {
    return {
      // Stats
      totalStudents: 156,
      activeStudents: 89,
      needsAttention: 12,

      // Filters
      searchQuery: '',
      selectedClass: '',
      selectedStatus: '',
      sortBy: 'name',
      courseClasses: ['Math 101', 'Physics 201', 'Chemistry 301', 'Biology 101'],

      // Student Selection
      selectAll: false,
      selectedStudents: [],

      // Pagination
      currentPage: 1,
      pageSize: 25,
      totalPages: 7,

      // Mock Data
      students: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          studentId: 'STU001',
          avatar: '/avatars/student1.jpg',
          courseClass: 'Math 101',
          performance: 85,
          progress: 75,
          progressSegments: [
            { status: 'completed' },
            { status: 'completed' },
            { status: 'completed' },
            { status: 'in-progress' },
            { status: 'pending' }
          ],
          lastActive: new Date(),
          status: 'active'
        },
        // Add more student data...
      ]
    }
  },

  computed: {
    filteredStudents() {
      // Implement filtering logic
      return this.students
    },

    displayedPages() {
      // Implement pagination display logic
      return [1, 2, 3, 4, 5]
    }
  },

  methods: {
    filterStudents() {
      // Implement filter logic
    },

    sortStudents() {
      // Implement sort logic
    },

    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedStudents = this.filteredStudents.map(s => s.id)
      } else {
        this.selectedStudents = []
      }
    },

    formatLastActive(date) {
      // Implement date formatting
      return '2 hours ago'
    },

    // Action Methods
    viewProfile(student) {
      this.$router.push(`/teacher/students/${student.id}/profile`)
    },

    viewPerformance(student) {
      this.$router.push(`/teacher/students/${student.id}/performance`)
    },

    sendMessage(student) {
      // Implement message sending
    },

    toggleMoreActions(student) {
      student.showMoreActions = !student.showMoreActions
    },

    // Bulk Actions
    sendBulkMessage() {
      // Implement bulk message
    },

    exportSelected() {
      // Implement export
    },

    assignToClass() {
      // Implement class assignment
    },

    archiveSelected() {
      // Implement archive
    },

    // Pagination Methods
    changePage(page) {
      this.currentPage = page
      // Implement page change logic
    },

    updatePageSize() {
      // Implement page size update logic
    }
  }
}
</script>

<style scoped>
.student-roster {
  padding: 1.5rem;
}

.roster-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-left h1 {
  margin: 0 0 1rem 0;
  font-size: 1.875rem;
  color: #1E293B;
}

.roster-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1E293B;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748B;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background: white;
  color: #64748B;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #CBD5E1;
  background: #F8FAFC;
}

.primary-btn {
  padding: 0.5rem 1rem;
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

.roster-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748B;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1E293B;
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-group select {
  padding: 0.75rem 2rem 0.75rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background: white;
  color: #1E293B;
  font-size: 0.875rem;
  cursor: pointer;
}

.student-list {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.list-header {
  display: grid;
  grid-template-columns: 40px 2fr 1fr 1fr 1fr 1fr 1fr 1fr 120px;
  padding: 1rem;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
}

.header-cell {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.student-row {
  display: grid;
  grid-template-columns: 40px 2fr 1fr 1fr 1fr 1fr 1fr 1fr 120px;
  padding: 1rem;
  align-items: center;
  border-bottom: 1px solid #E2E8F0;
  transition: background 0.3s ease;
}

.student-row:hover {
  background: #F8FAFC;
}

.student-row.selected {
  background: #EFF6FF;
}

.cell {
  padding: 0 0.5rem;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.student-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.student-details h4 {
  margin: 0;
  font-size: 0.875rem;
  color: #1E293B;
}

.student-details p {
  margin: 0;
  font-size: 0.75rem;
  color: #64748B;
}

.performance-indicator,
.progress-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  height: 6px;
  background: #2563EB;
  border-radius: 3px;
}

.progress-segments {
  display: flex;
  gap: 2px;
  flex: 1;
}

.segment {
  height: 6px;
  flex: 1;
  border-radius: 3px;
}

.segment.completed {
  background: #10B981;
}

.segment.in-progress {
  background: #F59E0B;
}

.segment.pending {
  background: #E2E8F0;
}

.last-active {
  font-size: 0.875rem;
  color: #64748B;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.status-badge.active {
  background: #DCFCE7;
  color: #10B981;
}

.status-badge.inactive {
  background: #FEE2E2;
  color: #EF4444;
}

.status-badge.at_risk {
  background: #FEF3C7;
  color: #F59E0B;
}

.actions {
  display: flex;
  gap: 0.5rem;
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

.more-actions {
  position: relative;
}

.actions-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 10;
}

.actions-dropdown button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: #1E293B;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.actions-dropdown button:hover {
  background: #F8FAFC;
}

.actions-dropdown button.danger {
  color: #EF4444;
}

.bulk-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.selection-info {
  font-size: 0.875rem;
  color: #64748B;
}

.bulk-buttons {
  display: flex;
  gap: 1rem;
}

.secondary-btn {
  padding: 0.5rem 1rem;
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

.danger-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: #FEE2E2;
  color: #EF4444;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.danger-btn:hover {
  background: #FEE2E2;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background: white;
  color: #64748B;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #CBD5E1;
  background: #F8FAFC;
}

.page-btn.active {
  background: #2563EB;
  color: white;
  border-color: #2563EB;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-size {
  padding: 0.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background: white;
  color: #64748B;
  font-size: 0.875rem;
}
</style> 