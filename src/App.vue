<script setup>
import Header from './components/Header.vue'
import defaultLayout from '../layouts/default.vue'
import Drawer from './components/Drawer.vue'
import LoginDrawer from './components/LoginDrawer.vue'
import RegisterDrawer from './components/RegisterDrawer.vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { ref, onMounted } from 'vue'

const authStore = useAuthStore()
const cartStore = useCartStore()
const isLoading = ref(true)

onMounted(async () => {
  const startTime = Date.now()
  const MIN_LOADING_TIME = 500 // Минимальное время показа прелоадера в миллисекундах

  try {
    await Promise.all([authStore.init(), cartStore.initCart])
  } finally {
    const elapsed = Date.now() - startTime
    if (elapsed < MIN_LOADING_TIME) {
      await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME - elapsed))
    }
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white z-50">
    <div
      class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
    ></div>
  </div>

  <defaultLayout v-else class="overflow-hidden">
    <Header class="z-5" />
    <Drawer />
    <LoginDrawer />
    <RegisterDrawer />
    <router-view></router-view>
  </defaultLayout>
</template>
