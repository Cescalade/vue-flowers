import './assets/main.css'
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
const authStore = useAuthStore()
authStore.init()
app.mount('#app')
