export const isNativeButton = (el: Element): el is HTMLButtonElement =>
  el.tagName.toLowerCase() === 'button';

export const warnCustomTag = (el: Element) => {
  if (!isNativeButton(el)) {
    console.warn(
      'a11ync: Использование нестандартного тега для кнопки. ' +
      'Рекомендуется использовать <button>. Будут добавлены role="button" и tabindex="0".',
      el
    );
  }
};

export const dispatchCustomEvent = <T = undefined>(
  el: Element,
  type: string,
  detail?: T,
  options: { bubbles?: boolean; cancelable?: boolean } = {}
) => {
  const ev = new CustomEvent(type, { detail, bubbles: !!options.bubbles, cancelable: !!options.cancelable });
  el.dispatchEvent(ev);
  return ev;
};
