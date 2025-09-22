## 📦 安装

```bash
npm install vue3-custom-audio-player
```

### 局部注册

```vue
<template>
  <div class="audio-container">
    <CustomAudio 
      :audio-url="music" 
      :showVolumn="true" 
      :showSpeed="true"
      :speedOptions="[0.5, 1, 1.25, 1.5, 2]"
      ref="audioRef"
    >
      <template #action>
        <button @click="handleBack">快退</button>
        <button @click="handleToggle">播放/暂停</button>
        <button @click="handleForward">快进</button>
      </template>
    </CustomAudio>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CustomAudio } from 'vue3-custom-audio-player'
import 'vue3-custom-audio-player/dist/style.css'
const audioRef = ref<InstanceType<typeof CustomAudio>>()

// 播放/暂停切换
function handleToggle() {
  if (audioRef.value) {
    // 可以通过暴露的方法控制播放状态
    audioRef.value.play() // 或 audioRef.value.pause()
  }
}

// 快退
function handleBack() {
  if (audioRef.value) {
    audioRef.value.back()
  }
}

// 快进
function handleForward() {
  if (audioRef.value) {
    audioRef.value.forward()
  }
}
</script>
```

### 全局注册
```typescript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import CustomAudioVue from 'vue3-custom-audio-player'
import 'vue3-custom-audio-player/dist/style.css'

const app = createApp(App)
app.use(CustomAudioVue)
app.mount('#app')
```

### Props

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| audioUrl | 音频文件路径 | `string` | - | ✅ |
| showVolumn | 是否显示音量控制 | `boolean` | `false` | ❌ |
| showSpeed | 是否显示倍速控制 | `boolean` | `false` | ❌ |
| speedOptions | 可选的倍速选项 | `number[]` | `[0.5, 1, 1.5, 2]` | ❌ |
| bufferedColor | 缓冲条颜色 | `string` | `transparent` | ❌ |
| currentTrackColor | 当前播放进度条颜色 | `string` | `#B7D8FF` | ❌ |
| currentTrackCircleColor | 当前播放进度条的圆点颜色 | `string` | `#387FFF` | ❌ |

### Slot

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| action | 自定义操作区域 | - |

### Expose

通过 `ref` 可以调用以下方法：

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| play() | 播放音频 | - | `void` |
| pause() | 暂停音频 | - | `void` |
| forward() | 快进15秒 | - | `void` |
| back() | 快退15秒 | - | `void` |

## 📄 License

MIT

## 👨‍💻 Author

**Lizikkai**
- Email: 1980372249@qq.com