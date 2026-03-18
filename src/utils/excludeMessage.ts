export function excludeMessage(message: string) {
  return (
    ['', 'cancel'].includes(message) || message?.includes('cancel') || message?.includes('cancle')
  )
}
