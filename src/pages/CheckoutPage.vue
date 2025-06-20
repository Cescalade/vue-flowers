<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'
import { useAuthStore } from '@/stores/authStore' // Добавили хранилище аутентификации
import { useRouter } from 'vue-router'
import { getFirestore, doc, getDoc } from 'firebase/firestore' // Для получения данных профиля

const cartStore = useCartStore()
const orderStore = useOrderStore()
const authStore = useAuthStore() // Используем хранилище аутентификации
const router = useRouter()
const db = getFirestore()

const form = ref({
  fullName: '',
  address: '',
  city: '',
  postalCode: '',
  phone: '',
  paymentMethod: 'cash',
})

// Флаг загрузки профиля
const isProfileLoading = ref(false)

// Загрузка данных профиля
const loadProfileData = async () => {
  if (!authStore.user) return

  isProfileLoading.value = true
  try {
    const userDocRef = doc(db, 'users', authStore.user.uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      if (!form.value.fullName) {
        form.value.fullName = userData.fullName || authStore.user.displayName || ''
      }
      if (!form.value.phone) {
        form.value.phone = userData.phone || ''
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error)
  } finally {
    isProfileLoading.value = false
  }
}

onMounted(() => {
  if (authStore.user) {
    loadProfileData()
  }
})

const validateForm = () => {
  const requiredFields = ['fullName', 'address', 'city', 'postalCode', 'phone']
  return requiredFields.every((field) => form.value[field].trim())
}

const handleSubmit = async () => {
  if (!validateForm()) {
    alert('Заполните все обязательные поля')
    return
  }

  try {
    const orderData = {
      deliveryAddress: {
        fullName: form.value.fullName,
        address: form.value.address,
        city: form.value.city,
        postalCode: form.value.postalCode,
        phone: form.value.phone,
      },
      paymentMethod: form.value.paymentMethod,
    }

    const orderId = await orderStore.createOrder(orderData)
    router.push({ name: 'order-confirmation', params: { orderId } })
  } catch (error) {
    console.error('Ошибка оформления заказа:', error)
    alert('Произошла ошибка при оформлении заказа')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Оформление заказа</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg sm:text-xl font-semibold">Данные для доставки</h2>
          <button
            v-if="authStore.user"
            @click="loadProfileData"
            :disabled="isProfileLoading"
            class="text-blue-600 text-sm hover:text-blue-800 flex items-center disabled:opacity-50"
          >
            <svg
              v-if="isProfileLoading"
              class="animate-spin w-4 h-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Заполнить мои данные
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">ФИО</label>
            <input
              v-model="form.fullName"
              class="input-field w-full"
              placeholder="Иванов Иван Иванович"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Адрес</label>
            <input
              v-model="form.address"
              class="input-field w-full"
              placeholder="ул. Примерная, д. 1, кв. 2"
              required
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Город</label>
              <input v-model="form.city" class="input-field w-full" placeholder="Гродно" required />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Индекс</label>
              <input
                v-model="form.postalCode"
                class="input-field w-full"
                placeholder="123456"
                required
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Телефон</label>
            <input
              v-model="form.phone"
              type="tel"
              class="input-field w-full"
              placeholder="+375(33)333-33-33"
              required
            />
          </div>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
        <h2 class="text-lg sm:text-xl font-semibold mb-4">Способ оплаты</h2>
        <div class="space-y-4">
          <div class="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
            Наличными при получении
          </div>
          <input type="hidden" v-model="form.paymentMethod" />
        </div>

        <div class="mt-6 sm:mt-8 border-t pt-6">
          <h3 class="text-md sm:text-lg font-semibold mb-4">Ваш заказ</h3>
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex justify-between mb-2 text-sm sm:text-base"
          >
            <span>{{ item.title }} ×{{ item.quantity }}</span>
            <span>{{ (item.price * item.quantity).toFixed(2) }} ₽</span>
          </div>
          <div class="flex justify-between font-bold border-t pt-4 mt-4 text-base sm:text-lg">
            <span>Итого:</span>
            <span>{{ cartStore.totalPrice.toFixed(2) }} ₽</span>
          </div>
        </div>

        <button
          @click="handleSubmit"
          :disabled="orderStore.isLoading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {{ orderStore.isLoading ? 'Обработка...' : 'Подтвердить заказ' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-field {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field::placeholder {
  color: #9ca3af;
}
</style>
