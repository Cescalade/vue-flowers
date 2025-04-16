<script setup>
import FlowerItem from './FlowerItem.vue'

defineProps({
  products: {},
})
</script>

<template>
  <div class="p-8 grid grid-cols-4 gap-4">
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
