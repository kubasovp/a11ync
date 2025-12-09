import { ButtonOptions } from './types';
import { dispatchCustomEvent, isNativeButton, warnCustomTag } from './utils';

/**
 * Button — базовый класс.
 * idempotent init/destroy, защита от повторной инициализации.
 */

type HandlerRefs = {
  click?: EventListener;
  keydown?: EventListener;
	extensions?: { type: string; handler: EventListener }[];
};

const INSTANCES = new WeakMap<Element, Button>();
const HANDLERS = new WeakMap<Element, HandlerRefs>();
const ORIGINAL = new WeakMap<Element, { attrs: Record<string, string | null> }>();

export class Button {
  public el!: Element;
  public options!: ButtonOptions;

  constructor(el: Element, options: ButtonOptions = {}) {
    // Если экземпляр уже есть — обновляем options и возвращаем существующий (idempotence)
    const existing = INSTANCES.get(el);
    if (existing) {
      existing.options = { ...existing.options, ...options };
      return existing;
    }

    this.el = el;
    this.options = { type: 'basic', ...options };
    INSTANCES.set(el, this);
    // сохраняем оригинальные атрибуты для возможного восстановления
    ORIGINAL.set(el, { attrs: snapshotAttrs(el, ['role', 'tabindex', 'aria-disabled', 'disabled', 'aria-pressed', 'aria-haspopup', 'aria-expanded']) });
    this.init();
  }

  static from(el: Element): Button | undefined {
    return INSTANCES.get(el);
  }

	protected registerExtensionHandler(type: string, handler: EventListener): void {
		let refs = HANDLERS.get(this.el);
		if (!refs) {
			refs = {};
			HANDLERS.set(this.el, refs);
		}

		(refs.extensions ??= []).push({ type, handler });
		this.el.addEventListener(type, handler);
	}


  init(): this {
    if (HANDLERS.has(this.el)) return this;

    if (!isNativeButton(this.el)) {
      warnCustomTag(this.el);
      this.el.setAttribute('role', 'button');
      if (!this.el.hasAttribute('tabindex')) this.el.setAttribute('tabindex', '0');
    }

    // disabled handling
    this.syncDisabled(this.options.disabled ?? false);

    // click + keyboard handlers for non-button to emulate native behaviour
    const onClick = (e: Event) => {
      if (this.isDisabled()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      this.options.onClick?.(e as MouseEvent | KeyboardEvent);
      // dispatch normalized "a11ync:click" to allow internal extensions to listen consistently
      dispatchCustomEvent(this.el, 'a11ync:click', null, { bubbles: true });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (this.isDisabled()) return;

      // emulate Enter / Space for non-native buttons
      if (!isNativeButton(this.el) && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        (this.el as HTMLElement).click?.();
      }
    };

    this.el.addEventListener('click', onClick as EventListener);
    this.el.addEventListener('keydown', onKeyDown as EventListener);

    HANDLERS.set(this.el, { click: onClick as EventListener, keydown: onKeyDown as EventListener });
    return this;
  }

  destroy(): void {
    const handlers = HANDLERS.get(this.el);
    if (handlers) {
      if (handlers.click) this.el.removeEventListener('click', handlers.click);
      if (handlers.keydown) this.el.removeEventListener('keydown', handlers.keydown);
			if (handlers.extensions) {
				for (const { type, handler } of handlers.extensions) {
					this.el.removeEventListener(type, handler);
				}
			}
      HANDLERS.delete(this.el);
    }
    // восстановить оригинальные атрибуты
    const orig = ORIGINAL.get(this.el);
    if (orig) {
      restoreAttrs(this.el, orig.attrs);
      ORIGINAL.delete(this.el);
    }
    INSTANCES.delete(this.el);
  }

  isDisabled(): boolean {
    if (isNativeButton(this.el)) return (this.el as HTMLButtonElement).disabled === true;
    return this.el.getAttribute('aria-disabled') === 'true';
  }

  syncDisabled(value: boolean) {
    if (isNativeButton(this.el)) {
      (this.el as HTMLButtonElement).disabled = !!value;
    } else {
      this.el.setAttribute('aria-disabled', value ? 'true' : 'false');
      if (value) {
        // необязательно убирать tabindex, оставляем для фокусировки, но пометим
      }
    }
  }

  // programmatic click
  click(): void {
    if (this.isDisabled()) return;
    (this.el as HTMLElement).click();
  }
}

/* helpers */
function snapshotAttrs(el: Element, names: string[]) {
  const res: Record<string, string | null> = {};
  for (const n of names) res[n] = el.getAttribute(n);
  return res;
}

function restoreAttrs(el: Element, attrs: Record<string, string | null>) {
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null) el.removeAttribute(k);
    else el.setAttribute(k, v);
  }
}
