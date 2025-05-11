<script setup>
import Header from './components/Header.vue'
import defaultLayout from '../layouts/default.vue'
import Drawer from './components/Drawer.vue'
import LoginDrawer from './components/LoginDrawer.vue'
import RegisterDrawer from './components/RegisterDrawer.vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const cartStore = useCartStore()

onMounted(async () => {
  authStore.init()
})
</script>

<template>
  <defaultLayout class="overflow-hidden">
    <Header class="z-5" />
    <Drawer />
    <LoginDrawer />
    <RegisterDrawer />
    <router-view></router-view>
  </defaultLayout>
</template>
