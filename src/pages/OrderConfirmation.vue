<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const route = useRoute()
const db = getFirestore()
const order = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const docRef = doc(db, 'orders', route.params.orderId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      order.value = {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
      }
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="isLoading" class="text-center">Загрузка...</div>
    <div v-else-if="order" class="bg-white p-8 rounded-xl shadow-sm">
      <h1 class="text-3xl font-bold mb-6">Заказ успешно оформлен!</h1>
      <div class="space-y-4">
        <p><strong>Номер заказа:</strong> #{{ order.id.slice(0, 8).toUpperCase() }}</p>
        <p><strong>Дата:</strong> {{ order.createdAt.toLocaleDateString() }}</p>
        <p><strong>Статус:</strong> {{ order.status }}</p>
        <p><strong>Сумма:</strong> {{ order.total.toFixed(2) }} ₽</p>
      </div>
      <router-link
        to="/profile"
        class="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Посмотреть в профиле
      </router-link>
    </div>
  </div>
</template>
