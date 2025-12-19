import type { Behavior } from '../core/types'

export function useFocus(el: HTMLElement): Behavior {
  el.setAttribute('data-focusable', '')

  return {
    destroy() {
      el.removeAttribute('data-focusable')
    }
  }
}
