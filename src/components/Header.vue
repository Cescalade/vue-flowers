<template>
  <header class="flex justify-between px-8 pt-1 border-b-1 border-b-gray-200 rounded-xl shadow-md">
    <router-link to="/">
      <div class="flex items-center">
        <img class="w-10" src="@/assets/logo.svg" alt="Logo" />
      </div>
    </router-link>
    <ul class="flex items-center gap-5">
      <li>
        <router-link to="/profile"
          ><a class="cursor-pointer text-center transition hover:text-stone-500">
            Profile
          </a></router-link
        >
      </li>
      <li class="">
        <button class="cursor-pointer text-center transition hover:text-stone-500">Cart:</button>
      </li>
      <li v-if="!isAuthenticated">
        <router-link to="/register">
          <a>Sign up</a>
        </router-link>
      </li>
      <li v-if="!isAuthenticated">
        <router-link to="/login">
          <a>Login</a>
        </router-link>
      </li>
      <li v-if="isAuthenticated">
        <button @click="logout" class="cursor-pointer text-center transition hover:text-stone-500">
          Logout
        </button>
      </li>
    </ul>
  </header>
</template>

<script setup>
import useAuth from '../../composable/useAuth'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const { isAuthenticated } = useAuth()
const router = useRouter()

const logout = async () => {
  const auth = getAuth()
  try {
    await signOut(auth)
    router.push('/')
  } catch (error) {
    console.error('Error signing out:', error)
    alert('Could not sign out. Please try again.')
  }
}
</script>
