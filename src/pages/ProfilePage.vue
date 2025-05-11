<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const db = getFirestore()

const profileData = ref(null)
const orders = ref([])
const isLoading = ref(true)
const activeTab = ref('profile')
const error = ref(null)
const filterStatus = ref('all')

const statusLabels = {
  all: 'Все заказы',
  processing: 'В обработке',
  completed: 'Завершен',
  cancelled: 'Отменен',
}

const statusClasses = {
  processing: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const filteredOrders = computed(() => {
  if (filterStatus.value === 'all') return orders.value
  return orders.value.filter((o) => o.status === filterStatus.value)
})

const loadProfileData = async () => {
  try {
    if (!authStore.user) return

    const userDocRef = doc(db, 'users', authStore.user.uid)
    const userDoc = await getDoc(userDocRef)
    profileData.value = userDoc.exists() ? userDoc.data() : null

    const ordersCol = collection(db, 'orders')
    const q = query(ordersCol, where('userId', '==', authStore.user.uid))
    const querySnapshot = await getDocs(q)

    orders.value = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt.toDate(),
      }))
      .sort((a, b) => b.date - a.date)
  } catch (err) {
    error.value = 'Ошибка загрузки данных профиля'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const checkAuth = async () => {
  if (!authStore.isInitialized) {
    await authStore.init()
  }
  if (!authStore.user) {
    router.push('/')
    return false
  }
  return true
}

const authLoading = ref(true)

onMounted(async () => {
  try {
    const isAuthenticated = await checkAuth()
    if (isAuthenticated && authStore.user) {
      await loadProfileData()
    }
  } catch (err) {
    error.value = 'Ошибка авторизации'
  } finally {
    authLoading.value = false
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 min-h-screen">
    <div class="mb-8 border-b border-gray-200">
      <h1 class="text-3xl font-bold mb-4">Личный кабинет</h1>
      <nav class="flex space-x-4">
        <button
          @click="activeTab = 'profile'"
          :class="
            activeTab === 'profile'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          "
          class="py-2 px-4 font-medium"
        >
          Профиль
        </button>
        <button
          @click="activeTab = 'orders'"
          :class="
            activeTab === 'orders'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          "
          class="py-2 px-4 font-medium"
        >
          Мои заказы
        </button>
      </nav>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <div
        class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Загрузка профиля...</p>
    </div>

    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
      {{ error }}
    </div>

    <div v-else>
      <div v-show="activeTab === 'profile'" class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="text-2xl font-bold mb-4">Личная информация</h2>
          <div class="space-y-3">
            <div class="flex items-center">
              <UserIcon class="w-5 h-5 text-gray-500 mr-2" />
              <span class="font-medium">{{ authStore.user.displayName }}</span>
            </div>
            <div class="flex items-center">
              <MailIcon class="w-5 h-5 text-gray-500 mr-2" />
              <span>{{ authStore.user.email }}</span>
            </div>
            <div v-if="profileData?.phone" class="flex items-center">
              <PhoneIcon class="w-5 h-5 text-gray-500 mr-2" />
              <span>{{ profileData.phone }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-blue-600 font-bold text-xl">
              {{ orders.filter((o) => o.status === 'completed').length }}
            </div>
            <div class="text-gray-600">Завершенных заказов</div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <div class="text-yellow-600 font-bold text-xl">
              {{ orders.filter((o) => o.status === 'processing').length }}
            </div>
            <div class="text-gray-600">Текущих заказов</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-green-600 font-bold text-xl">
              {{
                new Intl.NumberFormat('ru-RU').format(orders.reduce((sum, o) => sum + o.total, 0))
              }}
              ₽
            </div>
            <div class="text-gray-600">Всего потрачено</div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'orders'" class="space-y-6">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="status in ['all', 'processing', 'completed', 'cancelled']"
            :key="status"
            @click="filterStatus = status"
            :class="
              filterStatus === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            "
            class="px-4 py-2 rounded-full text-sm"
          >
            {{ statusLabels[status] }}
          </button>
        </div>

        <div v-if="filteredOrders.length === 0" class="text-center py-8 text-gray-500">
          Заказы не найдены
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <div class="font-bold text-lg">Заказ #{{ order.id.slice(0, 8).toUpperCase() }}</div>
                <div class="text-gray-500 text-sm">{{ order.date.toLocaleDateString() }}</div>
              </div>
              <span :class="statusClasses[order.status]" class="px-3 py-1 rounded-full text-sm">
                {{ statusLabels[order.status] }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div class="text-sm font-medium mb-2">Состав заказа:</div>
                <ul class="space-y-1">
                  <li
                    v-for="item in order.items"
                    :key="item.id"
                    class="flex justify-between text-sm"
                  >
                    <span>{{ item.title }} ×{{ item.quantity }}</span>
                    <span>{{ (item.price * item.quantity).toFixed(2) }} ₽</span>
                  </li>
                </ul>
              </div>

              <div>
                <div class="text-sm font-medium mb-2">Детали доставки:</div>
                <div class="text-sm space-y-1">
                  <div>{{ order.deliveryAddress.fullName }}</div>
                  <div>{{ order.deliveryAddress.address }}</div>
                  <div>
                    {{ order.deliveryAddress.city }}, {{ order.deliveryAddress.postalCode }}
                  </div>
                  <div>Телефон: {{ order.deliveryAddress.phone }}</div>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t flex justify-between items-center">
              <div class="font-bold">Итого: {{ order.total.toFixed(2) }} ₽</div>
              <button
                @click="repeatOrder(order.id)"
                class="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                <RefreshIcon class="w-4 h-4 mr-1" />
                Повторить заказ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
