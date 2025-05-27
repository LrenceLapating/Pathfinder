<template>
  <div class="teacher-profile">
    <div class="page-header">
      <h1>Profile & Settings</h1>
    </div>
    
    <div class="profile-tabs">
      <button 
        class="tab-btn" 
        :class="{ 'active': activeTab === 'profile' }" 
        @click="changeTab('profile')"
      >
        <i class="fas fa-user"></i> Profile
      </button>
      <button 
        class="tab-btn" 
        :class="{ 'active': activeTab === 'settings' }" 
        @click="changeTab('settings')"
      >
        <i class="fas fa-cog"></i> Settings
      </button>
    </div>
    
    <!-- Profile Tab -->
    <div v-if="activeTab === 'profile'" class="profile-section">
      <div class="profile-card">
        <div class="profile-header">
          <h2>Personal Information</h2>
          <button class="edit-btn" @click="editMode = !editMode">
            {{ editMode ? 'Cancel' : 'Edit Profile' }}
          </button>
        </div>
        
        <div class="profile-content">
          <div class="profile-picture-section">
            <div class="profile-picture">
              <img :src="profileData.avatar || defaultAvatar" alt="Profile Picture" />
              <div v-if="editMode" class="upload-overlay" @click="triggerFileUpload">
                <i class="fas fa-camera"></i>
                <span>Change</span>
              </div>
            </div>
            <input 
              type="file" 
              ref="fileInput" 
              accept="image/*" 
              style="display: none" 
              @change="handleFileUpload" 
            />
            <div v-if="editMode" class="picture-actions">
              <button class="btn-outline" @click="triggerFileUpload">Upload New</button>
              <button v-if="profileData.avatar" class="btn-text" @click="removeProfilePicture">
                Remove
              </button>
            </div>
          </div>
          
          <div class="profile-details">
            <div class="form-group">
              <label>Full Name</label>
              <input 
                v-if="editMode" 
                type="text" 
                v-model="profileData.fullName" 
                placeholder="Enter your full name"
              />
              <div v-else class="info-display">{{ profileData.fullName }}</div>
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input 
                v-if="editMode" 
                type="email" 
                v-model="profileData.email" 
                placeholder="Enter your email"
                disabled
              />
              <div v-else class="info-display">{{ profileData.email }}</div>
              <div class="info-hint">Email cannot be changed</div>
            </div>
            
            <div class="form-group">
              <label>Assigned Subjects</label>
              <div class="assigned-subjects">
                <div v-for="subject in profileData.subjects" :key="subject" class="subject-tag">
                  {{ subject }}
                </div>
              </div>
            </div>
            
            <div v-if="editMode" class="form-group">
              <button class="save-btn" @click="saveProfile">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="profile-card">
        <div class="profile-header">
          <h2>Change Password</h2>
        </div>
        
        <div class="password-section">
          <div class="form-group">
            <label>Current Password</label>
            <div class="password-input">
              <input 
                :type="showPassword.current ? 'text' : 'password'" 
                v-model="passwordData.current" 
                placeholder="Enter current password"
              />
              <button 
                class="toggle-password" 
                @click="showPassword.current = !showPassword.current"
                type="button"
              >
                <i :class="showPassword.current ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>New Password</label>
            <div class="password-input">
              <input 
                :type="showPassword.new ? 'text' : 'password'" 
                v-model="passwordData.new" 
                placeholder="Enter new password"
              />
              <button 
                class="toggle-password" 
                @click="showPassword.new = !showPassword.new"
                type="button"
              >
                <i :class="showPassword.new ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="passwordData.new" class="password-strength">
              <div class="strength-bar">
                <div 
                  class="strength-indicator" 
                  :style="{ width: passwordStrength.percent + '%' }"
                  :class="passwordStrength.class"
                ></div>
              </div>
              <span :class="'text-' + passwordStrength.class">{{ passwordStrength.text }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label>Confirm Password</label>
            <div class="password-input">
              <input 
                :type="showPassword.confirm ? 'text' : 'password'" 
                v-model="passwordData.confirm" 
                placeholder="Confirm new password"
              />
              <button 
                class="toggle-password" 
                @click="showPassword.confirm = !showPassword.confirm"
                type="button"
              >
                <i :class="showPassword.confirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div 
              v-if="passwordData.new && passwordData.confirm" 
              class="password-match"
              :class="{ 'match': passwordsMatch, 'no-match': !passwordsMatch }"
            >
              <i :class="passwordsMatch ? 'fas fa-check' : 'fas fa-times'"></i>
              <span>{{ passwordsMatch ? 'Passwords match' : 'Passwords do not match' }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <button 
              class="save-btn" 
              @click="changePassword"
              :disabled="!canChangePassword"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Settings Tab -->
    <div v-else-if="activeTab === 'settings'" class="settings-section">
      <div class="profile-card">
        <div class="profile-header">
          <h2>Account Settings</h2>
        </div>
        
        <div class="settings-content">
          <div class="setting-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>Email Notifications</h3>
                <p>Receive email notifications for important updates and alerts</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" v-model="settings.emailNotifications">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>System Alerts</h3>
                <p>Receive in-app notifications for system updates and alerts</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" v-model="settings.systemAlerts">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <h3>Dark Mode</h3>
                <p>Switch between light and dark interface themes</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" v-model="settings.darkMode" @change="toggleDarkMode">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="setting-actions">
            <button class="save-btn" @click="saveSettings">Save Settings</button>
          </div>
        </div>
      </div>
      
      <div class="profile-card">
        <div class="profile-header">
          <h2>Security Settings</h2>
        </div>
        
        <div class="settings-content">
          <div class="setting-group">
            <div class="setting-item">
              <div class="setting-info">
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security to your account</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input type="checkbox" v-model="settings.twoFactor" @change="toggleTwoFactor">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
            
            <div class="recent-activity">
              <h3>Recent Login Activity</h3>
              <div class="activity-list">
                <div v-for="(activity, index) in loginActivity" :key="index" class="activity-item">
                  <div class="activity-icon" :class="{ 'success': activity.successful }">
                    <i :class="activity.successful ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
                  </div>
                  <div class="activity-details">
                    <div class="activity-info">
                      <span class="activity-device">{{ activity.device }}</span>
                      <span class="activity-location">{{ activity.location }}</span>
                    </div>
                    <div class="activity-meta">
                      <span class="activity-time">{{ activity.time }}</span>
                      <span 
                        class="activity-status" 
                        :class="{ 'success': activity.successful, 'failure': !activity.successful }"
                      >
                        {{ activity.successful ? 'Successful' : 'Failed' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeacherProfile',
  
  data() {
    return {
      activeTab: 'profile',
      editMode: false,
      defaultAvatar: '/avatars/default-avatar.png',
      profileData: {
        fullName: 'Sarah Johnson',
        email: 'sarah.johnson@pathfinder.edu',
        avatar: '/avatars/teacher1.jpg',
        subjects: ['Mathematics 101', 'Physics Advanced', 'Chemistry Basics']
      },
      passwordData: {
        current: '',
        new: '',
        confirm: ''
      },
      showPassword: {
        current: false,
        new: false,
        confirm: false
      },
      settings: {
        emailNotifications: true,
        systemAlerts: true,
        darkMode: false,
        twoFactor: false
      },
      loginActivity: [
        {
          device: 'Windows PC - Chrome',
          location: 'New York, United States',
          time: 'Today at 10:45 AM',
          successful: true
        },
        {
          device: 'iPhone - Safari',
          location: 'New York, United States',
          time: 'Yesterday at 6:30 PM',
          successful: true
        },
        {
          device: 'Unknown Device',
          location: 'London, United Kingdom',
          time: '3 days ago at 2:15 AM',
          successful: false
        }
      ]
    }
  },
  
  // Add watch for route query parameters
  watch: {
    '$route.query.tab': {
      immediate: true,
      handler(tab) {
        if (tab && (tab === 'profile' || tab === 'settings')) {
          this.activeTab = tab;
        }
      }
    }
  },
  
  computed: {
    passwordStrength() {
      const password = this.passwordData.new;
      
      if (!password) {
        return { percent: 0, class: 'weak', text: 'No password' };
      }
      
      let strength = 0;
      
      // Length check
      if (password.length >= 8) strength += 25;
      
      // Contains uppercase
      if (/[A-Z]/.test(password)) strength += 25;
      
      // Contains number
      if (/[0-9]/.test(password)) strength += 25;
      
      // Contains special character
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      
      let strengthClass = 'weak';
      let strengthText = 'Weak';
      
      if (strength >= 75) {
        strengthClass = 'strong';
        strengthText = 'Strong';
      } else if (strength >= 50) {
        strengthClass = 'medium';
        strengthText = 'Medium';
      }
      
      return {
        percent: strength,
        class: strengthClass,
        text: strengthText
      };
    },
    
    passwordsMatch() {
      return this.passwordData.new && 
             this.passwordData.confirm && 
             this.passwordData.new === this.passwordData.confirm;
    },
    
    canChangePassword() {
      return this.passwordData.current && 
             this.passwordData.new && 
             this.passwordData.confirm && 
             this.passwordsMatch &&
             this.passwordStrength.percent >= 50;
    }
  },
  
  methods: {
    changeTab(tab) {
      this.activeTab = tab;
      this.$router.push({ 
        path: '/teacher/profile',
        query: { tab }
      });
    },
    
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // In a real app, this would upload the file to a server
      // For this demo, we'll create a local URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileData.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    removeProfilePicture() {
      this.profileData.avatar = null;
    },
    
    saveProfile() {
      // In a real app, this would save to a server
      this.editMode = false;
      this.showSuccessMessage('Profile updated successfully');
    },
    
    changePassword() {
      // In a real app, this would validate the current password and save the new one
      this.passwordData = {
        current: '',
        new: '',
        confirm: ''
      };
      this.showSuccessMessage('Password changed successfully');
    },
    
    saveSettings() {
      // In a real app, this would save to a server
      this.showSuccessMessage('Settings saved successfully');
    },
    
    toggleDarkMode(event) {
      // In a real app, this would apply a dark theme to the entire app
      document.body.classList.toggle('dark-mode', event.target.checked);
    },
    
    toggleTwoFactor(event) {
      if (event.target.checked) {
        // In a real app, this would show a setup process for 2FA
        this.showTwoFactorSetup();
      }
    },
    
    showTwoFactorSetup() {
      // This would show a modal or redirect to a setup page
      alert('Two-factor authentication setup would be shown here');
      // For demo purposes, we'll revert the toggle
      setTimeout(() => {
        this.settings.twoFactor = false;
      }, 300);
    },
    
    showSuccessMessage(message) {
      // In a real app, this would show a toast or notification
      alert(message);
    }
  }
};
</script>

<style scoped>
.teacher-profile {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  position: relative;
}

.page-header h1:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 40px;
  height: 3px;
  background: #C84C1C;
  border-radius: 2px;
}

.profile-tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.tab-btn i {
  font-size: 14px;
}

.tab-btn.active {
  color: #3b7ddd;
  font-weight: 600;
}

.tab-btn.active:after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #3b7ddd;
}

.profile-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  overflow: hidden;
}

.profile-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.edit-btn {
  padding: 8px 16px;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background-color: #e5e7eb;
}

.profile-content {
  padding: 30px;
  display: flex;
  gap: 40px;
}

.profile-picture-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 3px solid #f3f4f6;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.upload-overlay:hover {
  opacity: 1;
}

.upload-overlay i {
  font-size: 24px;
  margin-bottom: 5px;
}

.picture-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.btn-outline {
  padding: 8px 16px;
  background-color: white;
  color: #3b7ddd;
  border: 1px solid #3b7ddd;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background-color: #f0f7ff;
}

.btn-text {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px;
  text-align: center;
}

.btn-text:hover {
  color: #ef4444;
}

.profile-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-group input {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b7ddd;
}

.form-group input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.info-display {
  padding: 10px 0;
  font-size: 16px;
  color: #1f2937;
}

.info-hint {
  font-size: 12px;
  color: #6b7280;
  margin-top: -4px;
}

.assigned-subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.subject-tag {
  padding: 6px 12px;
  background-color: #f3f4f6;
  border-radius: 20px;
  font-size: 14px;
  color: #374151;
}

.save-btn {
  padding: 10px 20px;
  background-color: #3b7ddd;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
  margin-top: 10px;
}

.save-btn:hover {
  background-color: #3366cc;
}

.save-btn:disabled {
  background-color: #a3bce0;
  cursor: not-allowed;
}

.password-section {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px;
}

.password-input {
  position: relative;
  display: flex;
}

.password-input input {
  flex: 1;
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 6px;
  background-color: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
}

.strength-indicator {
  height: 100%;
  transition: width 0.3s;
}

.strength-indicator.weak {
  background-color: #ef4444;
}

.strength-indicator.medium {
  background-color: #f59e0b;
}

.strength-indicator.strong {
  background-color: #10b981;
}

.text-weak {
  color: #ef4444;
  font-size: 12px;
}

.text-medium {
  color: #f59e0b;
  font-size: 12px;
}

.text-strong {
  color: #10b981;
  font-size: 12px;
}

.password-match {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  margin-top: 8px;
}

.password-match.match {
  color: #10b981;
}

.password-match.no-match {
  color: #ef4444;
}

.settings-content {
  padding: 30px;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-info {
  max-width: 70%;
}

.setting-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.setting-info p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.toggle-switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e5e7eb;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #3b7ddd;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.setting-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}

.recent-activity {
  margin-top: 20px;
}

.recent-activity h3 {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 15px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9fafb;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.activity-icon.success {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.activity-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-info {
  display: flex;
  flex-direction: column;
}

.activity-device {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.activity-location {
  font-size: 13px;
  color: #6b7280;
}

.activity-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-time {
  font-size: 12px;
  color: #6b7280;
}

.activity-status {
  font-size: 12px;
  font-weight: 500;
}

.activity-status.success {
  color: #10b981;
}

.activity-status.failure {
  color: #ef4444;
}

@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
    gap: 30px;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .setting-info {
    max-width: 100%;
  }
}
</style>