import { formatMessage, isFunction } from '@daysnap/utils'
import { type DialogOptions, showConfirmDialog, showToast } from 'vant'

import { excludeMessage } from '@/utils'

type ToastCallback = ((err: unknown, message: string) => boolean | void) | boolean

declare global {
  interface Promise<T> {
    toast(cb?: ToastCallback): Promise<T>
    null(): Promise<T>
    fix(): Promise<T>
    dialog(options: DialogOptions): Promise<T>
  }
}

// toast
Promise.prototype.toast = async function (cb) {
  try {
    return await this
  } catch (err) {
    const message = formatMessage(err)

    if (isFunction(cb) && !cb(err, message)) {
      return
    }

    if (cb !== false && !excludeMessage(message)) {
      showToast(message)
    }
  }
}

// 修正 分页数据 没有 total 的问题
Promise.prototype.fix = async function () {
  try {
    return await this
  } catch (err: any) {
    if (err?.msg?.includes('无数据')) {
      return Promise.resolve([])
    }
    throw err
  }
}

// null only log err
Promise.prototype.null = async function () {
  try {
    return await this
  } catch (err) {
    return console.log(err)
  }
}

Promise.prototype.dialog = async function (options: DialogOptions & { throwNullError?: boolean }) {
  try {
    return await this
  } catch (err) {
    const message = formatMessage(err)
    await showConfirmDialog(Object.assign({}, options, { message }))
    if (options.throwNullError) {
      throw ''
    }
  }
}
