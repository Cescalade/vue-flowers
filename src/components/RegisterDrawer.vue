<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRegisterDrawerStore } from '@/stores/registerDrawer'
import { useLoginDrawerStore } from '@/stores/loginDrawer'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const registerDrawer = useRegisterDrawerStore()
const loginDrawer = useLoginDrawerStore()
const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
})

const registrationSuccess = ref(false)
const registrationError = ref('')

const handleRegister = async (event) => {
  event.preventDefault()
  try {
    await authStore.register(form.value)
    registrationSuccess.value = true
    setTimeout(() => {
      registerDrawer.close()
      router.push('/')
    }, 1500)
  } catch (error) {
    registrationError.value = authStore.error
    form.value.password = ''
  }
}
</script>

<template>
  <Transition name="drawer">
    <div
      v-if="registerDrawer.isOpen"
      @click="registerDrawer.close()"
      class="fixed inset-0 bg-black z-10 opacity-70 pointer-events-auto"
    ></div>
  </Transition>

  <Transition name="drawer-content">
    <div
      v-if="registerDrawer.isOpen"
      class="fixed inset-0 m-auto bg-[#f5f6f9] w-88 h-180 rounded-4xl flex flex-col z-11 p-8 pt-10 overflow-hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
        <h2 class="text-2xl font-bold">Регистрация</h2>
      </div>

      <div class="mt-8 flex flex-col grow justify-between">
        <form @submit.prevent="handleRegister" class="flex flex-col gap-2">
          <div v-if="registrationSuccess" class="text-black text-center mb-4">
            Успешная регистрация! Перенаправление...
          </div>
          <div v-if="registrationError" class="text-red-500 text-sm text-center mb-4">
            {{ registrationError }}
          </div>

          <label class="ml-2">Имя</label>
          <input
            type="text"
            required
            v-model="form.firstName"
            autocomplete="given-name"
            class="bg-white shadow-sm rounded-lg h-9 px-3"
          />

          <label class="ml-2">Фамилия</label>
          <input
            type="text"
            required
            v-model="form.lastName"
            autocomplete="family-name"
            class="bg-white shadow-sm rounded-lg h-9 px-3"
          />

          <label class="ml-2">Email</label>
          <input
            type="email"
            required
            v-model="form.email"
            autocomplete="email"
            class="bg-white shadow-sm rounded-lg h-9 px-3"
          />

          <label class="ml-2">Пароль</label>
          <input
            type="password"
            required
            v-model="form.password"
            autocomplete="new-password"
            class="bg-white shadow-sm rounded-lg h-9 px-3"
          />

          <label class="ml-2">Телефон (необязательно)</label>
          <input
            type="tel"
            v-model="form.phone"
            autocomplete="tel"
            class="bg-white shadow-sm rounded-lg h-9 px-3"
          />
          <div v-if="authStore.error" class="text-red-500 text-sm text-center mb-4">
            {{ authStore.error }}
          </div>

          <button
            type="submit"
            class="text-white mx-auto mt-5 w-60 cursor-pointer p-2 bg-gradient-to-tr from-orange-400 to-red-600 hover:from-orange-400 hover:to-red-500 rounded-3xl transition shadow-[0_0px_20px_rgba(255,60,70,0.5)] hover:shadow-[0_0px_35px_rgba(255,60,70,0.7)]"
          >
            Зарегистрироваться
          </button>
        </form>

        <div class="flex flex-col items-center text-gray-800 pb-4">
          <p>Уже есть аккаунт?</p>
          <button
            class="hover:text-black transition"
            @click="(registerDrawer.close(), loginDrawer.open())"
          >
            Войти
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
