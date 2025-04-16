<script setup>
import router from '@/router'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { ref } from 'vue'
import useAuth from '../../composable/useAuth'

const { isAuthenticated } = useAuth()
const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const registrationError = ref('')
const registrationSuccess = ref(false)
const db = getFirestore()

async function register() {
  registrationError.value = ''
  registrationSuccess.value = false

  const auth = getAuth()
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    await updateProfile(user, {
      displayName: `${firstName.value} ${lastName.value}`,
    })

    const userDocRef = doc(db, 'users', user.uid)
    const userData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
    }

    await setDoc(userDocRef, userData)

    registrationSuccess.value = true
    setTimeout(() => {
      router.push('/')
    }, 150)
  } catch (error) {
    registrationError.value = error.message
  }
}
</script>

<template>
  <div>
    <form v-if="!isAuthenticated" @submit.prevent="register">
      <h2>Register</h2>
      <div v-if="registrationSuccess" class="success-message">Sign up success! Redirecting...</div>
      <div v-if="registrationError" class="error-message">{{ registrationError }}</div>

      <input type="text" placeholder="First Name" v-model="firstName" autocomplete="given-name" />
      <input type="text" placeholder="Last Name" v-model="lastName" autocomplete="family-name" />
      <input type="email" placeholder="Email..." autocomplete="email" v-model="email" />
      <input
        type="password"
        placeholder="Password..."
        autocomplete="new-password"
        v-model="password"
      />
      <input type="tel" placeholder="Phone Number (optional)" v-model="phone" autocomplete="tel" />

      <button type="submit">Sign Up</button>
    </form>
    <p v-else-if="registrationSuccess">success</p>
    <p v-else>You are already logged in.</p>
  </div>
</template>
