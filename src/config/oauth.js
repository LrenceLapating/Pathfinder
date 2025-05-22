/**
 * OAuth Configuration
 * 
 * This file contains configuration settings for OAuth providers.
 * To get a Google Client ID, follow these steps:
 * 
 * 1. Go to the Google Cloud Console (https://console.cloud.google.com/)
 * 2. Create a new project or select an existing one
 * 3. Go to "APIs & Services" > "Credentials"
 * 4. Click "Create Credentials" > "OAuth client ID"
 * 5. Configure the consent screen if prompted
 * 6. Select "Web application" as the application type
 * 7. Add your domain to the "Authorized JavaScript origins" (e.g., http://localhost:8080 for development)
 * 8. Add your redirect URI to the "Authorized redirect URIs" (e.g., http://localhost:8080/auth/google/callback)
 * 9. Click "Create" and copy the Client ID
 */

// OAuth Configuration
export const oauthConfig = {
  // Replace with your actual Google Client ID
  googleClientId: process.env.VUE_APP_GOOGLE_CLIENT_ID || '123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
  
  // Add other OAuth providers here if needed
};

// Export individual provider settings for convenience
export const googleOAuthConfig = {
  clientId: oauthConfig.googleClientId
};

export default oauthConfig; 