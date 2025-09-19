<template>
  <div class="audio-container">
    <CustomAudio :audio-url="music" />
  </div>
</template>

<script setup lang="ts">
import CustomAudio from '@/components/CustomAudio.vue'
import music from '@/assets/sound/严艺丹 - 人世太匆忙.mp3'
</script>

<style scoped lang="scss">
  .audio-container {
    padding: 12px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    max-width: 640px;
    height: 84px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  }
</style>
