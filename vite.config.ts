import { fileURLToPath, URL } from 'node:url'

import { VantResolver } from '@vant/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import postCssPxToRem from 'postcss-pxtorem'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import versionFile from 'vite-plugin-version-file'

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
      resolvers: [VantResolver(), ElementPlusResolver()],
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dts: 'typings/components.d.ts',
      extensions: ['ts', 'jsx', 'tsx', 'js', 'vue'],
      directoryAsNamespace: true,
      resolvers: [VantResolver(), ElementPlusResolver()],
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
