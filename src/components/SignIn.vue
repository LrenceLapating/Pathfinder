<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="signin-container" @click.stop>
      <div class="signin-card animate-slide-up">
        <button class="close-button" @click="closeModal">✕</button>
        
        <div class="signin-form-section">
          <div class="signin-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue your learning journey</p>
          </div>
          
          <!-- Error message -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
          <!-- Success message -->
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>
          
          <form @submit.prevent="handleSignIn">
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
            
            <div class="form-group">
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                required 
                placeholder="Password"
                class="form-input"
                :disabled="loading"
              >
            </div>
            
            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="rememberMe" :disabled="loading">
                <span>Remember me</span>
              </label>
              <a href="#" class="forgot-password">Forgot Password?</a>
            </div>
            
            <button type="submit" class="signin-button" :disabled="loading">
              <span v-if="loading" class="loader"></span>
              <span v-else>
                Sign In
                <span class="btn-arrow">→</span>
              </span>
            </button>
            
            <div class="separator">
              <span>or</span>
            </div>
            
            <button type="button" @click="signInWithGoogle" class="google-button" :disabled="loading">
              <span v-if="loading" class="loader"></span>
              <span v-else>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" class="google-icon">
                Continue with Google
              </span>
            </button>
            
            <div class="signup-link">
              Don't have an account? <a href="#" @click.prevent="switchToSignUp">Sign Up</a>
            </div>
          </form>
        </div>
        
        <div class="signin-promo-section">
          <div class="graphic-elements">
            <div class="floating-circle circle-1"></div>
            <div class="floating-circle circle-2"></div>
            <div class="floating-circle circle-3"></div>
          </div>
          <div class="img-container animate-fade-in">
            <img :src="logo" alt="Pathfinder" class="promo-image">
          </div>
          <h3 class="promo-heading animate-slide-right">Start Your Learning Journey</h3>
          <p class="promo-text animate-slide-right">Join thousands of students achieving their academic goals with personalized learning paths and expert guidance.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authStore, authMutations } from '../store/auth'
import pathfinderLogo from '../assets/images/sign in.png'

export default {
  name: 'SignIn',
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      logo: pathfinderLogo,
      loading: false,
      errorMessage: '',
      successMessage: ''
    }
  },
  computed: {
    isOpen() {
      return authStore.isSignInModalOpen
    }
  },
  methods: {
    async handleSignIn() {
      try {
        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';
        
        // Validate form
        if (!this.email || !this.password) {
          this.errorMessage = 'Email and password are required';
          return;
        }
        
        // Send login request to the backend
        const response = await fetch('http://localhost:5000/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        
        // Store user data and token
        localStorage.setItem('pathfinder_token', data.token);
        localStorage.setItem('pathfinder_user', JSON.stringify(data.user));
        
        if (this.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        if (data.user.role) {
          // Store user role
          localStorage.setItem('pathfinder_user_role', data.user.role);
          
          // Show success message
          this.successMessage = 'Login successful! Redirecting...';
          
          // Close modal and redirect after a short delay
          setTimeout(() => {
            this.closeModal();
            // Navigate based on role
            if (data.user.role === 'student') {
              this.$router.push('/student');
            } else if (data.user.role === 'teacher') {
              this.$router.push('/teacher-dashboard');
            } else {
              this.$router.push('/dashboard');
            }
          }, 1500);
        } else {
          // If user doesn't have a role yet
          this.successMessage = 'Login successful! Redirecting to complete your profile...';
          
          setTimeout(() => {
            this.closeModal();
            this.$router.push('/choose-role');
          }, 1500);
        }
        
      } catch (error) {
        this.errorMessage = error.message || 'An error occurred during login';
        console.error('Login error:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async signInWithGoogle() {
      try {
        this.loading = true;
        this.errorMessage = '';
        
        // In a real implementation, you would use the Google OAuth API
        // For this example, we'll simulate a successful Google login
        
        // This is where you would typically handle the Google OAuth flow
        // For example, using Google's JavaScript SDK:
        // gapi.auth2.getAuthInstance().signIn()
        
        // For demonstration, we'll simulate a Google login response
        const googleUser = {
          googleId: 'google-' + Math.random().toString(36).substring(2, 15),
          email: `user${Math.floor(Math.random() * 10000)}@gmail.com`,
          firstName: 'Google',
          lastName: 'User',
          profilePicture: 'https://via.placeholder.com/150'
        };
        
        // Send Google auth data to backend
        const response = await fetch('http://localhost:5000/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(googleUser)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Google authentication failed');
        }
        
        // Store user data and token
        localStorage.setItem('pathfinder_token', data.token);
        localStorage.setItem('pathfinder_user', JSON.stringify(data.user));
        
        // Show success message
        this.successMessage = 'Google authentication successful! Redirecting...';
        
        // Close modal and redirect after a short delay
        setTimeout(() => {
          this.closeModal();
          // Redirect to dashboard or home page
          window.location.href = '/dashboard';
        }, 1500);
        
      } catch (error) {
        this.errorMessage = error.message || 'An error occurred during Google authentication';
        console.error('Google auth error:', error);
      } finally {
        this.loading = false;
      }
    },
    
    closeModal() {
      authMutations.closeAuthModals()
    },
    
    switchToSignUp() {
      // First start exit animation
      document.querySelector('.signin-card').classList.add('animate-slide-out');
      
      // Then switch forms after animation completes
      setTimeout(() => {
        authMutations.openSignUpModal()
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

.signin-container {
  width: 100%;
  max-width: 1000px;
  margin: 20px;
  position: relative;
}

.signin-card {
  width: 100%;
  display: flex;
  background-color: var(--dl-color-theme-neutral-light);
  border-radius: var(--dl-layout-radius-cardradius);
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.signin-form-section {
  flex: 1;
  padding: var(--dl-layout-space-threeunits);
  display: flex;
  flex-direction: column;
  gap: var(--dl-layout-space-oneandhalfunits);
}

.signin-promo-section {
  flex: 1;
  background-color: var(--dl-color-theme-accent1);
  padding: var(--dl-layout-space-threeunits);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #000000;
  position: relative;
  overflow: hidden;
}

.signin-promo-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('../assets/images/sign in.png');
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  opacity: 0.3;
  z-index: 0;
}

.signin-promo-section > * {
  position: relative;
  z-index: 1;
}

.promo-image {
  width: 100%;
  max-width: 400px;
  height: 280px;
  object-fit: cover;
  object-position: center;
  margin-bottom: var(--dl-layout-space-twounits);
  border-radius: 12px;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.promo-image:hover {
  transform: scale(1.02);
}

.promo-heading {
  font-family: STIX Two Text;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: var(--dl-layout-space-unit);
  color: #000000;
  text-shadow: 0px 1px 3px rgba(255, 255, 255, 0.7);
}

.promo-text {
  font-family: Noto Sans;
  font-size: 16px;
  line-height: 1.5;
  opacity: 1;
  color: #000000;
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.5);
  font-weight: 500;
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

.signin-header {
  text-align: left;
}

.signin-header h2 {
  color: var(--dl-color-theme-neutral-dark);
  font-size: 32px;
  font-family: STIX Two Text;
  font-weight: 600;
  margin: 0;
  margin-bottom: var(--dl-layout-space-halfunit);
}

.signin-header p {
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
  box-shadow: 0 0 0 2px rgba(var(--dl-color-theme-primary1-rgb), 0.1);
}

.form-options {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: var(--dl-layout-space-unit) 0;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: var(--dl-layout-space-halfunit);
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--dl-color-theme-primary1);
}

.remember-me span {
  color: var(--dl-color-theme-neutral-dark);
  font-size: 16px;
  font-family: Noto Sans;
  line-height: 1.5;
}

.forgot-password {
  color: var(--dl-color-theme-primary1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--dl-color-theme-primary2);
}

.signin-button {
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
}

.signin-button:hover {
  background-color: var(--dl-color-theme-primary2);
  transform: translateY(-2px);
}

.signin-button span {
  color: var(--dl-color-theme-secondary1);
  font-size: 16px;
  font-family: Noto Sans;
  font-weight: 600;
  line-height: 1.5;
  text-transform: uppercase;
  text-decoration: none;
}

.signup-link {
  text-align: center;
  margin-top: var(--dl-layout-space-unit);
}

.signup-link a {
  color: var(--dl-color-theme-primary1);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.signup-link a:hover {
  color: var(--dl-color-theme-primary2);
}

@media (max-width: 768px) {
  .signin-card {
    flex-direction: column;
  }
  
  .signin-promo-section {
    display: none;
  }
  
  .signin-form-section {
    padding: var(--dl-layout-space-oneandhalfunits);
  }
}

/* Animation Classes */
.animate-slide-up {
  animation: slideUp 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-right {
  animation: slideRight 0.6s ease-out forwards;
  animation-delay: 0.3s;
  opacity: 0;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideRight {
  from {
    transform: translateX(-30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes float {
  0% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-15px) translateX(10px);
  }
  100% {
    transform: translateY(0px) translateX(0px);
  }
}

/* Decorative Elements */
.graphic-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.5;
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff9966, #ff5e62);
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}

.circle-2 {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6edcc4, #1aab8b);
  bottom: 20%;
  right: 15%;
  animation-delay: 1s;
}

.circle-3 {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #c471ed, #f7797d);
  top: 50%;
  right: 30%;
  animation-delay: 2s;
}

.img-container {
  position: relative;
  z-index: 2;
}

.signin-button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.btn-arrow {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.signin-button:hover .btn-arrow {
  transform: translateX(5px);
}

/* Add scale up animation to the image on hover */
.promo-image {
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.promo-image:hover {
  transform: scale(1.05);
}

/* Exit Animation */
.animate-slide-out {
  animation: slideOut 0.3s ease-in forwards;
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

/* Google button and separator styles */
.separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  color: var(--dl-color-theme-neutral-dark);
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.separator span {
  padding: 0 10px;
  font-size: 14px;
  color: var(--dl-color-theme-neutral-dark);
}

.google-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  color: var(--dl-color-theme-neutral-dark);
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.google-button:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.google-icon {
  width: 18px;
  height: 18px;
}

/* Error and success messages */
.error-message {
  background-color: rgba(255, 87, 87, 0.1);
  color: #ff5757;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
  border-left: 4px solid #ff5757;
}

.success-message {
  background-color: rgba(75, 181, 67, 0.1);
  color: #4bb543;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
  border-left: 4px solid #4bb543;
}

/* Loading spinner */
.loader {
  width: 18px;
  height: 18px;
  border: 2px solid #ffffff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Disabled button styles */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 