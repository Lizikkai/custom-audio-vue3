import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(async ({ mode }) => {
  const plugins = [vue()]

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
        // 生成类型声明文件
        emptyOutDir: true,
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
