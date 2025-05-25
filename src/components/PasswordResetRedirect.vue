<template>
  <div class="redirect-container">
    <div class="redirect-card">
      <div class="spinner"></div>
      <h2>Redirecting...</h2>
      <p>Please wait while we redirect you to the password reset page.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordResetRedirect',
  mounted() {
    // Get the full URL hash with all parameters
    const hash = window.location.hash;
    
    // Construct the new URL with port 5001
    const newUrl = `http://localhost:5001/reset-password${hash}`;
    
    console.log('Redirecting to:', newUrl);
    
    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = newUrl;
    }, 1500);
  }
}
</script>

<style scoped>
.redirect-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.redirect-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  text-align: center;
}

h2 {
  margin-top: 20px;
  color: #333;
  font-family: 'STIX Two Text', serif;
}

p {
  color: #666;
  margin-top: 10px;
}

.spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 5px solid rgba(74, 108, 247, 0.2);
  border-radius: 50%;
  border-top-color: #4a6cf7;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 