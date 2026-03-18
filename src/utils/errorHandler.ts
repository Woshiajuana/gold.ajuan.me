import { formatMessage } from '@daysnap/utils'
import { closeToast, showToast } from 'vant'

import { __DEV__ } from './constants'
import { excludeMessage } from './excludeMessage'

// global error handler
export const errorHandler = (err: unknown) => {
  // close vant toast
  closeToast()

  const message = formatMessage(err)
  if (message && !excludeMessage(message)) {
    showToast(message)
  }

  // development env 需要抛出异常 方便查看问题
  if (__DEV__) {
    console.error(err)
  }
}
