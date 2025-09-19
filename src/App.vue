<template>
  <div class="audio-container">
    <CustomAudio :audio-url="music" showVolumn showSpeed ref="audioRef">
      <template #action="{ isPlaying }">
        <div class="audio-container-A" @click="go('back')">A</div>
        <div class="audio-container-B" @click="toggle(isPlaying)">B</div>
        <div class="audio-container-C" @click="go('forward')">C</div>
      </template>
    </CustomAudio>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomAudio from './components/CustomAudio.vue'
import music from './assets/sound/严艺丹 - 人世太匆忙.mp3'
const audioRef = ref<typeof CustomAudio>()

function toggle(isPlaying: boolean) {
  console.log('toggle ==>', isPlaying)
  if (audioRef.value) {
    if (isPlaying) {
      audioRef.value.pause()
    } else {
      audioRef.value.play()
    }
  }
}

function go(type: 'back' | 'forward') {
  if (audioRef.value) {
    if(type === 'forward') {
      audioRef.value.forward(20)
    }else {
      audioRef.value.back(20)
    }
  }
}


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
