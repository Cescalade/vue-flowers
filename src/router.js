import { createWebHistory, createRouter } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import CardPage from './pages/CardPage.vue'
import SignUpPage from './pages/SignUpPage.vue'
import LoginPage from './pages/LoginPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/profile', name: 'profile', component: ProfilePage },
  {
    path: '/card/:id',
    name: 'card',
    component: CardPage,
    props: true,
    meta: { authRequired: true },
  },
  { path: '/register', name: 'register', component: SignUpPage },
  { path: '/login', name: 'login', component: LoginPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
