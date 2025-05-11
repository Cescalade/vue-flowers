import { createWebHistory, createRouter } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import CardPage from './pages/CardPage.vue'
import OrderConfirmation from './pages/OrderConfirmation.vue'
import CheckoutPage from './pages/CheckoutPage.vue'

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
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/order-confirmation/:orderId',
    name: 'order-confirmation',
    component: OrderConfirmation,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
