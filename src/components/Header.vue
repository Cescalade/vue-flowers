<template>
  <header class="flex justify-between px-8 pt-1 bg-transparent rounded-xl relative z-10 text-lg">
    <router-link to="/">
      <div class="flex items-center">
        <img class="w-15" src="@/assets/images/florist-svgrepo-com.svg" alt="Logo" />
      </div>
    </router-link>
    <ul class="flex items-center gap-20 mr-[3%] text-white font-bold">
      <li v-if="isAuthenticated" class="group">
        <router-link to="/profile"
          ><a class="cursor-pointer text-center transition-all">
            профиль
            <span
              class="absolute bottom-0 left-1/2 w-0 h-px bg-current transform -translate-x-1/2 transition-all duration-300 group-hover:w-full"
            ></span> </a
        ></router-link>
      </li>
      <li class="group">
        <button
          @click="drawer.open()"
          class="cursor-pointer relative text-center transition-all inline-block"
        >
          корзина:
          <span
            class="absolute bottom-0 left-1/2 w-0 h-1/19 bg-current transform -translate-x-1/2 transition-all duration-300 group-hover:w-full"
          ></span>
        </button>
      </li>
      <li v-if="!isAuthenticated" class="group">
        <button
          @click="registerDrawer.open()"
          class="cursor-pointer relative text-center transition-all inline-block"
        >
          регистрация
          <span
            class="absolute bottom-0 left-1/2 w-0 h-1/19 bg-current transform -translate-x-1/2 transition-all duration-300 group-hover:w-full"
          ></span>
        </button>
      </li>
      <li v-if="!isAuthenticated" class="group">
        <button
          @click="loginDrawer.open()"
          class="cursor-pointer relative text-center transition-all inline-block"
        >
          войти
          <span
            class="absolute bottom-0 left-1/2 w-0 h-1/19 bg-current transform -translate-x-1/2 transition-all duration-300 group-hover:w-full"
          ></span>
        </button>
      </li>
      <li v-if="isAuthenticated" class="group">
        <button
          @click="logout"
          class="cursor-pointer relative text-center transition-all inline-block"
        >
          выйти
          <span
            class="absolute bottom-0 left-1/2 w-0 h-1/19 bg-current transform -translate-x-1/2 transition-all duration-300 group-hover:w-full"
          ></span>
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
import { useLoginDrawerStore } from '@/stores/loginDrawer'
import { useRegisterDrawerStore } from '@/stores/registerDrawer'

const drawer = useDrawerStore()
const loginDrawer = useLoginDrawerStore()
const registerDrawer = useRegisterDrawerStore()
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
