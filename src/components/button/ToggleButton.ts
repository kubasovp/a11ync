import { Button } from './Button';
import { ButtonOptions } from './types';
import { dispatchCustomEvent } from './utils';

export class ToggleButton extends Button {
  private _pressed: boolean;

  constructor(el: Element, options: ButtonOptions = {}) {
    super(el, { ...options, type: 'toggle' });
    this._pressed = !!(options.pressed ?? (el.getAttribute('aria-pressed') === 'true'));
    this.setupToggle();
  }

  private setupToggle() {
    this.syncAriaPressed(this._pressed);

    // слушаем нормализованный клик
    const onToggleClick = () => {
      if (this.isDisabled()) return;
      this.toggle();
    };

    // слушаем internal event, чтобы не дублировать чужие click-handlers
    this.el.addEventListener('a11ync:click', onToggleClick as EventListener);
  }

  toggle(value?: boolean) {
    const newVal = typeof value === 'boolean' ? value : !this._pressed;
    if (newVal === this._pressed) return newVal;
    this._pressed = newVal;
    this.syncAriaPressed(newVal);
    // dispatch DOM event 'toggle' with detail { pressed: boolean }
    dispatchCustomEvent(this.el, 'toggle', { pressed: newVal }, { bubbles: true });
    // call onToggle handler if provided in options
    this.options.onToggle?.(newVal);
    return newVal;
  }

  private syncAriaPressed(v: boolean) {
    this.el.setAttribute('aria-pressed', v ? 'true' : 'false');
  }

  get pressed() { return this._pressed; }
  set pressed(v: boolean) { this.toggle(v); }
}
