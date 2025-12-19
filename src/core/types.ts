export type Cleanup = () => void

export interface Behavior {
  destroy: Cleanup
  update?: () => void
}
