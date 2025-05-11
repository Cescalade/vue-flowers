<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const orderStore = useOrderStore()
const router = useRouter()

const form = ref({
  fullName: '',
  address: '',
  city: '',
  postalCode: '',
  phone: '',
  paymentMethod: 'card',
  cardNumber: '',
  cardExpiry: '',
  cardCVC: '',
})

const paymentMethods = [
  { value: 'card', label: 'Кредитная карта' },
  { value: 'cash', label: 'Наличными при получении' },
]

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

    if (form.value.paymentMethod === 'card') {
      orderData.paymentDetails = {
        cardNumber: form.value.cardNumber,
        cardExpiry: form.value.cardExpiry,
        cardCVC: form.value.cardCVC,
      }
    }

    const orderId = await orderStore.createOrder(orderData)
    router.push({ name: 'order-confirmation', params: { orderId } })
  } catch (error) {
    console.error('Ошибка оформления заказа:', error)
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">Оформление заказа</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Данные для доставки</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">ФИО</label>
            <input v-model="form.fullName" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Адрес</label>
            <input v-model="form.address" class="input-field" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Город</label>
              <input v-model="form.city" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Индекс</label>
              <input v-model="form.postalCode" class="input-field" required />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Телефон</label>
            <input v-model="form.phone" type="tel" class="input-field" required />
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Способ оплаты</h2>
        <div class="space-y-4">
          <select v-model="form.paymentMethod" class="input-field">
            <option v-for="method in paymentMethods" :value="method.value">
              {{ method.label }}
            </option>
          </select>

          <div v-if="form.paymentMethod === 'card'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Номер карты</label>
              <input
                v-model="form.cardNumber"
                class="input-field"
                placeholder="0000 0000 0000 0000"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Срок действия</label>
                <input v-model="form.cardExpiry" class="input-field" placeholder="MM/YY" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">CVC</label>
                <input v-model="form.cardCVC" class="input-field" placeholder="123" />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 border-t pt-6">
          <h3 class="text-lg font-semibold mb-4">Ваш заказ</h3>
          <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between mb-2">
            <span>{{ item.title }} ×{{ item.quantity }}</span>
            <span>{{ (item.price * item.quantity).toFixed(2) }} ₽</span>
          </div>
          <div class="flex justify-between font-bold border-t pt-4 mt-4">
            <span>Итого:</span>
            <span>{{ cartStore.totalPrice.toFixed(2) }} ₽</span>
          </div>
        </div>

        <button
          @click="handleSubmit"
          :disabled="orderStore.isLoading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 disabled:opacity-50"
        >
          {{ orderStore.isLoading ? 'Обработка...' : 'Подтвердить заказ' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
