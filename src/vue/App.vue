<template>
  <div>
    <router-view/>
    <SignIn />
    <SignUp />
  </div>
</template>

<script>
import SignIn from '../components/SignIn.vue'
import SignUp from '../components/SignUp.vue'
import { googleOAuthConfig } from '../../config/oauth/google.js'

export default {
  name: 'App',
  components: {
    SignIn,
    SignUp
  },
  data() {
    return {
      googleScriptLoaded: false,
      googleInitRetries: 0,
      maxRetries: 3
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
        }, 300); // Increased timeout to ensure API is fully loaded
      };
      googleScript.onerror = (error) => {
        console.error('Failed to load Google API script:', error);
        // Try to reload the script after a delay
        if (this.googleInitRetries < this.maxRetries) {
          this.googleInitRetries++;
          setTimeout(() => {
            console.log(`Retrying Google API load (${this.googleInitRetries}/${this.maxRetries})...`);
            this.loadGoogleAPI();
          }, 1000);
        }
      };
      document.head.appendChild(googleScript);
    },
    
    initializeGoogleAPI() {
      if (window.google && window.google.accounts) {
        try {
          this.googleScriptLoaded = true;
          
          // Initialize Google API with our client ID and more options
          window.google.accounts.id.initialize({
            client_id: googleOAuthConfig.clientId,
            callback: this.handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
            prompt_parent_id: 'g_id_onload', // Specify container for the One Tap prompt
            context: 'use', // General context
            ux_mode: 'popup', // Use popup mode for better mobile experience
            itp_support: true // Support for iOS Intelligent Tracking Prevention
          });
          
          // Add a hidden div for One Tap prompt if it doesn't exist
          if (!document.getElementById('g_id_onload')) {
            const oneTapContainer = document.createElement('div');
            oneTapContainer.id = 'g_id_onload';
            oneTapContainer.style.position = 'fixed';
            oneTapContainer.style.top = '0';
            oneTapContainer.style.right = '0';
            oneTapContainer.style.width = '0';
            oneTapContainer.style.height = '0';
            oneTapContainer.style.visibility = 'hidden';
            document.body.appendChild(oneTapContainer);
          }
          
          // Dispatch an event to notify components that Google API is ready
          window.dispatchEvent(new CustomEvent('google-api-loaded'));
          console.log('Google API initialized successfully');
        } catch (error) {
          console.error('Error initializing Google API:', error);
          // Try to reinitialize after a delay
          if (this.googleInitRetries < this.maxRetries) {
            this.googleInitRetries++;
            setTimeout(() => {
              console.log(`Retrying Google API initialization (${this.googleInitRetries}/${this.maxRetries})...`);
              this.initializeGoogleAPI();
            }, 1000);
          }
        }
      } else {
        console.warn('Google API not available yet');
        // Try to reload the script after a delay
        if (this.googleInitRetries < this.maxRetries) {
          this.googleInitRetries++;
          setTimeout(() => {
            console.log(`Waiting for Google API (${this.googleInitRetries}/${this.maxRetries})...`);
            this.loadGoogleAPI();
          }, 1000);
        }
      }
    },
    
    handleGoogleCallback(response) {
      // This is a fallback handler - the actual handling will be done in the auth components
      console.log('Google auth callback received at App level');
      
      if (!response) {
        console.error('Empty response in App-level Google callback');
        return;
      }
      
      // Dispatch an event with the response for auth components to handle
      try {
        window.dispatchEvent(new CustomEvent('google-auth-response', { 
          detail: { response }
        }));
      } catch (err) {
        console.error('Error dispatching Google auth response event:', err);
      }
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