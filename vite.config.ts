import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 动态导入 unplugin-element-plus 以避免 ESM 问题
// async function createElementPlusPlugin() {
//   try {
//     const { default: ElementPlus } = await import('unplugin-element-plus/vite')
//     return ElementPlus()
//   } catch (error) {
//     console.warn('unplugin-element-plus not available:', error.message)
//     return null
//   }
// }

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // const elementPlusPlugin = await createElementPlusPlugin()
  const plugins = [vue()]
  
  // if (elementPlusPlugin) {
  //   plugins.push(elementPlusPlugin)
  // }

  if (mode === 'lib') {
    // 库构建模式
    return {
      plugins,
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'CustomAudioVue',
          fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
          // 确保外部化处理那些你不想打包进库的依赖
          external: ['vue'],
          output: {
            // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
            globals: {
              vue: 'Vue',
            },
          },
        },
      },
    }
  } else {
    // 开发模式
    return {
      plugins,
      resolve: {
        alias: {
          '@': resolve(__dirname, 'src'),
        },
      },
    }
  }
})
