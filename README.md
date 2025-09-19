# Custom Audio Vue

一个基于 Vue 3 + TypeScript 的自定义音频播放器组件库。提供了完整的音频播放控制功能，包括播放/暂停、进度控制、音量调节、倍速播放、快进/快退等功能。

## ✨ 特性

- 🎵 完整的音频播放控制
- 🎛️ 音量调节滑块
- ⚡ 倍速播放选择
- ⏩ 快进/快退功能（15秒）
- 🎨 现代化 UI 设计
- 📱 响应式布局
- 🔧 TypeScript 支持
- 🎯 插槽支持，可自定义操作区域

## 📦 安装

```bash
npm install custom-audio
```

## 🚀 快速开始

### 基础用法

```vue
<template>
  <div class="audio-container">
    <CustomAudio 
      :audio-url="audioUrl" 
      :showVolumn="true" 
      :showSpeed="true"
    />
  </div>
</template>

<script setup lang="ts">
import CustomAudio from 'custom-audio'
import audioFile from './assets/audio.mp3'

const audioUrl = audioFile
</script>

<style>
.audio-container {
  padding: 12px;
  max-width: 640px;
  height: 84px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}
</style>
```

### 高级用法（带插槽和方法调用）

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
import CustomAudio from 'custom-audio'
import music from './assets/audio.mp3'

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

## 📋 API 文档

### Props

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| audioUrl | 音频文件路径 | `string` | - | ✅ |
| showVolumn | 是否显示音量控制 | `boolean` | `false` | ❌ |
| showSpeed | 是否显示倍速控制 | `boolean` | `false` | ❌ |
| speedOptions | 可选的倍速选项 | `number[]` | `[0.5, 1, 1.5, 2]` | ❌ |

### 插槽

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| action | 自定义操作区域 | - |

### 暴露的方法

通过 `ref` 可以调用以下方法：

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| play() | 播放音频 | - | `void` |
| pause() | 暂停音频 | - | `void` |
| forward() | 快进15秒 | - | `void` |
| back() | 快退15秒 | - | `void` |

## 🛠️ 开发

```bash
# 克隆项目
git clone <repository-url>

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建库
npm run build:lib

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 📄 License

MIT

## 👨‍💻 作者

**Lizikkai**
- Email: 1980372249@qq.com