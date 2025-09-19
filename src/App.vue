<template>
  <div>Hello Vue</div>
  <span>{{ number }}</span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const number = ref<number>(0)
</script>

<style scoped lang="scss"></style>
