<template>
  <header class="flex justify-between px-8 pt-1 bg-transparent rounded-xl relative z-10 text-lg">
    <router-link to="/">
      <div class="flex items-center">
        <img class="w-15" src="@/assets/images/florist-svgrepo-com.svg" alt="Logo" />
      </div>
    </router-link>
    <ul class="flex items-center gap-20">
      <li v-if="isAuthenticated">
        <router-link to="/profile"
          ><a class="cursor-pointer text-center transition hover:text-stone-500">
            Profile
          </a></router-link
        >
      </li>
      <li class="">
        <button
          @click="drawer.open()"
          class="cursor-pointer text-center transition hover:text-stone-500"
        >
          Cart:
        </button>
      </li>
      <li v-if="!isAuthenticated">
        <router-link to="/register">
          <a>Sign up</a>
        </router-link>
      </li>
      <li v-if="!isAuthenticated">
        <router-link to="/login">
          <a>Войти</a>
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
import { useDrawerStore } from '@/stores/drawer'

const drawer = useDrawerStore()
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
