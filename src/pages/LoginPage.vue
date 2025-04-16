<script setup>
import router from '@/router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { ref } from 'vue'
import useAuth from '../../composable/useAuth'

const { isAuthenticated } = useAuth()

const email = ref('')
const password = ref('')

function login() {
  const auth = getAuth()
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user
      alert('Login success')
      router.push('/')
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      alert(`Login failed: ${errorMessage} (${errorCode})`)
    })
}
</script>

<template>
  <div>
    <form v-if="!isAuthenticated" @submit.prevent="login">
      <h2>Login</h2>
      <input type="email" placeholder="Email..." v-model="email" />
      <input type="password" placeholder="Password..." v-model="password" />
      <button type="submit">Log In</button>
      <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    </form>
  </div>
</template>
