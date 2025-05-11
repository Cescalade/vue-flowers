import { defineStore } from 'pinia'

export const useLoginDrawerStore = defineStore('loginDrawer', {
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
