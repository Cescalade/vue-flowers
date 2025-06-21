<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '../../composable/useProducts'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
const { products, getProducts } = useProducts()
const route = useRoute()
const foundProduct = ref()
const isAdded = ref(false)

const findProductById = (id) => {
  return products.value.find((product) => product.id === id)
}

const addToCart = () => {
  cartStore.addItem({
    id: foundProduct.value.id,
    title: foundProduct.value.title,
    price: foundProduct.value.price,
    imgUrl: foundProduct.value.imgUrl,
  })

  isAdded.value = true
  setTimeout(() => (isAdded.value = false), 2000)
}

onMounted(async () => {
  await getProducts()
  foundProduct.value = findProductById(route.params.id.toString())
})
</script>

<template>
  <div v-if="!foundProduct" class="flex items-center justify-center min-h-screen">
    <div class="text-center">
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
      <h3 class="text-xl font-medium mt-4">Продукт не найден</h3>
      <p class="text-gray-600 mt-2">Извините, запрашиваемый букет отсутствует в каталоге</p>
      <router-link
        to="/"
        class="mt-6 inline-block px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition shadow-md"
      >
        Вернуться в каталог
      </router-link>
    </div>
  </div>

  <main v-else class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6">
    <div class="max-w-6xl w-full">
      <div class="flex flex-col lg:flex-row gap-8 sm:gap-10">
        <div class="lg:w-1/2 flex justify-center">
          <div
            class="relative w-full max-w-md aspect-square overflow-hidden rounded-2xl shadow-xl group"
          >
            <img
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              :src="`/flowers-pic/${foundProduct.imgUrl}`"
              :alt="foundProduct.title"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"
            ></div>
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 class="text-2xl sm:text-3xl font-bold">{{ foundProduct.title }}</h1>
              <div class="flex items-center mt-2">
                <span class="text-xl font-semibold">{{ foundProduct.price }} руб.</span>
                <span class="ml-4 text-sm line-through text-gray-300" v-if="foundProduct.oldPrice">
                  {{ foundProduct.oldPrice }} руб.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:w-1/2 flex flex-col">
          <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-800 mb-4">Описание букета</h2>
              <p
                class="text-gray-600 leading-relaxed max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-gray-100"
              >
                {{ foundProduct.description || 'Нет подробного описания' }}
              </p>
            </div>

            <div class="mb-8">
              <h2 class="text-xl font-bold text-gray-800 mb-4">Состав букета</h2>
              <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <li
                  v-for="(item, index) in foundProduct.composition"
                  :key="index"
                  class="flex items-center"
                >
                  <svg class="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-gray-600">{{ item }}</span>
                </li>
              </ul>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-4">
              <button
                @click="addToCart"
                class="relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:from-orange-600 hover:to-red-600 transform hover:-translate-y-1 flex items-center justify-center"
                :class="{ '!from-green-500 !to-green-600': isAdded }"
              >
                <span v-if="!isAdded">Добавить в корзину</span>
                <span v-else class="flex items-center">
                  <svg
                    class="w-5 h-5 text-white mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Добавлено!
                </span>
              </button>

              <router-link
                to="/"
                class="w-full sm:w-auto px-6 py-3 text-center border-2 border-orange-500 text-orange-500 rounded-full font-medium hover:bg-orange-50 transition"
              >
                Назад в каталог
              </router-link>
            </div>
          </div>

          <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white rounded-xl shadow-md p-4 text-center">
              <svg
                class="w-8 h-8 mx-auto text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 class="font-medium mt-2">Доставка за 2 часа</h3>
              <p class="text-sm text-gray-600 mt-1">По всему городу</p>
            </div>

            <div class="bg-white rounded-xl shadow-md p-4 text-center">
              <svg
                class="w-8 h-8 mx-auto text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 class="font-medium mt-2">Надёжная поставка</h3>
              <p class="text-sm text-gray-600 mt-1">Ежедневно из Нидерландов</p>
            </div>

            <div
              class="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
            >
              <svg
                class="w-8 h-8 mx-auto text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  opacity="0.1"
                  d="M4.44905 17.0091C-0.246262 7.83768 7.34063 0.686186 19.5547 3.61251C20.4161 3.81888 21.0082 4.6099 20.9652 5.49458C20.5863 13.288 17.0342 17.7048 6.13264 17.9858C5.43034 18.0039 4.7692 17.6344 4.44905 17.0091Z"
                />
                <path
                  d="M4.44905 17.0091C-0.246262 7.83768 7.34063 0.686186 19.5547 3.61251C20.4161 3.81888 21.0082 4.6099 20.9652 5.49458C20.5863 13.288 17.0342 17.7048 6.13264 17.9858C5.43034 18.0039 4.7692 17.6344 4.44905 17.0091Z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3.99987 21C5.49993 15.5 5.99988 12.5 11.9998 9.99997"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <h3 class="font-medium mt-2">Гарантия</h3>
              <p class="text-sm text-gray-600 mt-1">Только свежие цветы</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #ff4000;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background-color: #f3f4f6;
}

main {
  padding-top: 2rem;
  padding-bottom: 4rem;
}

@media (min-width: 640px) {
  main {
    padding-top: 3rem;
    padding-bottom: 5rem;
  }
}
</style>
