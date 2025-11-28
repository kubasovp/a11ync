export type ButtonTag = keyof HTMLElementTagNameMap | string;

export interface ButtonOptions {
  type?: 'basic' | 'toggle' | 'menu';
  pressed?: boolean;
  disabled?: boolean;
  expanded?: boolean;
  onToggle?: (pressed: boolean) => void;
  onClick?: (event: MouseEvent | KeyboardEvent) => void;
}
