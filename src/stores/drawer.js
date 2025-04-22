import { defineStore } from 'pinia'

export const useDrawerStore = defineStore('drawer', {
  state: () => ({
    isOpen: false,
  }),
  actions: {
    open() {
      this.isOpen = true
      document.body.style.overflow = 'hidden'
    },
    close() {
      this.isOpen = false
      document.body.style.overflow = ''
    },
  },
})
