import type { Plugin } from 'vue'

import { errorHandler } from '@/utils'

export default {
  install(app) {
    app.config.errorHandler = errorHandler
  },
} as Plugin
