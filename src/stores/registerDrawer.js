import { defineStore } from 'pinia'

export const useRegisterDrawerStore = defineStore('registerDrawer', {
  state: () => ({
    isOpen: false,
  }),
  actions: {
    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    },
  },
})
