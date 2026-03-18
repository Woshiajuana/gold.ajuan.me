import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import versionFile from 'vite-plugin-version-file'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import postCssPxToRem from 'postcss-pxtorem'
import { VantResolver } from '@vant/auto-import-resolver'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.__BASE__ || '/',
  plugins: [
    vue(),
    vueJsx(),
    versionFile({
      source: JSON.stringify({ status: 0, data: Date.now() }),
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'typings/auto-imports.d.ts',
      resolvers: [VantResolver()],
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dts: 'typings/components.d.ts',
      extensions: ['ts', 'jsx', 'tsx', 'js', 'vue'],
      directoryAsNamespace: true,
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  css: {
    postcss: {
      plugins: [postCssPxToRem({ rootValue: 37.5, propList: ['*'] })],
    },
  },
})
