export interface SidebarSection {
  title: string;
  items: {
    label: string;
    href: string;
  }[];
}

export const sidebar: SidebarSection[] = [
  {
    title: "Основы",
    items: [
      { label: "Введение", href: "/" },
    ],
  },
  {
    title: "Компоненты",
    items: [
      { label: "Button", href: "/components/button" },
      { label: "Modal", href: "/components/modal" },
    ],
  },
];
