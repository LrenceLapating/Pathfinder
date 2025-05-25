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
              <a href="#" class="forgot-password" @click.prevent="openForgotPassword">Forgot Password?</a>
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
            
            <!-- Google Sign-In button container (official Google button) -->
            <div id="google-signin-button" class="google-signin-container"></div>
            
            <!-- Fallback Google button in case the official one doesn't work -->
            <button 
              v-if="!googleScriptLoaded" 
              class="fallback-google-button"
              @click="manualGoogleSignIn"
            >
              Continue with Google
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
import { googleOAuthConfig } from '../config/oauth'

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
      successMessage: '',
      googleAuth: null,
      googleScriptLoaded: false
    }
  },
  computed: {
    isOpen() {
      return authStore.isSignInModalOpen
    }
  },
  watch: {
    // Watch for modal open to ensure Google button is rendered
    isOpen(newVal) {
      if (newVal) {
        this.checkAndRenderGoogleButton();
      }
    }
  },
  mounted() {
    // Add event listener for Google API loaded event
    window.addEventListener('google-api-loaded', this.handleGoogleApiLoaded);
    
    // Add event listener for Google auth response
    window.addEventListener('google-auth-response', this.handleGlobalGoogleCallback);
    
    // Check if Google API is already loaded
    if (this.isOpen) {
      this.checkAndRenderGoogleButton();
    }
  },
  beforeDestroy() {
    // Clean up event listeners
    window.removeEventListener('google-api-loaded', this.handleGoogleApiLoaded);
    window.removeEventListener('google-auth-response', this.handleGlobalGoogleCallback);
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
        
        // Check if email is verified
        if (data.user && data.user.isVerified === false) {
          this.errorMessage = 'Please verify your email before signing in. Check your inbox for the verification link.';
          return;
        }
        
        // Store user data and token
        localStorage.setItem('pathfinder_token', data.token);
        localStorage.setItem('pathfinder_user', JSON.stringify(data.user));
        
        if (this.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        // Show success message
        this.successMessage = 'Login successful! Redirecting...';
        
        // Close modal and redirect after a short delay
        setTimeout(async () => {
          this.closeModal();
          
          // If user doesn't have a role yet, redirect to choose-role
          if (!data.user.role) {
            try {
              await this.$router.push('/choose-role');
            } catch (err) {
              if (err.name !== 'NavigationDuplicated') {
                throw err;
              }
            }
            return;
          }
          
          // Navigate based on role
          const targetRoute = data.user.role === 'student' 
            ? '/student'
            : data.user.role === 'teacher'
              ? '/teacher'
              : '/dashboard';
              
          // Only navigate if we're not already on the target route
          if (this.$route.path !== targetRoute) {
            try {
              await this.$router.push(targetRoute);
            } catch (err) {
              if (err.name !== 'NavigationDuplicated') {
                throw err;
              }
            }
          }
        }, 1500);
        
      } catch (error) {
        this.errorMessage = error.message || 'An error occurred during login';
        console.error('Login error:', error);
      } finally {
        this.loading = false;
      }
    },
    
    loadGoogleAPI() {
      // Prevent loading the script multiple times
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        this.googleScriptLoaded = true;
        this.initializeGoogleAuth();
        return;
      }
      
      // Create script element to load Google Platform Library
      const googleScript = document.createElement('script');
      googleScript.src = 'https://accounts.google.com/gsi/client';
      googleScript.async = true;
      googleScript.defer = true;
      googleScript.onload = () => {
        this.googleScriptLoaded = true;
        this.initializeGoogleAuth();
      };
      googleScript.onerror = () => {
        console.error('Failed to load Google API script');
        const buttonElement = document.getElementById('google-signin-button');
        if (buttonElement) {
          buttonElement.innerHTML = '<p class="google-error">Google Sign-In is currently unavailable</p>';
        }
      };
      document.head.appendChild(googleScript);
    },
    
    initializeGoogleAuth() {
      try {
        // Use the Google Client ID from our configuration
        const googleClientId = googleOAuthConfig.clientId;
        console.log('Initializing Google Auth with client ID:', googleClientId);
        
        // Check if Google API is loaded
        if (window.google && window.google.accounts) {
          // Initialize the Google Identity Services client with more options
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: this.handleGoogleCallback,
            auto_select: false, // Don't auto-select the first account
            cancel_on_tap_outside: true, // Allow closing the prompt by clicking outside
            context: 'signin', // Use signin context for better UX
            ux_mode: 'popup', // Use popup mode for better mobile experience
            itp_support: true // Support for iOS Intelligent Tracking Prevention
          });
          
          // Configure One Tap prompt
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              console.log('One Tap prompt not displayed:', notification.getNotDisplayedReason() || notification.getSkippedReason());
            } else {
              console.log('One Tap prompt displayed');
            }
          });
          
          this.renderGoogleButton();
        } else {
          console.warn('Google API not loaded properly. No sign-in button will be shown.');
          const buttonElement = document.getElementById('google-signin-button');
          if (buttonElement) {
            buttonElement.innerHTML = '<p class="google-error">Google Sign-In is currently unavailable</p>';
          }
        }
      } catch (error) {
        console.error('Error initializing Google Auth:', error);
      }
    },
    
    renderGoogleButton() {
      // Render Google button
      setTimeout(() => {
        const buttonElement = document.getElementById('google-signin-button');
        if (buttonElement && window.google && window.google.accounts) {
          // Clear any existing content
          buttonElement.innerHTML = '';
          
          try {
            // Create a container with proper styling
            buttonElement.style.display = 'flex';
            buttonElement.style.justifyContent = 'center';
            buttonElement.style.width = '100%';
            buttonElement.style.marginBottom = '16px';
            
            // Render the button with proper configuration
            window.google.accounts.id.renderButton(
              buttonElement,
              { 
                type: 'standard', 
                shape: 'rectangular',
                theme: 'outline', 
                size: 'large', 
                text: 'continue_with', 
                width: buttonElement.offsetWidth || 300,
                logo_alignment: 'center'
              }
            );
            
            // Make sure the button is displayed and any parent elements are visible
            setTimeout(() => {
              const iframes = buttonElement.querySelectorAll('iframe');
              iframes.forEach(iframe => {
                iframe.style.display = 'block';
                iframe.style.visibility = 'visible';
                iframe.style.opacity = '1';
                iframe.style.width = '100%';
                iframe.style.height = '40px';
              });
              
              // Add a fallback button if the iframe is not visible
              if (iframes.length === 0 || 
                  (iframes.length > 0 && (iframes[0].offsetHeight === 0 || iframes[0].style.visibility === 'hidden'))) {
                this.addFallbackGoogleButton(buttonElement);
              }
            }, 500);
            
          } catch (error) {
            console.error('Error rendering Google button:', error);
            this.addFallbackGoogleButton(buttonElement);
          }
        } else if (buttonElement) {
          this.addFallbackGoogleButton(buttonElement);
        }
      }, 300); // Increased delay to ensure DOM is ready
    },
    
    addFallbackGoogleButton(container) {
      // Add a custom fallback button if the Google button fails to render
      container.innerHTML = `
        <button class="fallback-google-button" id="manual-google-signin">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" width="18" height="18">
          <span>Continue with Google</span>
        </button>
      `;
      
      // Add click event to the fallback button
      const fallbackButton = document.getElementById('manual-google-signin');
      if (fallbackButton) {
        fallbackButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.manualGoogleSignIn();
        });
      }
    },
    
    async handleGoogleCallback(response) {
      try {
        console.log('Google callback response (raw):', response);
        
        // Check if the response exists
        if (!response) {
          console.error('Empty response received from Google authentication');
          // Try to prompt Google One Tap again
          if (window.google && window.google.accounts) {
            console.log('Attempting to prompt Google sign-in again');
            setTimeout(() => {
            window.google.accounts.id.prompt();
            }, 500);
          }
          throw new Error('Empty response from Google authentication. Please try again.');
        }
        
        // Different versions of Google Sign-In API might return different response structures
        let token;
        
        // Handle different response formats
        if (typeof response === 'string') {
          // If response is directly a JWT token string
          token = response;
          console.log('Response is a direct token string');
        } else if (response.credential) {
          // New Google Identity Services format
          token = response.credential;
          console.log('Using credential from response');
        } else if (response.tokenId) {
          // Legacy Google Sign-In format
          token = response.tokenId;
          console.log('Using tokenId from response');
        } else if (response.token) {
          // Another possible format
          token = response.token;
          console.log('Using token from response');
        } else if (response.id_token) {
          // Another possible format
          token = response.id_token;
          console.log('Using id_token from response');
        } else {
          console.error('Unexpected Google response format:', response);
          
          // Try to extract any usable token from the response
          if (typeof response === 'object') {
            console.log('Response keys:', Object.keys(response));
            
            // Last resort: try to find any property that looks like a token
            for (const key in response) {
              if (typeof response[key] === 'string' && response[key].includes('.')) {
                token = response[key];
                console.log(`Found potential token in property: ${key}`);
                break;
              }
            }
          }
          
          if (!token) {
          throw new Error('Invalid response format from Google authentication');
          }
        }
        
        if (!token) {
          console.error('No valid token found in response');
          throw new Error('No valid authentication token received');
        }
        
        console.log('Token successfully extracted');
        
        try {
        // Decode the ID token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        console.log('Token decoded successfully');
        
        const decodedData = JSON.parse(jsonPayload);
        console.log('Decoded payload:', decodedData);
        
        const { sub, email, given_name, family_name, picture } = decodedData;
        
        // Prepare user data to send to backend
        const googleUser = {
          googleId: sub,
          email: email,
          firstName: given_name || 'Google',
          lastName: family_name || 'User',
          profilePicture: picture || 'https://via.placeholder.com/150'
        };
        
        console.log('Sending data to backend:', googleUser);
        
        // Send Google auth data to backend
        const response = await fetch('http://localhost:5000/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
            body: JSON.stringify(googleUser),
            credentials: 'include' // Include cookies if needed
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Check for specific error messages
            if (data.message && data.message.includes('already registered with a password')) {
              // Show a more helpful error message
              this.errorMessage = 'This email is registered with a password. Please sign in with your email and password below.';
              return;
            }
            
          throw new Error(data.message || 'Google authentication failed');
        }
          
          // Check if this was a login or registration
          const isNewUser = data.message === 'Google registration successful';
        
        // Store user data and token
        localStorage.setItem('pathfinder_token', data.token);
        localStorage.setItem('pathfinder_user', JSON.stringify(data.user));
        
          // Show appropriate success message
          this.successMessage = isNewUser 
            ? 'Account created successfully! Redirecting...' 
            : 'Sign in successful! Redirecting...';
        
        // Close modal and redirect after a short delay
        setTimeout(() => {
          this.closeModal();
          
          // Navigate based on role
          if (data.user.role) {
            if (data.user.role === 'student') {
              this.$router.push('/student');
            } else if (data.user.role === 'teacher') {
              this.$router.push('/teacher/analytics');
            } else {
              this.$router.push('/dashboard');
            }
          } else {
            // If user doesn't have a role yet
            this.$router.push('/choose-role');
          }
        }, 1500);
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
          throw new Error('Unable to process Google authentication response');
        }
        
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
    },
    
    handleGoogleApiLoaded() {
      this.googleScriptLoaded = true;
      if (this.isOpen) {
        this.renderGoogleButton();
      }
    },
    
    handleGlobalGoogleCallback(event) {
      console.log('Global Google callback received in SignIn component');
      
      // Check if this component is open and the event has data
      if (this.isOpen) {
        console.log('SignIn is open, processing global Google callback');
        
        // Check if event has the expected structure
        if (event.detail && event.detail.response) {
          console.log('Event has detail.response, handling Google callback');
          this.handleGoogleCallback(event.detail.response);
          } else {
          console.error('Invalid event structure in global Google callback');
          this.errorMessage = 'Authentication error. Please try again.';
        }
      } else {
        console.log('SignIn is not open, ignoring global Google callback');
      }
    },
    
    checkAndRenderGoogleButton() {
      // Check if Google API is loaded and render the button
      console.log('Checking Google API availability for button rendering');
      
      if (window.google && window.google.accounts) {
        console.log('Google API already loaded, rendering button');
        this.googleScriptLoaded = true;
        this.renderGoogleButton();
      } else {
        console.log('Google API not loaded yet, loading script');
        this.loadGoogleAPI();
      }
    },
    
    manualGoogleSignIn() {
      // Manually trigger Google sign-in
      try {
        if (window.google && window.google.accounts) {
          console.log('Manually triggering Google sign-in prompt');
          window.google.accounts.id.prompt();
        } else {
          console.error('Google API not available for manual sign-in');
          this.errorMessage = 'Google Sign-In is not available. Please try again later or use email/password.';
        }
      } catch (error) {
        console.error('Error triggering manual Google sign-in:', error);
        this.errorMessage = 'Failed to start Google authentication. Please try again.';
      }
    },
    
    openForgotPassword() {
      // First start exit animation
      document.querySelector('.signin-card').classList.add('animate-slide-out');
      
      // Then switch forms after animation completes
      setTimeout(() => {
        authMutations.openForgotPasswordModal()
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
  margin: var(--dl-layout-space-unit) 0;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.separator span {
  padding: 0 var(--dl-layout-space-unit);
  color: var(--dl-color-theme-neutral-dark);
  opacity: 0.6;
  font-size: 14px;
}

.google-signin-container {
  width: 100%;
  min-height: 40px;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

/* Override any default Google button styles */
.google-signin-container iframe {
  position: static !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.google-error {
  color: #d32f2f;
  text-align: center;
  font-size: 14px;
  margin: 8px 0;
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

.google-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.fallback-google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 16px;
  background-color: white;
  color: #757575;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  gap: 8px;
  height: 40px;
}

.fallback-google-button:hover {
  background-color: #f5f5f5;
}

.fallback-google-button img {
  margin-right: 8px;
}
</style> 