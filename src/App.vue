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

export default {
  name: 'App',
  components: {
    SignIn,
    SignUp
  }
}
</script>