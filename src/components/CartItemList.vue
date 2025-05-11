<script setup>
import CartItem from './CartItem.vue'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
</script>

<template>
  <div v-if="cartStore.isCartLoading" class="p-4 text-center text-gray-500">
    Загрузка корзины...
  </div>
  <div v-else>
    <div class="">
      <CartItem
        v-for="item in cartStore.items"
        :key="item.id"
        :id="item.id"
        :title="item.title"
        :price="item.price"
        :imgUrl="item.imgUrl"
        :quantity="item.quantity"
      />
      <div v-if="cartStore.items.length === 0" class="text-center mt-10 text-gray-500">
        Корзина пуста
      </div>
    </div>
  </div>
</template>
