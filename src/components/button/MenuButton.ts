import { Button } from './Button';
import { ButtonOptions } from './types';
import { dispatchCustomEvent } from './utils';

export class MenuButton extends Button {
  private _expanded: boolean;

  constructor(el: Element, options: ButtonOptions = {}) {
    super(el, { ...options, type: 'menu' });
    this._expanded = !!(options.expanded ?? (el.getAttribute('aria-expanded') === 'true'));
    this.initMenuAttrs();
    this.setupToggle();
  }

  private initMenuAttrs() {
    this.el.setAttribute('aria-haspopup', 'menu');
    this.syncExpanded(this._expanded);
  }

  private setupToggle() {
    const onClick = () => {
      if (this.isDisabled()) return;
      this.toggle();
    };
    this.el.addEventListener('a11ync:click', onClick as EventListener);
  }

  toggle(value?: boolean) {
    const newVal = typeof value === 'boolean' ? value : !this._expanded;
    if (newVal === this._expanded) return newVal;
    this._expanded = newVal;
    this.syncExpanded(newVal);
    dispatchCustomEvent(this.el, newVal ? 'open' : 'close', { expanded: newVal }, { bubbles: true });
    return newVal;
  }

  private syncExpanded(v: boolean) {
    this.el.setAttribute('aria-expanded', v ? 'true' : 'false');
  }

  get expanded() { return this._expanded; }
  set expanded(v: boolean) { this.toggle(v); }
}
