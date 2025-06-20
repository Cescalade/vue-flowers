<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useDrawerStore } from '@/stores/drawer'
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const drawerStore = useDrawerStore()
const router = useRouter()
const db = getFirestore()

const profileData = ref(null)
const orders = ref([])
const isLoading = ref(true)
const activeTab = ref('profile')
const error = ref(null)
const filterStatus = ref('all')
const isRepeating = ref(false)

const currentPage = ref(1)
const itemsPerPage = ref(5)
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage.value))

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

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredOrders.value.slice(start, end)
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

watch(filterStatus, () => {
  currentPage.value = 1
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const goToPage = (page) => {
  currentPage.value = page
}

const repeatOrder = async (order) => {
  try {
    isRepeating.value = true

    cartStore.clearCart()

    if (order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        cartStore.addItem({
          id: item.id,
          title: item.title,
          price: item.price,
          imgUrl: item.imgUrl,
          quantity: item.quantity,
        })
      }

      drawerStore.open()
    } else {
      throw new Error('Заказ не содержит товаров')
    }
  } catch (err) {
    error.value = 'Не удалось повторить заказ: ' + err.message
    console.error('Ошибка при повторении заказа:', err)
  } finally {
    isRepeating.value = false
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
    <div class="mb-6 sm:mb-8 pb-4 border-b border-gray-200">
      <h1 class="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Личный кабинет</h1>
      <nav class="flex overflow-x-auto pb-2 sm:pb-0 space-x-2 sm:space-x-4">
        <button
          @click="activeTab = 'profile'"
          :class="[
            'py-1.5 sm:py-2 px-3 sm:px-4 font-medium text-sm sm:text-base',
            activeTab === 'profile'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          Профиль
        </button>
        <button
          @click="activeTab = 'orders'"
          :class="[
            'py-1.5 sm:py-2 px-3 sm:px-4 font-medium text-sm sm:text-base',
            activeTab === 'orders'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700',
          ]"
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
      <div v-show="activeTab === 'profile'" class="space-y-4 sm:space-y-6">
        <div class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
          <h2 class="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Личная информация</h2>
          <div class="space-y-2 sm:space-y-3">
            <div class="flex items-center text-sm sm:text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span class="font-medium">{{ authStore.user.displayName }}</span>
            </div>
            <div class="flex items-center text-sm sm:text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{{ authStore.user.email }}</span>
            </div>
            <div v-if="profileData?.phone" class="flex items-center text-sm sm:text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{{ profileData.phone }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          <div class="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <div class="text-blue-600 font-bold text-lg sm:text-xl">
              {{ orders.filter((o) => o.status === 'completed').length }}
            </div>
            <div class="text-gray-600 text-sm sm:text-base">Завершенных заказов</div>
          </div>
          <div class="bg-yellow-50 p-3 sm:p-4 rounded-lg">
            <div class="text-yellow-600 font-bold text-lg sm:text-xl">
              {{ orders.filter((o) => o.status === 'processing').length }}
            </div>
            <div class="text-gray-600 text-sm sm:text-base">Текущих заказов</div>
          </div>
          <div class="bg-green-50 p-3 sm:p-4 rounded-lg">
            <div class="text-green-600 font-bold text-lg sm:text-xl">
              {{
                new Intl.NumberFormat('ru-RU').format(orders.reduce((sum, o) => sum + o.total, 0))
              }}
              ₽
            </div>
            <div class="text-gray-600 text-sm sm:text-base">Всего потрачено</div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'orders'" class="space-y-4 sm:space-y-6">
        <div class="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            v-for="status in ['all', 'processing', 'completed', 'cancelled']"
            :key="status"
            @click="filterStatus = status"
            :class="[
              'px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm transition-colors',
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
          >
            {{ statusLabels[status] }}
          </button>
        </div>

        <div class="flex justify-between items-center mb-4">
          <div class="text-sm text-gray-600">
            Показано: {{ paginatedOrders.length }} из {{ filteredOrders.length }}
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">Заказов на странице:</span>
            <select
              v-model.number="itemsPerPage"
              class="border rounded-md px-2 py-1 text-sm"
              @change="currentPage = 1"
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>

        <div v-if="paginatedOrders.length === 0" class="text-center py-8 text-gray-500">
          Заказы не найдены
        </div>

        <div v-else class="space-y-3 sm:space-y-4">
          <div
            v-for="order in paginatedOrders"
            :key="order.id"
            class="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3 sm:mb-4">
              <div>
                <div class="font-bold text-base sm:text-lg">
                  Заказ #{{ order.id.slice(0, 8).toUpperCase() }}
                </div>
                <div class="text-gray-500 text-xs sm:text-sm">
                  {{ order.date.toLocaleDateString() }}
                </div>
              </div>
              <span
                :class="[
                  statusClasses[order.status],
                  'px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm',
                ]"
              >
                {{ statusLabels[order.status] }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div class="text-sm font-medium mb-1 sm:mb-2">Состав заказа:</div>
                <ul class="space-y-1">
                  <li
                    v-for="item in order.items"
                    :key="item.id"
                    class="flex justify-between text-xs sm:text-sm"
                  >
                    <span>{{ item.title }} ×{{ item.quantity }}</span>
                    <span>{{ (item.price * item.quantity).toFixed(2) }} ₽</span>
                  </li>
                </ul>
              </div>

              <div>
                <div class="text-sm font-medium mb-1 sm:mb-2">Детали доставки:</div>
                <div class="text-xs sm:text-sm space-y-1">
                  <div>{{ order.deliveryAddress.fullName }}</div>
                  <div>{{ order.deliveryAddress.address }}</div>
                  <div>
                    {{ order.deliveryAddress.city }}, {{ order.deliveryAddress.postalCode }}
                  </div>
                  <div>Телефон: {{ order.deliveryAddress.phone }}</div>
                </div>
              </div>
            </div>

            <div
              class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center"
            >
              <div class="font-bold text-sm sm:text-base">
                Итого: {{ order.total.toFixed(2) }} ₽
              </div>
              <button
                @click="repeatOrder(order)"
                :disabled="isRepeating"
                class="text-blue-600 hover:text-blue-800 text-xs sm:text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="isRepeating"
                  class="animate-spin w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1"
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
                  class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1"
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
                {{ isRepeating ? 'Добавляем...' : 'Повторить заказ' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Пагинация -->
        <div
          v-if="totalPages > 1"
          class="flex flex-col sm:flex-row items-center justify-between pt-4"
        >
          <div class="text-sm text-gray-600 mb-2 sm:mb-0">
            Страница {{ currentPage }} из {{ totalPages }}
          </div>

          <div class="flex items-center space-x-1">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-1 rounded-md text-sm',
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
              ]"
            >
              Назад
            </button>

            <template v-for="page in totalPages" :key="page">
              <button
                v-if="Math.abs(page - currentPage) < 3 || page === 1 || page === totalPages"
                @click="goToPage(page)"
                :class="[
                  'w-8 h-8 rounded-full text-sm',
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </button>
              <span
                v-else-if="Math.abs(page - currentPage) === 3 && totalPages > 5"
                class="px-2 text-gray-400"
              >
                ...
              </span>
            </template>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="[
                'px-3 py-1 rounded-md text-sm',
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
              ]"
            >
              Вперед
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
