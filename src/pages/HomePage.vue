<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import ItemList from '@/components/ItemList.vue'
import { useOrder } from '../../composable/useOrder'
import { useProducts } from '../../composable/useProducts'

const { products, getProducts } = useProducts()
const sortBy = ref('name')
const targetDiv = ref(null)
const dropdownOpen = ref(false)
const searchQuery = ref('')
const isLoaded = ref(false)

const filteredProducts = computed(() => {
  let result = [...products.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((product) => product.title.toLowerCase().includes(query))
  }

  if (sortBy.value === 'name') {
    result.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy.value === 'price') {
    result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === '-price') {
    result.sort((a, b) => a.price - b.price)
  }

  return result
})

const scrollToFlowers = () => targetDiv.value.scrollIntoView({ behavior: 'smooth' })

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const selectSortOption = (option) => {
  sortBy.value = option
}

watch(sortBy, async (newValue) => {
  if (newValue === 'price' || newValue === '-price') {
    const sortedProducts = await useOrder(newValue.replace('-', ''))
    products.value = sortedProducts
    if (newValue === '-price') {
      products.value.reverse()
    }
  }
})

onMounted(async () => {
  await getProducts()
  isLoaded.value = true
})
</script>

<template>
  <img
    src="/main-image.png"
    alt="цветы в вазе"
    class="w-full max-w-[1rem] xs:max-w-[12rem] sm:max-w-[18rem] md:max-w-[25rem] lg:max-w-[30rem] xl:max-w-[37rem] h-auto absolute -top-[6rem] xs:-top-[7rem] sm:-top-[10rem] md:-top-[13.5rem] right-[5%] md:right-[5%] transform transition-all duration-300"
  />
  <main class="overflow-hidden relative">
    <div
      class="p-4 sm:p-6 md:p-8 lg:p-12 h-80 sm:min-h-[500px] md:h-[600px] relative flex flex-col pt-16 sm:pt-24 md:pt-32 lg:pt-[7.5rem] pl-4 sm:pl-8 md:pl-12 lg:pl-20 gap-4 md:gap-6 lg:gap-8"
    >
      <h1 class="text-2xl xs:text-3xl sm:text-4xl font-bold">
        Выбери свой <br />
        <span class="text-gradient">идеальный</span> букет
      </h1>
      <button
        class="text-white cursor-pointer w-fit px-6 py-2 md:w-50 md:p-2 bg-linear-to-tr from-orange-400 to-red-600 hover:from-orange-400 hover:to-red-500 rounded-3xl transition shadow-[0_0px_10px_rgba(255,60,70,0.8)] hover:shadow-[0_0px_20px_rgba(255,60,70,0.9)] text-sm md:text-base"
        @click="scrollToFlowers"
      >
        Каталог
      </button>
    </div>
    <div
      class="flex flex-col sm:flex-row pt-6 md:pt-8 max-w-[95%] xs:max-w-[91%] m-auto justify-between items-start sm:items-center gap-4 sm:gap-0"
      ref="targetDiv"
    >
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold">Каталог</h1>
      <div class="relative w-full sm:w-auto">
        <button
          @click="toggleDropdown"
          class="cursor-pointer transition flex items-center gap-2 px-4 py-2 border-2 rounded-md border-gray-300 bg-white hover:bg-gray-50 w-full sm:w-auto justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          <span>Фильтры</span>
        </button>
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="dropdownOpen"
            class="absolute right-0 mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50 p-4"
          >
            <div class="mb-4">
              <h3 class="font-medium mb-2">Сортировка</h3>
              <div class="flex flex-col space-y-2">
                <button
                  @click="selectSortOption('name')"
                  :class="{ 'bg-gray-100': sortBy === 'name' }"
                  class="cursor-pointer transition text-left px-3 py-1 rounded hover:bg-gray-100"
                >
                  По названию
                </button>
                <button
                  @click="selectSortOption('price')"
                  :class="{ 'bg-gray-100': sortBy === 'price' }"
                  class="cursor-pointer transition text-left px-3 py-1 rounded hover:bg-gray-100"
                >
                  По цене (дорогие сначала)
                </button>
                <button
                  @click="selectSortOption('-price')"
                  :class="{ 'bg-gray-100': sortBy === '-price' }"
                  class="cursor-pointer transition text-left px-3 py-1 rounded hover:bg-gray-100"
                >
                  По цене (дешевые сначала)
                </button>
              </div>
            </div>
            <div>
              <h3 class="font-medium mb-2">Поиск</h3>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  class="w-full border-2 border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm md:text-base"
                  type="search"
                  placeholder="Найти букет..."
                />
                <img
                  src="../assets/search-svgrepo-com.svg"
                  class="absolute max-w-4 md:max-w-5 left-2 top-2.5 md:top-3"
                  alt="Поиск"
                />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div v-if="!isLoaded" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">Загружаем букеты...</p>
    </div>

    <template v-else>
      <div v-if="filteredProducts.length === 0" class="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 mx-auto text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="text-xl font-medium mt-4">Ничего не найдено</h3>
        <p class="text-gray-600 mt-2">По запросу "{{ searchQuery }}" букеты не найдены</p>
        <button
          @click="searchQuery = ''"
          class="cursor-pointer mt-4 text-gradient opacity-100 hover:opacity-80 font-medium"
        >
          Сбросить поиск
        </button>
      </div>

      <ItemList v-else :products="filteredProducts" />
    </template>
  </main>
</template>
