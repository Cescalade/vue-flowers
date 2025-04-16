<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '../../composable/useProducts'

const { products, getProducts } = useProducts()

const route = useRoute()
const foundProduct = ref()
const findProductById = (id) => {
  return products.value.find((product) => product.id === id)
}

onMounted(async () => {
  await getProducts()
  foundProduct.value = findProductById(route.params.id.toString())
})
</script>

<template>
  <main class="flex flex-col items-center justify-center min-h-screen p-4" v-if="foundProduct">
    <div class="max-w-md w-full">
      <img
        class="w-full h-auto rounded-lg shadow-lg"
        :src="`/flowers-pic/${foundProduct.imgUrl}`"
        alt="pic"
      />
      <div class="mt-4 text-center">
        <h1 class="text-xl font-semibold">{{ foundProduct.title }}</h1>
        <p class="text-gray-600">Цена: {{ foundProduct.price }} руб.</p>
        <p class="text-gray-800 text-left break-words">{{ foundProduct.description }}</p>
      </div>
    </div>
  </main>
  <div v-else class="flex items-center justify-center min-h-screen">Продукт не найден</div>
</template>
