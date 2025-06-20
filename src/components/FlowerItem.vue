<script setup>
import { useCartStore } from '@/stores/cartStore'
import { ref } from 'vue'

const cartStore = useCartStore()
const isAdded = ref(false)

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

  isAdded.value = true
  setTimeout(() => (isAdded.value = false), 2000)
}
</script>

<template>
  <div
    class="group relative flex flex-col h-full bg-white rounded-3xl sm:rounded-4xl shadow-md transition hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden"
  >
    <div class="p-3 sm:p-4 flex gap-2 flex-col flex-grow justify-evenly">
      <img
        class="max-h-28 xs:max-h-32 sm:max-h-40 mx-auto"
        :src="`flowers-pic/${imgUrl}`"
        alt="Pic"
      />
      <div class="flex flex-col px-1">
        <p class="text-center text-sm sm:text-base">{{ title }}</p>
        <span class="text-center text-sm sm:text-base mt-1">price: {{ price }}</span>
      </div>
    </div>

    <button
      class="relative cursor-pointer w-full text-white py-2 sm:py-3 bg-[#f26545] md:translate-y-20 md:group-hover:translate-y-0 transition-all duration-300 hover:bg-red-400 flex items-center justify-center text-sm sm:text-base"
      :class="{
        '!bg-green-500': isAdded,
        'hover:!bg-green-500': isAdded,
      }"
      @click.prevent="addToCart"
    >
      <span :class="{ 'opacity-0': isAdded }">В Корзину</span>

      <div
        v-if="isAdded"
        class="absolute inset-0 flex items-center justify-center animate-ping-once"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="ml-2">Добавлено!</span>
      </div>
    </button>
  </div>
</template>

<style>
@keyframes ping-once {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  75%,
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-ping-once {
  animation: ping-once 0.8s cubic-bezier(0, 0, 0.2, 1) 1;
}
</style>
