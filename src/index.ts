import type { App } from 'vue'
import CustomAudio from './components/CustomAudio.vue'

// 导出组件
export { default as CustomAudio } from './components/CustomAudio.vue'

// 导出工具函数
export * from './utils'

// Vue 插件安装函数
const install = (app: App) => {
  app.component('CustomAudio', CustomAudio)
}

// 默认导出
export default {
  install,
  CustomAudio
}
