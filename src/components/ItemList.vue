<script setup>
import FlowerItem from './FlowerItem.vue'

defineProps({
  products: {},
})
</script>

<template>
  <div
    class="p-4 sm:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4"
  >
    <div v-for="product in products" :key="product.id">
      <router-link :to="{ name: 'card', params: { id: product.id } }">
        <FlowerItem
          :id="product.id"
          :imgUrl="product.imgUrl"
          :title="product.title"
          :price="product.price"
        />
      </router-link>
    </div>
  </div>
</template>
