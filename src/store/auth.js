import Vue from 'vue'

export const authStore = Vue.observable({
  isSignInModalOpen: false,
  isSignUpModalOpen: false,
  isForgotPasswordModalOpen: false,
})

export const authMutations = {
  openSignInModal() {
    authStore.isSignInModalOpen = true
    authStore.isSignUpModalOpen = false
    authStore.isForgotPasswordModalOpen = false
  },
  openSignUpModal() {
    authStore.isSignUpModalOpen = true
    authStore.isSignInModalOpen = false
    authStore.isForgotPasswordModalOpen = false
  },
  openForgotPasswordModal() {
    authStore.isForgotPasswordModalOpen = true
    authStore.isSignInModalOpen = false
    authStore.isSignUpModalOpen = false
  },
  closeAuthModals() {
    authStore.isSignInModalOpen = false
    authStore.isSignUpModalOpen = false
    authStore.isForgotPasswordModalOpen = false
  }
} 