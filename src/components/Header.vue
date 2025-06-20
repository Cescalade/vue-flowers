<template>
  <header
    class="flex flex-wrap sm:flex-nowrap justify-between items-center px-4 sm:px-6 md:px-8 py-2 bg-transparent rounded-xl relative z-10"
  >
    <router-link to="/" class="order-1 sm:order-none">
      <div class="flex items-center">
        <img
          class="w-10 sm:w-12 md:w-15 transition-all"
          src="@/assets/images/florist-svgrepo-com.svg"
          alt="Logo"
        />
        <h1 class="ml-3 text-4xl">flove</h1>
      </div>
    </router-link>

    <button
      @click="toggleMobileMenu"
      class="sm:hidden p-2 rounded-lg text-black hover:bg-gray-100 transition-colors"
      aria-label="Меню"
    >
      <svg class="w-6 h-6">
        <path
          :d="mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </button>

    <Transition name="popdown">
      <div
        v-show="mobileMenuOpen"
        class="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
      >
        <ul class="py-2">
          <li v-if="isAuthenticated">
            <router-link
              to="/profile"
              @click="mobileMenuOpen = false"
              class="flex items-center px-4 py-3 hover:bg-gray-50 text-gray-700"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Профиль
            </router-link>
          </li>

          <li>
            <button
              @click="(drawer.open(), (mobileMenuOpen = false))"
              class="w-full flex items-center px-4 py-3 hover:bg-gray-50 text-gray-700"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Корзина {{ cartStore.totalPrice > 0 ? `(${cartStore.totalPrice} руб.)` : '' }}
            </button>
          </li>

          <template v-if="!isAuthenticated">
            <li>
              <button
                @click="(registerDrawer.open(), (mobileMenuOpen = false))"
                class="w-full flex items-center px-4 py-3 hover:bg-gray-50 text-gray-700"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Регистрация
              </button>
            </li>

            <li>
              <button
                @click="(loginDrawer.open(), (mobileMenuOpen = false))"
                class="w-full flex items-center px-4 py-3 hover:bg-gray-50 text-gray-700"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Войти
              </button>
            </li>
          </template>

          <li v-if="isAuthenticated">
            <button
              @click="logout"
              class="w-full flex items-center px-4 py-3 hover:bg-gray-50 text-gray-700"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Выйти
            </button>
          </li>
        </ul>
      </div>
    </Transition>
    <ul
      class="w-full hidden sm:w-auto order-last sm:order-none sm:flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 text-base sm:text-lg font-medium sm:font-bold text-black mt-4 sm:mt-0"
    >
      <li v-if="isAuthenticated" class="group w-full sm:w-auto text-center py-2 sm:py-0">
        <router-link to="/profile"
          ><a class="cursor-pointer relative inline-block text-center transition-all">
            профиль
            <span
              class="absolute bottom-0 left-1/2 w-0 h-px bg-current transform -translate-x-1/2 transition-all duration-300 group-hover:w-full"
            ></span> </a
        ></router-link>
      </li>
      <li class="group w-full sm:w-auto text-center py-2 sm:py-0">
        <button
          @click="drawer.open()"
          class="cursor-pointer relative text-center transition-all inline-block"
        >
          корзина:
          <span v-if="cartStore.totalPrice > 0" class="ml-1">
            {{ cartStore.totalPrice }} руб.
          </span>
          <span
            class="absolute bottom-0 left-1/2 w-0 h-1/19 bg-current transform -translate-x-1/2 transition-all duration-300 group-hover:w-full"
          ></span>
        </button>
      </li>
      <li v-if="!isAuthenticated" class="group w-full sm:w-auto text-center py-2 sm:py-0">
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
      <li v-if="!isAuthenticated" class="group w-full sm:w-auto text-center py-2 sm:py-0">
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
      <li v-if="isAuthenticated" class="group w-full sm:w-auto text-center py-2 sm:py-0">
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
import { useCartStore } from '@/stores/cartStore'
import { ref, watch } from 'vue'

const cartStore = useCartStore()
const drawer = useDrawerStore()
const loginDrawer = useLoginDrawerStore()
const registerDrawer = useRegisterDrawerStore()
const { isAuthenticated } = useAuth()
const router = useRouter()
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

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
<style scoped>
.popdown-enter-active,
.popdown-leave-active {
  transition: all 0.2s ease;
}

.popdown-enter-from,
.popdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Убрать скролл при открытом меню */
body:has([aria-label='Меню'][aria-expanded='true']) {
  overflow: hidden;
}
</style>
