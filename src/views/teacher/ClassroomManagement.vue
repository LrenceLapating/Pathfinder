<template>
  <div class="classroom-management">
    <div class="page-header">
      <h1>Classroom Management</h1>
      <button class="create-btn" @click="showCreateClassroomModal = true">
        <i class="fas fa-plus"></i> Create Classroom
      </button>
    </div>

    <!-- Classroom List -->
    <div class="view-controls">
      <div class="view-toggle">
        <button 
          class="view-btn" 
          :class="{ 'active': viewMode === 'grid' }" 
          @click="viewMode = 'grid'"
        >
          <i class="fas fa-th-large"></i>
        </button>
        <button 
          class="view-btn" 
          :class="{ 'active': viewMode === 'list' }" 
          @click="viewMode = 'list'"
        >
          <i class="fas fa-list"></i>
        </button>
      </div>
      <div class="filter-search">
        <div class="search-input">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search classrooms..." 
          />
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="classroom-grid">
      <div 
        v-for="classroom in filteredClassrooms" 
        :key="classroom.id" 
        class="classroom-card"
      >
        <div class="classroom-header">
          <h3>{{ classroom.subject }}</h3>
          <div class="classroom-status" :class="classroom.status.toLowerCase()">
            {{ classroom.status }}
          </div>
        </div>
        <div class="classroom-details">
          <div class="detail-item">
            <i class="fas fa-users"></i>
            <span>{{ classroom.students }} Students</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-key"></i>
            <span>Code: <strong>{{ classroom.code }}</strong></span>
            <button class="copy-code-btn" @click="copyCode(classroom.code)" title="Copy Code">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>
        <div class="classroom-actions">
          <button class="action-btn view-btn" @click="viewClassroom(classroom.id)">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="action-btn archive-btn" @click="archiveClassroom(classroom.id)">
            <i class="fas fa-archive"></i> Archive
          </button>
          <button class="action-btn delete-btn" @click="confirmDeleteClassroom(classroom.id)">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="classroom-table">
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Students</th>
            <th>Code</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="classroom in filteredClassrooms" :key="classroom.id">
            <td>{{ classroom.subject }}</td>
            <td>{{ classroom.students }}</td>
            <td>
              <div class="code-cell">
                {{ classroom.code }}
                <button class="copy-code-btn small" @click="copyCode(classroom.code)" title="Copy Code">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </td>
            <td>
              <span class="status-badge" :class="classroom.status.toLowerCase()">
                {{ classroom.status }}
              </span>
            </td>
            <td>
              <div class="table-actions">
                <button class="icon-btn" @click="viewClassroom(classroom.id)" title="View Classroom">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="icon-btn" @click="archiveClassroom(classroom.id)" title="Archive Classroom">
                  <i class="fas fa-archive"></i>
                </button>
                <button class="icon-btn" @click="confirmDeleteClassroom(classroom.id)" title="Delete Classroom">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredClassrooms.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-chalkboard"></i>
      </div>
      <h2>No Classrooms Found</h2>
      <p v-if="searchQuery">No classrooms match your search criteria. Try a different search term.</p>
      <p v-else>You haven't created any classrooms yet.</p>
      <button class="create-btn" @click="showCreateClassroomModal = true">
        Create Your First Classroom
      </button>
    </div>

    <!-- Create Classroom Modal -->
    <div class="modal-overlay" v-if="showCreateClassroomModal" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>Create New Classroom</h2>
          <button class="close-modal-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="subject-name">Subject Name</label>
            <input type="text" id="subject-name" v-model="newClassroom.subject" placeholder="e.g. Algebra, Physics, English" />
          </div>
          <div class="form-group code-display" v-if="newClassroom.code">
            <label>Classroom Code</label>
            <div class="code-container">
              <span class="generated-code">{{ newClassroom.code }}</span>
              <button class="copy-btn" @click="copyCode(newClassroom.code)" title="Copy Code">
                <i class="fas fa-copy"></i>
              </button>
            </div>
            <p class="code-help">Share this code with your students to join the classroom</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="create-btn" @click="createClassroom" :disabled="!newClassroom.subject">
            Create Classroom
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" v-if="showDeleteModal" @click="closeDeleteModal">
      <div class="modal-container delete-modal" @click.stop>
        <div class="modal-header">
          <h2>Delete Classroom</h2>
          <button class="close-modal-btn" @click="closeDeleteModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="warning-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <p>Are you sure you want to delete this classroom? This action cannot be undone and all student data will be lost.</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeDeleteModal">Cancel</button>
          <button class="delete-btn" @click="deleteClassroom">
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClassroomManagement',
  
  data() {
    return {
      viewMode: 'grid',
      searchQuery: '',
      showCreateClassroomModal: false,
      showDeleteModal: false,
      classroomToDelete: null,
      newClassroom: {
        subject: '',
        code: ''
      },
      classrooms: [
        {
          id: 1,
          subject: 'Mathematics 101',
          students: 25,
          code: 'MATH101',
          status: 'Active'
        },
        {
          id: 2,
          subject: 'Physics Advanced',
          students: 22,
          code: 'PHYS202',
          status: 'Active'
        },
        {
          id: 3,
          subject: 'Chemistry Basics',
          students: 18,
          code: 'CHEM100',
          status: 'Active'
        },
        {
          id: 4,
          subject: 'Biology',
          students: 0,
          code: 'BIO100',
          status: 'New'
        },
        {
          id: 5,
          subject: 'English Literature',
          students: 12,
          code: 'ENG203',
          status: 'Archived'
        }
      ]
    };
  },
  
  computed: {
    filteredClassrooms() {
      if (!this.searchQuery) {
        return this.classrooms;
      }
      
      const query = this.searchQuery.toLowerCase();
      return this.classrooms.filter(classroom => 
        classroom.subject.toLowerCase().includes(query) || 
        classroom.code.toLowerCase().includes(query)
      );
    }
  },
  
  methods: {
    closeModal() {
      this.showCreateClassroomModal = false;
      // Reset the form
      this.newClassroom = {
        subject: '',
        code: ''
      };
    },
    
    createClassroom() {
      if (this.newClassroom.subject) {
        // Generate a random code if not already generated
        this.newClassroom.code = this.generateClassroomCode();
      }
    },
    
    generateClassroomCode() {
      // Generate a random 6-character alphanumeric code
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    },
    
    copyCode(code) {
      navigator.clipboard.writeText(code)
        .then(() => {
          // Show a notification that the code was copied
          alert('Code copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy code: ', err);
        });
    },
    
    viewClassroom(id) {
      this.$router.push(`/teacher/classroom/${id}`);
    },
    
    archiveClassroom(id) {
      // Find the classroom and toggle its archived status
      const classroom = this.classrooms.find(c => c.id === id);
      if (classroom) {
        classroom.status = classroom.status === 'Archived' ? 'Active' : 'Archived';
      }
    },
    
    confirmDeleteClassroom(id) {
      this.classroomToDelete = id;
      this.showDeleteModal = true;
    },
    
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.classroomToDelete = null;
    },
    
    deleteClassroom() {
      if (this.classroomToDelete) {
        // In a real app, this would call an API to delete the classroom
        this.classrooms = this.classrooms.filter(c => c.id !== this.classroomToDelete);
        this.closeDeleteModal();
      }
    }
  }
};
</script>

<style scoped>
.classroom-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.create-btn {
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

.create-btn:hover {
  background-color: #2d6bbd;
}

/* View Controls */
.view-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-toggle {
  display: flex;
  background-color: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
}

.view-btn {
  background: none;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn.active {
  background-color: #3b7ddd;
  color: white;
}

.filter-search {
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
  padding: 10px 0;
  font-size: 14px;
  width: 200px;
  outline: none;
}

/* Grid View */
.classroom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.classroom-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.classroom-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.classroom-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.classroom-status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
}

.classroom-status.active {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.classroom-status.new {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.classroom-status.archived {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.classroom-details {
  padding: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.detail-item i {
  margin-right: 10px;
  color: #6b7280;
  width: 16px;
}

.copy-code-btn {
  background: none;
  border: none;
  color: #3b7ddd;
  cursor: pointer;
  margin-left: 8px;
}

.classroom-actions {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 8px 0;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
}

.action-btn i {
  font-size: 12px;
}

.view-btn {
  background-color: #f3f4f6;
  color: #374151;
}

.view-btn:hover {
  background-color: #e5e7eb;
}

.archive-btn {
  background-color: #f3f4f6;
  color: #374151;
}

.archive-btn:hover {
  background-color: #e5e7eb;
}

.delete-btn {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.2);
}

/* List View */
.classroom-table {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px 15px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  background-color: #f9fafb;
  border-bottom: 1px solid #eee;
}

td {
  padding: 12px 15px;
  font-size: 14px;
  border-bottom: 1px solid #eee;
}

.code-cell {
  display: flex;
  align-items: center;
}

.copy-code-btn.small {
  width: 24px;
  height: 24px;
  font-size: 12px;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
}

.status-badge.active {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.new {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-badge.archived {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6b7280;
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

.icon-btn:last-child {
  color: #ef4444;
}

/* Empty State */
.empty-state {
  margin-top: 40px;
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 48px;
  color: #6b7280;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}

.empty-state p {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 24px;
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
  z-index: 1000;
}

.modal-container {
  background-color: #fff;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.delete-modal {
  width: 400px;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-modal-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #3b7ddd;
}

.code-display {
  background-color: #f3f4f6;
  padding: 15px;
  border-radius: 6px;
}

.code-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.generated-code {
  font-family: monospace;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
}

.copy-btn {
  background: none;
  border: none;
  color: #3b7ddd;
  cursor: pointer;
  font-size: 16px;
}

.code-help {
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}

.warning-icon {
  font-size: 48px;
  color: #ef4444;
  text-align: center;
  margin-bottom: 20px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  padding: 10px 16px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.delete-btn {
  padding: 10px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .classroom-grid {
    grid-template-columns: 1fr;
  }
  
  .classroom-actions {
    flex-direction: column;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .view-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .search-input input {
    width: 100%;
  }
  
  .table-actions {
    flex-direction: column;
  }
  
  th:nth-child(4), td:nth-child(4) {
    display: none;
  }
}
</style> 