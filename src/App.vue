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
      console.log('Attempting to load Google API script');
      
      // Prevent loading the script multiple times
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        console.log('Google API script tag already exists in document');
        // Script tag exists, check if API is actually loaded
        if (window.google && window.google.accounts) {
          console.log('Google API already loaded, initializing');
          this.initializeGoogleAPI();
        } else {
          console.log('Google API script exists but not loaded yet, waiting');
          // Script exists but API not loaded yet, wait for it
          const checkInterval = setInterval(() => {
            if (window.google && window.google.accounts) {
              console.log('Google API loaded after interval check');
              clearInterval(checkInterval);
              this.initializeGoogleAPI();
            }
          }, 100);
        }
        return;
      }
      
      // Create script element to load Google Platform Library
      console.log('Creating new Google API script tag');
      const googleScript = document.createElement('script');
      googleScript.src = 'https://accounts.google.com/gsi/client';
      googleScript.async = true;
      googleScript.defer = true;
      googleScript.onload = () => {
        console.log('Google API script loaded via onload event');
        // Wait a moment to ensure Google API is fully initialized
        setTimeout(() => {
          if (window.google && window.google.accounts) {
            console.log('Google API object available after script load');
            this.initializeGoogleAPI();
          } else {
            console.warn('Google API object not available after script load');
          }
        }, 500); // Increased timeout to ensure API is fully loaded
      };
      googleScript.onerror = (error) => {
        console.error('Failed to load Google API script:', error);
      };
      document.head.appendChild(googleScript);
    },
    
    initializeGoogleAPI() {
      if (window.google && window.google.accounts) {
        this.googleScriptLoaded = true;
        
        // Log the client ID being used
        console.log('App level: Initializing Google API with client ID:', googleOAuthConfig.clientId);
        
        // Initialize Google API with our client ID and improved configuration
        window.google.accounts.id.initialize({
          client_id: googleOAuthConfig.clientId,
          callback: this.handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'popup',
          itp_support: true
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
      console.log('Google auth callback received at App level. Response type:', typeof response);
      
      // Log response details for debugging
      if (typeof response === 'object') {
        console.log('Response keys:', Object.keys(response));
        if (response.credential) {
          console.log('Credential exists in response');
        } else {
          console.log('No credential in response');
        }
      } else if (typeof response === 'string') {
        console.log('Response is a string (likely a token)');
      } else {
        console.log('Response is type:', typeof response);
      }
      
      // Make sure we have a valid response before dispatching the event
      if (!response) {
        console.error('Empty response in App-level Google callback');
        // Try to prompt Google One Tap again
        try {
          if (window.google && window.google.accounts) {
            console.log('Attempting to prompt Google sign-in again');
            window.google.accounts.id.prompt();
          }
        } catch (err) {
          console.error('Error prompting Google sign-in:', err);
        }
        return;
      }
      
      // Dispatch an event with the response for auth components to handle
      try {
        console.log('Dispatching google-auth-response event');
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