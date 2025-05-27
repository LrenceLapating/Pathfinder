<template>
  <div class="classroom-detail">
    <div class="page-header">
      <div class="header-content">
        <div class="back-link" @click="goBack">
          <i class="fas fa-arrow-left"></i>
          <span>Back to Classrooms</span>
        </div>
        <h1 v-if="classroom">{{ classroom.subject }}</h1>
        <div class="classroom-code" v-if="classroom">
          <span>Class Code: <strong>{{ classroom.code }}</strong></span>
          <button class="copy-btn" @click="copyCode(classroom.code)" title="Copy Code">
            <i class="fas fa-copy"></i>
          </button>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-secondary">
          <i class="fas fa-cog"></i> Settings
        </button>
        <button class="btn-primary">
          <i class="fas fa-book"></i> Assign Study Guide
        </button>
      </div>
    </div>

    <div class="loading-state" v-if="loading">
      <div class="spinner"></div>
      <p>Loading classroom details...</p>
    </div>

    <div v-else-if="!classroom" class="not-found">
      <div class="not-found-icon">
        <i class="fas fa-search"></i>
      </div>
      <h2>Classroom Not Found</h2>
      <p>The classroom you're looking for doesn't exist or you don't have access to it.</p>
      <button class="btn-primary" @click="goBack">Back to Classrooms</button>
    </div>

    <div v-else class="classroom-content">
      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ 'active': activeTab === 'students' }" 
          @click="activeTab = 'students'"
        >
          <i class="fas fa-users"></i> Students
        </button>
        <button 
          class="tab-btn" 
          :class="{ 'active': activeTab === 'performance' }" 
          @click="activeTab = 'performance'"
        >
          <i class="fas fa-chart-line"></i> Performance
        </button>
        <button 
          class="tab-btn" 
          :class="{ 'active': activeTab === 'guides' }" 
          @click="activeTab = 'guides'"
        >
          <i class="fas fa-book"></i> Study Guides
        </button>
      </div>

      <!-- Students Tab -->
      <div v-if="activeTab === 'students'" class="tab-content">
        <div class="card">
          <div class="card-header">
            <h2>Student Roster</h2>
            <div class="card-actions">
              <div class="search-input">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search students..." />
              </div>
            </div>
          </div>
          <div class="card-body">
            <table class="student-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Progress</th>
                  <th>Performance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in classroom.students" :key="student.id">
                  <td>
                    <div class="student-name">
                      <div class="avatar">{{ getInitials(student.name) }}</div>
                      <span>{{ student.name }}</span>
                    </div>
                  </td>
                  <td>{{ student.email }}</td>
                  <td>
                    <div class="progress-bar">
                      <div class="progress" :style="{ width: student.progress + '%' }"></div>
                    </div>
                    <span class="progress-text">{{ student.progress }}%</span>
                  </td>
                  <td>
                    <div class="performance" :class="getPerformanceClass(student.performance)">
                      {{ student.performance }}%
                    </div>
                  </td>
                  <td>
                    <span class="status-badge" :class="student.status.toLowerCase()">
                      {{ student.status }}
                    </span>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="icon-btn" title="View Student Details">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="icon-btn" title="Send Message">
                        <i class="fas fa-envelope"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Performance Tab -->
      <div v-else-if="activeTab === 'performance'" class="tab-content">
        <div class="card">
          <div class="card-header">
            <h2>Class Performance</h2>
            <div class="card-actions">
              <select class="select-input">
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-placeholder">
              <i class="fas fa-chart-bar"></i>
              <p>Performance chart will be displayed here</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Study Guides Tab -->
      <div v-else-if="activeTab === 'guides'" class="tab-content">
        <div class="card">
          <div class="card-header">
            <h2>Study Guides</h2>
            <button class="btn-primary">
              <i class="fas fa-plus"></i> Create Guide
            </button>
          </div>
          <div class="card-body">
            <div v-if="classroom.guides && classroom.guides.length > 0" class="guides-grid">
              <div v-for="guide in classroom.guides" :key="guide.id" class="guide-card">
                <div class="guide-header">
                  <h3>{{ guide.title }}</h3>
                  <span class="guide-date">Created {{ guide.date }}</span>
                </div>
                <div class="guide-body">
                  <p>{{ guide.description }}</p>
                </div>
                <div class="guide-footer">
                  <span class="completion">
                    <i class="fas fa-users"></i> {{ guide.completion }}% completed
                  </span>
                  <button class="btn-text">View Guide</button>
                </div>
              </div>
            </div>
            <div v-else class="empty-guides">
              <div class="empty-icon">
                <i class="fas fa-book"></i>
              </div>
              <h3>No Study Guides Yet</h3>
              <p>Create your first study guide for this class to help students improve</p>
              <button class="btn-primary">Create Study Guide</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClassroomDetail',
  
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  
  data() {
    return {
      loading: true,
      classroom: null,
      activeTab: 'students',
      mockClassroom: {
        id: 1,
        subject: 'Mathematics 101',
        code: 'MATH101',
        status: 'Active',
        students: [
          {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@example.com',
            progress: 75,
            performance: 82,
            status: 'Active'
          },
          {
            id: 2,
            name: 'Emily Johnson',
            email: 'emily.j@example.com',
            progress: 92,
            performance: 95,
            status: 'Active'
          },
          {
            id: 3,
            name: 'Michael Brown',
            email: 'michael.b@example.com',
            progress: 45,
            performance: 58,
            status: 'At Risk'
          },
          {
            id: 4,
            name: 'Sarah Wilson',
            email: 'sarah.w@example.com',
            progress: 88,
            performance: 91,
            status: 'Active'
          },
          {
            id: 5,
            name: 'David Lee',
            email: 'david.lee@example.com',
            progress: 30,
            performance: 42,
            status: 'At Risk'
          }
        ],
        guides: [
          {
            id: 1,
            title: 'Algebra Fundamentals',
            description: 'A comprehensive guide to basic algebraic operations and equations.',
            date: 'May 10, 2023',
            completion: 82
          },
          {
            id: 2,
            title: 'Linear Equations',
            description: 'Understanding linear equations and their applications in real-world problems.',
            date: 'May 15, 2023',
            completion: 65
          }
        ]
      }
    };
  },
  
  created() {
    // Simulate API call
    setTimeout(() => {
      // In a real app, we would fetch data from an API based on this.id
      this.classroom = this.mockClassroom;
      this.loading = false;
    }, 1000);
  },
  
  methods: {
    goBack() {
      this.$router.push('/teacher/classrooms');
    },
    
    copyCode(code) {
      navigator.clipboard.writeText(code)
        .then(() => {
          alert('Code copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy code: ', err);
        });
    },
    
    getInitials(name) {
      return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase();
    },
    
    getPerformanceClass(performance) {
      if (performance >= 80) return 'excellent';
      if (performance >= 60) return 'good';
      if (performance >= 40) return 'average';
      return 'poor';
    }
  }
};
</script>

<style scoped>
.classroom-detail {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  margin-bottom: 5px;
}

.back-link:hover {
  color: #3b7ddd;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.classroom-code {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #6b7280;
}

.copy-btn {
  background: none;
  border: none;
  color: #3b7ddd;
  cursor: pointer;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #3b7ddd;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #2d6bbd;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b7ddd;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.not-found {
  text-align: center;
  padding: 60px 0;
}

.not-found-icon {
  font-size: 48px;
  color: #6b7280;
  margin-bottom: 15px;
}

.not-found h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

.not-found p {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #3b7ddd;
}

.tab-btn.active {
  color: #3b7ddd;
  border-bottom-color: #3b7ddd;
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.search-input {
  display: flex;
  align-items: center;
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 0 12px;
}

.search-input i {
  color: #6b7280;
  margin-right: 8px;
}

.search-input input {
  background: none;
  border: none;
  padding: 8px 0;
  font-size: 14px;
  width: 200px;
  outline: none;
}

.select-input {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.card-body {
  padding: 20px;
}

.student-table {
  width: 100%;
  border-collapse: collapse;
}

.student-table th {
  text-align: left;
  padding: 12px 15px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  background-color: #f9fafb;
  border-bottom: 1px solid #eee;
}

.student-table td {
  padding: 12px 15px;
  font-size: 14px;
  border-bottom: 1px solid #eee;
}

.student-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #3b7ddd;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.progress-bar {
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress {
  height: 100%;
  background-color: #3b7ddd;
  border-radius: 3px;
}

.progress-text {
  font-size: 12px;
  color: #6b7280;
}

.performance {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.performance.excellent {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.performance.good {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.performance.average {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.performance.poor {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.active {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.at {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #f3f4f6;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background-color: #e5e7eb;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.chart-placeholder i {
  font-size: 48px;
  color: #6b7280;
  margin-bottom: 15px;
}

.chart-placeholder p {
  font-size: 16px;
  color: #6b7280;
}

.guides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.guide-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.guide-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.guide-header h3 {
  margin: 0 0 5px;
  font-size: 16px;
  font-weight: 600;
}

.guide-date {
  font-size: 12px;
  color: #6b7280;
}

.guide-body {
  padding: 15px;
}

.guide-body p {
  margin: 0;
  font-size: 14px;
  color: #374151;
}

.guide-footer {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.completion {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-text {
  background: none;
  border: none;
  color: #3b7ddd;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.empty-guides {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.empty-icon {
  font-size: 48px;
  color: #6b7280;
  margin-bottom: 15px;
}

.empty-guides h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.empty-guides p {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .btn-primary, .btn-secondary {
    flex: 1;
    justify-content: center;
  }
  
  .tabs {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 5px;
  }
  
  .student-table {
    display: block;
    overflow-x: auto;
  }
  
  .guides-grid {
    grid-template-columns: 1fr;
  }
}
</style> 