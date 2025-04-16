<script setup>
import router from '@/router'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { ref, onMounted } from 'vue'
import useAuth from '../../composable/useAuth'

const { isAuthenticated } = useAuth()
const email = ref('')
const password = ref('')

function register() {
  const auth = getAuth()
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user
      alert('Sign up success')
      router.push('/')
    })
    .catch((error) => {
      alert(error.message)
    })
}
</script>

<template>
  <div>
    <form v-if="!isAuthenticated" @submit.prevent="register">
      <h2>Register</h2>
      <input type="email" placeholder="Email..." v-model="email" />
      <input type="password" placeholder="Password..." suggested v-model="password" />
      <button type="submit">Sign Up</button>
    </form>
    <p v-else>You are already logged in.</p>
  </div>
</template>
