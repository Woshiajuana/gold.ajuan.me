// 触发一次短振动
export function vibrate(pattern: VibratePattern = 200) {
  navigator?.vibrate?.(pattern)
}
