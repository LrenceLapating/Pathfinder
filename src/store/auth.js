import Vue from 'vue'

export const authStore = Vue.observable({
  isSignInModalOpen: false,
  isSignUpModalOpen: false,
})

export const authMutations = {
  openSignInModal() {
    authStore.isSignInModalOpen = true
    authStore.isSignUpModalOpen = false
  },
  openSignUpModal() {
    authStore.isSignUpModalOpen = true
    authStore.isSignInModalOpen = false
  },
  closeAuthModals() {
    authStore.isSignInModalOpen = false
    authStore.isSignUpModalOpen = false
  }
} 