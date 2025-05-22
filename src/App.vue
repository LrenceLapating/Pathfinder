<template>
  <div>
    <router-view/>
    <SignIn />
    <SignUp />
  </div>
</template>

<script>
import SignIn from './components/SignIn.vue'
import SignUp from './components/SignUp.vue'
import { googleOAuthConfig } from './config/oauth'

export default {
  name: 'App',
  components: {
    SignIn,
    SignUp
  },
  data() {
    return {
      googleScriptLoaded: false
    }
  },
  created() {
    // Load Google API script at application start
    this.loadGoogleAPI();
  },
  mounted() {
    // Check if Google API is already loaded but not initialized
    if (window.google && window.google.accounts && !this.googleScriptLoaded) {
      this.initializeGoogleAPI();
    }
  },
  methods: {
    loadGoogleAPI() {
      // Prevent loading the script multiple times
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        // Script tag exists, check if API is actually loaded
        if (window.google && window.google.accounts) {
          this.initializeGoogleAPI();
        } else {
          // Script exists but API not loaded yet, wait for it
          const checkInterval = setInterval(() => {
            if (window.google && window.google.accounts) {
              clearInterval(checkInterval);
              this.initializeGoogleAPI();
            }
          }, 100);
        }
        return;
      }
      
      // Create script element to load Google Platform Library
      const googleScript = document.createElement('script');
      googleScript.src = 'https://accounts.google.com/gsi/client';
      googleScript.async = true;
      googleScript.defer = true;
      googleScript.onload = () => {
        // Wait a moment to ensure Google API is fully initialized
        setTimeout(() => {
          this.initializeGoogleAPI();
        }, 100);
      };
      googleScript.onerror = (error) => {
        console.error('Failed to load Google API script:', error);
      };
      document.head.appendChild(googleScript);
    },
    
    initializeGoogleAPI() {
      if (window.google && window.google.accounts) {
        this.googleScriptLoaded = true;
        
        // Initialize Google API with our client ID
        window.google.accounts.id.initialize({
          client_id: googleOAuthConfig.clientId,
          callback: this.handleGoogleCallback
        });
        
        // Dispatch an event to notify components that Google API is ready
        window.dispatchEvent(new CustomEvent('google-api-loaded'));
        console.log('Google API initialized successfully');
      } else {
        console.warn('Google API not available yet');
      }
    },
    
    handleGoogleCallback(response) {
      // This is a fallback handler - the actual handling will be done in the auth components
      console.log('Google auth callback received at App level');
      // Dispatch an event with the response for auth components to handle
      window.dispatchEvent(new CustomEvent('google-auth-response', { 
        detail: { response }
      }));
    }
  }
}
</script>

<style>
/* Global styles */
:root {
  --dl-color-theme-primary1: #1e40af;
  --dl-color-theme-primary2: #1e3a8a;
  --dl-color-theme-secondary1: #ffffff;
  --dl-color-theme-accent1: #f0f9ff;
  --dl-color-theme-accent2: #e0f2fe;
  --dl-color-theme-neutral-dark: #1f2937;
  --dl-color-theme-neutral-light: #ffffff;
  
  --dl-layout-space-halfunit: 8px;
  --dl-layout-space-unit: 16px;
  --dl-layout-space-oneandhalfunits: 24px;
  --dl-layout-space-twounits: 32px;
  --dl-layout-space-threeunits: 48px;
  
  --dl-layout-radius-small: 4px;
  --dl-layout-radius-medium: 8px;
  --dl-layout-radius-large: 16px;
  --dl-layout-radius-cardradius: 12px;
}

body, html {
  margin: 0;
  padding: 0;
  font-family: 'Noto Sans', sans-serif;
}
</style>