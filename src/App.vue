<script setup>
import Header from './components/Header.vue'
import defaultLayout from '../layouts/default.vue'
import Drawer from './components/Drawer.vue'
</script>

<template>
  <defaultLayout>
    <Header class="z-5" />
    <Drawer />
    <router-view></router-view>
  </defaultLayout>
</template>
