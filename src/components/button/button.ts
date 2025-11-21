export interface ButtonOptions {
  disabled?: boolean;
}

type ButtonEvents = "click";

export class Button {
  #el: HTMLButtonElement | HTMLElement;
  #listeners = new Map<ButtonEvents, Set<(...args: any[]) => void>>();

  constructor(el: HTMLElement, options: ButtonOptions = {}) {
    this.#el = el;

    this.#setupRole();
    this.disabled = options.disabled ?? this.#el.hasAttribute("disabled");

    this.#bindHandlers();
  }

  // --- Private ------------------------------

  #setupRole() {
    if (this.#el instanceof HTMLButtonElement) return;
    if (!this.#el.hasAttribute("role")) this.#el.setAttribute("role", "button");
    if (!this.#el.hasAttribute("tabindex")) this.#el.setAttribute("tabindex", "0");
  }

  #bindHandlers() {
    this.#el.addEventListener("click", (e) => {
      if (this.disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      this.#emit("click", e);
    });

    this.#el.addEventListener("keydown", (e) => {
      if (this.disabled) return;

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        this.#el.click();
      }
    });
  }

  #emit(event: ButtonEvents, payload: any) {
    const handlers = this.#listeners.get(event);
    if (!handlers) return;
    handlers.forEach((fn) => fn(payload));
  }

  // --- Public API ---------------------------

  on(event: ButtonEvents, callback: (ev: any) => void) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event)!.add(callback);
    return this;
  }

  off(event: ButtonEvents, callback: (ev: any) => void) {
    this.#listeners.get(event)?.delete(callback);
    return this;
  }

  set disabled(value: boolean) {
    if (value) {
      this.#el.setAttribute("disabled", "");
      this.#el.setAttribute("aria-disabled", "true");
      this.#el.setAttribute("tabindex", "-1");
    } else {
      this.#el.removeAttribute("disabled");
      this.#el.setAttribute("aria-disabled", "false");
      if (!(this.#el instanceof HTMLButtonElement)) {
        this.#el.setAttribute("tabindex", "0");
      }
    }
  }

  get disabled(): boolean {
    return this.#el.hasAttribute("disabled");
  }
}
