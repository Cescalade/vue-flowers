<script setup>
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
const props = defineProps({
  id: String,
  imgUrl: String,
  title: String,
  price: Number,
  quantity: Number,
})

const update = (newQuantity) => {
  cartStore.updateQuantity(props.id, newQuantity)
}

const remove = () => {
  cartStore.removeItem(props.id)
}
</script>

<template>
  <div class="mt-5 flex items-end gap-4 w-full border border-slate-200 p-4 rounded-xl relative">
    <!-- не забыть подставить с бейза -->
    <img
      :src="`/flowers-pic/${imgUrl}`"
      class="w-32 row-span-2 max-h-40"
      src="/flowers-pic/flowers_1.png"
      alt="Pic"
    />
    <div class="flex flex-col">
      <p>{{ title }}</p>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2">
          <button
            @click="update(quantity - 1)"
            class="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-gray-800"
          >
            -
          </button>

          <input
            type="number"
            :value="quantity"
            @input="update($event.target.valueAsNumber)"
            class="w-16 text-center font-medium bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 py-1 px-3 [-webkit-appearance:textfield] [-moz-appearance:textfield] [appearance:textfield]"
            min="1"
          />

          <button
            @click="update(quantity + 1)"
            class="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-gray-800"
          >
            +
          </button>
        </div>
      </div>
      <b>{{ (price * quantity).toFixed(2) }} руб</b>
    </div>
    <button
      @click="remove"
      class="opacity-50 hover:opacity-100 transition cursor-pointer absolute z-40 top-3 right-3"
    >
      <img src="/cross.svg" alt="" class="w-4" />
    </button>
  </div>
</template>
