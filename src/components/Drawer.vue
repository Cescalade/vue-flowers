<script setup>
import CartItemList from './CartItemList.vue'
import { useCartStore } from '@/stores/cartStore'
import { useDrawerStore } from '@/stores/drawer'
import router from '@/router'

const cartStore = useCartStore()
const drawer = useDrawerStore()

const handlePayment = () => {
  router.push({ name: 'checkout' })
  drawer.close()
}
</script>

<template>
  <div
    v-show="drawer.isOpen"
    @click="drawer.close()"
    class="fixed top-0 left-0 h-full w-full bg-black z-10 transition-all duration-300"
    :class="{
      'opacity-70 pointer-events-auto': drawer.isOpen,
      'opacity-0 pointer-events-none': !drawer.isOpen,
    }"
  ></div>
  <div
    class="bg-white w-112 h-full fixed flex flex-col justify-between right-0 top-0 z-11 p-8 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transform transition-transform duration-300 ease-in-out"
    :class="{ 'translate-x-0': drawer.isOpen, 'translate-x-full': !drawer.isOpen }"
  >
    <div>
      <div class="flex gap-5">
        <button
          @click="drawer.close()"
          class="text-2xl font-bold origin-center rotate-180 opacity-30 hover:opacity-100 hover:-translate-x-1 cursor-pointer transition"
        >
          ➜
        </button>
        <h2 class="text-2xl font-bold">Корзина</h2>
      </div>
      <CartItemList />
    </div>

    <div class="mt-12 flex flex-col gap-2">
      <div class="text-xl flex justify-between">
        <p>Итого:</p>
        <b>{{ cartStore.totalPrice.toFixed(2) }} руб</b>
      </div>
      <button
        @click="handlePayment"
        :disabled="cartStore.items.length === 0"
        class="bg-gray-300 rounded-xl h-12 font-bold text-2xl cursor-pointer hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Pay
      </button>
    </div>
  </div>
</template>
