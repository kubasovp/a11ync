export function assertElement(
  el: Element | null,
  name: string
): asserts el is HTMLElement {
  if (!el) {
    throw new Error(`[a11y] ${name}: element is required`)
  }
}
