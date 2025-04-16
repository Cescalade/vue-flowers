<script setup>
import { ref, onMounted, watch } from 'vue'
import ItemList from '@/components/ItemList.vue'
import { useOrder } from '../../composable/useOrder'
import { useProducts } from '../../composable/useProducts'

const { products, getProducts } = useProducts()
const sortBy = ref('name')

const sortProducts = async (value) => {
  if (value === 'name') {
    products.value.sort((a, b) => a.title.localeCompare(b.title))
  } else if (value === 'price') {
    products.value.sort((a, b) => b.price - a.price)
  } else if (value === '-price') {
    products.value.sort((a, b) => a.price - b.price)
  }
}

watch(sortBy, async (newValue) => {
  if (newValue === 'price' || newValue === '-price') {
    const sortedProducts = await useOrder(newValue.replace('-', ''))
    products.value = sortedProducts
    if (newValue === '-price') {
      products.value.reverse()
    }
  } else {
    sortProducts(newValue)
  }
})

onMounted(getProducts)
</script>

<template>
  <main>
    <div class="flex mt-8 max-w-11/12 m-auto justify-between items-center">
      <h1 class="text-5xl">Flowers</h1>
      <div class="flex">
        <select v-model="sortBy" class="border-2 rounded-md border-gray-300">
          <option value="name">By name</option>
          <option value="price">By price(high - low)</option>
          <option value="-price">By price(low - high)</option>
        </select>
        <div class="relative">
          <img
            src="../assets/search-svgrepo-com.svg"
            class="absolute max-w-5 left-2 top-3"
            alt=""
          />
          <input
            class="border-2 border-gray-300 rounded-md py-2 pl-10"
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>
    </div>
    <ItemList :products="products" />
  </main>
</template>
