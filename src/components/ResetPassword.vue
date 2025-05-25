<template>
  <div class="reset-password-container">
    <div class="reset-password-card">
      <div class="reset-password-header">
        <h1>Reset Your Password</h1>
        <p>Enter your new password below</p>
      </div>
      
      <!-- Error message -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <!-- Success message -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      
      <form @submit.prevent="handleResetPassword" v-if="!resetComplete">
        <div class="form-group">
          <label for="password">New Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Enter new password"
            class="form-input"
            :disabled="loading"
          >
          <div class="password-requirements">
            Password must be at least 6 characters
          </div>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required 
            placeholder="Confirm new password"
            class="form-input"
            :disabled="loading"
          >
        </div>
        
        <button type="submit" class="reset-button" :disabled="loading || !isFormValid">
          <span v-if="loading" class="loader"></span>
          <span v-else>Reset Password</span>
        </button>
      </form>
      
      <!-- Reset Complete -->
      <div v-if="resetComplete" class="reset-complete">
        <div class="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2>Password Reset Complete</h2>
        <p>Your password has been successfully reset.</p>
        <button @click="goToSignIn" class="signin-button">
          Sign In
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { authMutations } from '../store/auth'

export default {
  name: 'ResetPassword',
  data() {
    return {
      password: '',
      confirmPassword: '',
      token: '',
      tokenType: '',
      refreshToken: '',
      loading: false,
      errorMessage: '',
      successMessage: '',
      resetComplete: false
    }
  },
  computed: {
    isFormValid() {
      return this.password.length >= 6 && this.password === this.confirmPassword;
    }
  },
  created() {
    // Extract token from URL hash (Supabase format)
    const hash = window.location.hash;
    
    // Check if we have a hash with access_token (Supabase format)
    if (hash && hash.includes('access_token=')) {
      // Parse all parameters from the hash
      const hashParams = new URLSearchParams(hash.substring(1));
      this.token = hashParams.get('access_token');
      
      // Store other useful parameters
      this.tokenType = hashParams.get('token_type');
      this.refreshToken = hashParams.get('refresh_token');
      
      console.log('Supabase token found:', this.token ? 'Yes' : 'No');
    } else {
      // Fallback to query parameter (our custom format)
      const queryParams = new URLSearchParams(window.location.search);
      this.token = queryParams.get('token');
      console.log('Query token found:', this.token ? 'Yes' : 'No');
    }
    
    if (!this.token) {
      this.errorMessage = 'Invalid or missing reset token. Please request a new password reset link.';
    }
  },
  methods: {
    async handleResetPassword() {
      try {
        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';
        
        // Validate form
        if (this.password.length < 6) {
          this.errorMessage = 'Password must be at least 6 characters long';
          return;
        }
        
        if (this.password !== this.confirmPassword) {
          this.errorMessage = 'Passwords do not match';
          return;
        }
        
        if (!this.token) {
          this.errorMessage = 'Invalid or missing reset token';
          return;
        }
        
        // Send reset password request to the backend
        const response = await fetch('http://localhost:5000/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${this.tokenType || 'Bearer'} ${this.token}`
          },
          body: JSON.stringify({
            password: this.password,
            refresh_token: this.refreshToken
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to reset password');
        }
        
        // Show success message
        this.successMessage = data.message || 'Password has been reset successfully';
        this.resetComplete = true;
        
        // Remove token from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
      } catch (error) {
        this.errorMessage = error.message || 'An error occurred while resetting your password';
        console.error('Password reset error:', error);
      } finally {
        this.loading = false;
      }
    },
    
    goToSignIn() {
      // Redirect to home page and open sign in modal
      this.$router.push('/');
      setTimeout(() => {
        authMutations.openSignInModal();
      }, 300);
    }
  }
}
</script>

<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.reset-password-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  animation: fadeIn 0.5s ease-out;
}

.reset-password-header {
  text-align: center;
  margin-bottom: 30px;
}

.reset-password-header h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
  font-family: 'STIX Two Text', serif;
}

.reset-password-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: white;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4a6cf7;
  box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.1);
}

.password-requirements {
  font-size: 12px;
  color: #666;
  margin-top: 6px;
}

.reset-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: #4a6cf7;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.reset-button:hover:not(:disabled) {
  background-color: #3a5ce5;
  transform: translateY(-2px);
}

.reset-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Error and success messages */
.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
}

.success-message {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
}

/* Loading spinner */
.loader {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Reset Complete */
.reset-complete {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  margin: 0 auto 20px;
  width: 70px;
  height: 70px;
  background-color: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
}

.reset-complete h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
  font-family: 'STIX Two Text', serif;
}

.reset-complete p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.signin-button {
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.signin-button:hover {
  background-color: #3a5ce5;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 