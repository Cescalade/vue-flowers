<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useLoginDrawerStore } from '@/stores/loginDrawer'
import { useRegisterDrawerStore } from '@/stores/registerDrawer'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const loginDrawer = useLoginDrawerStore()
const registerDrawer = useRegisterDrawerStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loginSuccess = ref(false)

const handleLogin = async (event) => {
  event.preventDefault()
  try {
    await authStore.login(email.value, password.value)
    loginSuccess.value = true
    setTimeout(() => {
      loginDrawer.close()
      router.push('/')
    }, 1500)
  } catch {
    password.value = ''
    loginSuccess.value = false
  }
}
</script>

<template>
  <Transition name="drawer">
    <div
      v-if="loginDrawer.isOpen"
      @click="loginDrawer.close()"
      class="fixed inset-0 bg-black z-10 opacity-70 pointer-events-auto"
    ></div>
  </Transition>
  <Transition name="drawer-content">
    <div
      v-if="loginDrawer.isOpen"
      class="fixed inset-0 m-auto bg-[#f5f6f9] w-9/10 h-140 rounded-4xl flex flex-col z-11 p-8 pt-10 overflow-hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:w-88"
    >
      <svg
        width="800px"
        height="800px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        class="w-70 h-70 absolute opacity-40 -bottom-7 -left-20 -z-50"
      >
        <defs>
          <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fb923c" />
            <stop offset="100%" stop-color="#dc2626" />
          </linearGradient>
        </defs>

        <path
          fill="url(#myGradient)"
          d="M10.84 21.871 12 22a10.221 10.221 0 0 0-9.013-8.891L2 13l.021.173a10.001 10.001 0 0 0 8.819 8.698zm11.139-8.698L22 13l-.987.109c-4.7.523-8.427 4.2-9.013 8.891l1.16-.129a10.001 10.001 0 0 0 8.819-8.698zM18.063 5.5a2.5 2.5 0 0 0-3.415-.915c-.062.035-.111.081-.168.121.005-.069.02-.136.02-.206a2.5 2.5 0 1 0-5 0c0 .07.015.137.021.206-.057-.04-.107-.086-.168-.121a2.5 2.5 0 0 0-2.5 4.33c.061.035.126.056.188.085-.062.029-.127.05-.188.085a2.5 2.5 0 0 0 2.5 4.33c.062-.035.111-.081.168-.121-.006.069-.021.136-.021.206a2.5 2.5 0 1 0 5 0c0-.07-.015-.137-.021-.206.057.04.106.086.168.121a2.5 2.5 0 0 0 2.5-4.33c-.061-.035-.126-.056-.188-.085.063-.029.127-.05.188-.085a2.5 2.5 0 0 0 .916-3.415zM12 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
        />
      </svg>
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold">Вход</h2>
      </div>

      <div class="mt-12 flex flex-col grow justify-between">
        <form @submit.prevent="handleLogin" class="flex flex-col gap-2">
          <label for="email" class="ml-2">Почта</label>
          <input
            type="plain"
            autocomplete="email"
            required
            v-model="email"
            class="bg-white shadow-sm rounded-lg h-9 px-3"
          />

          <label for="password" class="ml-2">Пароль</label>
          <input
            type="password"
            autocomplete="current-password"
            required
            v-model="password"
            class="bg-white shadow-sm rounded-lg h-9 px-3"
          />

          <button
            type="submit"
            class="text-white mx-auto mt-5 w-50 p-2 bg-gradient-to-tr from-orange-400 to-red-600 hover:from-orange-400 hover:to-red-500 rounded-3xl transition shadow-[0_0px_20px_rgba(255,60,70,0.5)] hover:shadow-[0_0px_35px_rgba(255,60,70,0.7)]"
          >
            Войти ➜
          </button>
          <div v-if="loginSuccess" class="text-black text-center mb-4">
            Успешный вход! Перенаправление...
          </div>
        </form>

        <div class="flex flex-col items-center text-gray-800 pb-4">
          <p>Ещё нет учетной записи?</p>
          <button
            class="hover:text-black transition"
            @click="(loginDrawer.close(), registerDrawer.open())"
          >
            Регистрация
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-content-enter-active,
.drawer-content-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.drawer-content-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(5px);
}

.drawer-content-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
