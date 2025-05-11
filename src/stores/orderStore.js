import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../../firebase/index'
import { doc, setDoc, collection } from 'firebase/firestore'
import { useAuthStore } from './authStore'
import { useCartStore } from './cartStore'

export const useOrderStore = defineStore('order', () => {
  const authStore = useAuthStore()
  const cartStore = useCartStore()
  const isLoading = ref(false)
  const error = ref(null)

  const createOrder = async (orderData) => {
    try {
      isLoading.value = true
      error.value = null

      if (!authStore.user) throw new Error('User not authenticated')

      const ordersCollection = collection(db, 'orders')
      const orderRef = doc(ordersCollection)

      await setDoc(orderRef, {
        ...orderData,
        userId: authStore.user.uid,
        status: 'processing',
        createdAt: new Date(),
        items: cartStore.items,
        total: cartStore.totalPrice,
      })

      await cartStore.clearCart()
      return orderRef.id
    } catch (err) {
      error.value = 'Ошибка создания заказа: ' + err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return { createOrder, isLoading, error }
})
