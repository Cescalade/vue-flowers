import { defineStore } from 'pinia'
import { ref, computed, watchEffect } from 'vue'
import { db } from '../../firebase/index'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuthStore } from './authStore'

export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore()
  const items = ref([])
  const isCartLoading = ref(true)

  const initCart = async () => {
    isCartLoading.value = true
    try {
      if (authStore.user) {
        const cartRef = doc(db, 'carts', authStore.user.uid)
        const cartSnap = await getDoc(cartRef)
        items.value = cartSnap.exists() ? cartSnap.data().items : []
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error)
    } finally {
      isCartLoading.value = false
    }
  }

  watchEffect(() => {
    if (authStore.user) {
      initCart()
    } else {
      items.value = []
    }
  })

  watchEffect(async () => {
    if (authStore.user && !isCartLoading.value) {
      await saveCart()
    }
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  const saveCart = async () => {
    try {
      if (authStore.user) {
        const cartRef = doc(db, 'carts', authStore.user.uid)
        await setDoc(cartRef, { items: items.value })
      }
    } catch (error) {
      console.error('Ошибка сохранения корзины:', error)
    }
  }

  const addItem = (product) => {
    const existing = items.value.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  const removeItem = (itemId) => {
    items.value = items.value.filter((item) => item.id !== itemId)
  }

  const updateQuantity = (itemId, newQuantity) => {
    const item = items.value.find((item) => item.id === itemId)
    if (item) {
      newQuantity = Math.max(1, newQuantity)
      item.quantity = newQuantity
    }
  }

  const clearCart = async () => {
    items.value = []
    if (authStore.user) {
      const cartRef = doc(db, 'carts', authStore.user.uid)
      await setDoc(cartRef, { items: [] })
    }
  }

  return {
    items,
    totalPrice,
    isCartLoading,
    initCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
})
