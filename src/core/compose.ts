import type { Behavior } from './types'

export function compose(...behaviors: Behavior[]): Behavior {
  return {
    update() {
      for (const b of behaviors) b.update?.()
    },
    destroy() {
      for (const b of [...behaviors].reverse()) b.destroy()
    }
  }
}
