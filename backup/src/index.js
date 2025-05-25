/**
 * PathFinder Application Entry Point
 * 
 * This file determines whether to run the Vue or React version of the application
 * based on the FRAMEWORK environment variable.
 */

// Check which framework to use
const framework = process.env.FRAMEWORK || 'vue';

if (framework.toLowerCase() === 'react') {
  // Load React version
  require('./react/index.tsx');
} else {
  // Default to Vue version
  require('./vue/main.js');
} 