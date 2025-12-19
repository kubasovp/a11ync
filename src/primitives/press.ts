import type { Behavior } from '../core/types'

interface PressOptions {
  onPress: (event: Event) => void
  disabled?: () => boolean
}

export function usePress(el: HTMLButtonElement, options: PressOptions): Behavior {
  const isDisabled = options.disabled ?? (() => false)

  function onClick(e: MouseEvent) {
    if (isDisabled()) return
    options.onPress(e)
  }

  el.addEventListener('click', onClick)

  return {
    destroy() {
      el.removeEventListener('click', onClick)
    }
  }
}
