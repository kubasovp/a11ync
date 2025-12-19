// src/components/button/useButton.ts
import { compose } from '../../core/compose'
import { assertElement } from '../../core/init'
import { useDisabled } from '../../primitives/disabled'
import { useFocus } from '../../primitives/focus'
import { usePress } from '../../primitives/press'

interface ButtonOptions {
  onPress: (event: Event) => void
  disabled?: () => boolean
}

export function useButton(el: Element | null, options: ButtonOptions) {
  assertElement(el, 'useButton')

  if (!(el instanceof HTMLButtonElement)) {
    throw new Error('[a11y] useButton: only <button> is supported')
  }

  const disabled = options.disabled ?? (() => false)

  return compose(
    useFocus(el),
    useDisabled(el, disabled),
    usePress(el, { onPress: options.onPress, disabled })
  )
}
