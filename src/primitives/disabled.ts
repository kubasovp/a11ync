import type { Behavior } from '../core/types'

export function useDisabled(
  el: HTMLButtonElement,
  disabled: () => boolean
): Behavior {
  const prev = el.disabled

  function update() {
    el.disabled = disabled()
  }

  update()

  return {
    update,
    destroy() {
      el.disabled = prev
    }
  }
}
