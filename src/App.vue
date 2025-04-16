<script setup>
import Header from './components/Header.vue'
import defaultLayout from '../layouts/default.vue'
</script>

<template>
  <defaultLayout>
    <Header />
    <router-view></router-view>
  </defaultLayout>
</template>
