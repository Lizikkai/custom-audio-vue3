<template>
  <div>Hello Vue</div>
  <span>{{ number }}</span>
  <el-button>按钮</el-button>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'

import { ref } from "vue"
const number = ref<number>(0)
</script>

<style scoped lang="scss"></style>
