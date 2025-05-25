<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="forgot-password-container" @click.stop>
      <div class="forgot-password-card animate-slide-up">
        <button class="close-button" @click="closeModal">✕</button>
        
        <div class="forgot-password-form-section">
          <div class="forgot-password-header">
            <h2>Reset Your Password</h2>
            <p>Enter your email to receive password reset instructions</p>
          </div>
          
          <!-- Error message -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
          <!-- Success message -->
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>
          
          <form @submit.prevent="handleForgotPassword" v-if="!resetEmailSent">
            <div class="form-group">
              <input 
                type="email" 
                id="email" 
                v-model="email" 
                required 
                placeholder="Email"
                class="form-input"
                :disabled="loading"
              >
            </div>
            
            <button type="submit" class="submit-button" :disabled="loading">
              <span v-if="loading" class="loader"></span>
              <span v-else>
                Send Reset Link
                <span class="btn-arrow">→</span>
              </span>
            </button>
            
            <div class="back-to-signin">
              <a href="#" @click.prevent="switchToSignIn">Back to Sign In</a>
            </div>
          </form>
          
          <!-- Email Sent Confirmation -->
          <div v-if="resetEmailSent" class="reset-email-sent">
            <div class="sent-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3>Check Your Email</h3>
            <p>We've sent password reset instructions to <strong>{{ email }}</strong></p>
            <p>Please check your inbox and follow the link to reset your password.</p>
            
            <div class="reset-actions">
              <button @click="switchToSignIn" class="back-button">
                Back to Sign In
              </button>
              
              <div class="resend-section">
                <button 
                  @click="handleForgotPassword" 
                  class="resend-button" 
                  :disabled="resendCooldown > 0"
                >
                  {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authStore, authMutations } from '../store/auth'

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      loading: false,
      errorMessage: '',
      successMessage: '',
      resetEmailSent: false,
      resendCooldown: 0,
      countdownIntervalId: null
    }
  },
  computed: {
    isOpen() {
      return authStore.isForgotPasswordModalOpen
    }
  },
  beforeDestroy() {
    // Clear the countdown interval if it exists
    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId);
    }
  },
  methods: {
    async handleForgotPassword() {
      try {
        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';
        
        // Validate form
        if (!this.email) {
          this.errorMessage = 'Email is required';
          return;
        }
        
        // Send forgot password request to the backend
        const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to send password reset email');
        }
        
        // Show success message
        this.successMessage = data.message || 'Password reset instructions sent to your email';
        this.resetEmailSent = true;
        
        // Start the resend cooldown timer
        this.startResendCooldown();
        
      } catch (error) {
        this.errorMessage = error.message || 'An error occurred while processing your request';
        console.error('Forgot password error:', error);
      } finally {
        this.loading = false;
      }
    },
    
    startResendCooldown() {
      this.resendCooldown = 60; // Set to 60 seconds
      
      // Create interval to count down
      const countdownInterval = setInterval(() => {
        this.resendCooldown--;
        
        if (this.resendCooldown <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
      
      // Store the interval ID so we can clear it if needed
      this.countdownIntervalId = countdownInterval;
    },
    
    closeModal() {
      authMutations.closeAuthModals();
    },
    
    switchToSignIn() {
      // First start exit animation
      document.querySelector('.forgot-password-card').classList.add('animate-slide-out');
      
      // Then switch forms after animation completes
      setTimeout(() => {
        authMutations.openSignInModal();
      }, 300);
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.forgot-password-container {
  width: 100%;
  max-width: 500px;
  margin: 20px;
  position: relative;
}

.forgot-password-card {
  width: 100%;
  background-color: var(--dl-color-theme-neutral-light);
  border-radius: var(--dl-layout-radius-cardradius);
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.forgot-password-form-section {
  padding: var(--dl-layout-space-threeunits);
  display: flex;
  flex-direction: column;
  gap: var(--dl-layout-space-oneandhalfunits);
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: 2px solid white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.close-button:hover {
  background-color: var(--dl-color-theme-primary1);
  transform: scale(1.1);
}

.forgot-password-header {
  text-align: center;
  margin-bottom: 20px;
}

.forgot-password-header h2 {
  color: var(--dl-color-theme-neutral-dark);
  font-size: 28px;
  font-family: STIX Two Text;
  font-weight: 600;
  margin: 0;
  margin-bottom: var(--dl-layout-space-halfunit);
}

.forgot-password-header p {
  color: var(--dl-color-theme-neutral-dark);
  font-size: 16px;
  font-family: Noto Sans;
  opacity: 0.8;
  margin: 0;
}

.form-group {
  gap: var(--dl-layout-space-halfunit);
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin-bottom: 20px;
}

.form-input {
  color: var(--dl-color-theme-neutral-dark);
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  font-family: Noto Sans;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: white;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--dl-color-theme-primary1);
  box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.1);
}

.submit-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: var(--dl-color-theme-primary1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button:hover {
  background-color: var(--dl-color-theme-primary2);
  transform: translateY(-2px);
}

.btn-arrow {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.submit-button:hover .btn-arrow {
  transform: translateX(5px);
}

.back-to-signin {
  text-align: center;
  margin-top: var(--dl-layout-space-unit);
}

.back-to-signin a {
  color: var(--dl-color-theme-primary1);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.back-to-signin a:hover {
  color: var(--dl-color-theme-primary2);
}

/* Animation Classes */
.animate-slide-up {
  animation: slideUp 0.6s ease-out forwards;
}

.animate-slide-out {
  animation: slideOut 0.3s ease-in forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-50px);
    opacity: 0;
  }
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

/* Disabled button styles */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Email Sent Confirmation */
.reset-email-sent {
  text-align: center;
  padding: 20px 0;
}

.sent-icon {
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

.reset-email-sent h3 {
  font-size: 22px;
  color: #333;
  margin-bottom: 15px;
  font-family: 'STIX Two Text', serif;
}

.reset-email-sent p {
  color: #666;
  margin-bottom: 10px;
  line-height: 1.5;
  font-size: 14px;
}

.reset-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.back-button {
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.back-button:hover {
  background-color: #3a5ce5;
  transform: translateY(-2px);
}

.resend-section {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.resend-button {
  background-color: transparent;
  color: #4a6cf7;
  border: 1px solid #4a6cf7;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.resend-button:hover:not(:disabled) {
  background-color: rgba(74, 108, 247, 0.1);
}

.resend-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  border-color: #ccc;
  color: #888;
}
</style> 