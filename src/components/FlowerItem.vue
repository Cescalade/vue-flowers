<script setup>
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()

const props = defineProps({
  id: String,
  imgUrl: String,
  title: String,
  price: Number,
})

const addToCart = () => {
  cartStore.addItem({
    id: props.id,
    title: props.title,
    price: props.price,
    imgUrl: props.imgUrl,
  })
}
</script>

<template>
  <div
    class="group relative flex flex-col h-full bg-white rounded-4xl shadow-md transition hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden"
  >
    <div class="p-4 flex gap-2 flex-col flex-grow justify-evenly">
      <img class="max-h-40 mx-auto" :src="`flowers-pic/${imgUrl}`" alt="Pic" />
      <div class="flex flex-col">
        <p class="text-center">{{ title }}</p>
        <span class="text-center">price: {{ price }}</span>
      </div>
    </div>

    <button
      class="cursor-pointer w-full text-white py-3 bg-[#f26545] translate-y-20 group-hover:translate-y-0 group-hover:h- transition-all duration-300 hover:bg-red-400 flex items-center justify-center"
      @click.prevent="addToCart"
    >
      В Корзину
    </button>
  </div>
</template>
