export type AdminNavIcon =
  | "dashboard"
  | "leads"
  | "analytics"
  | "menu"
  | "bookings";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: AdminNavIcon;
  badge?: string;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Дашборд", icon: "dashboard" },
  { href: "/admin/leads", label: "Заявки", icon: "leads" },
  { href: "/admin/bookings", label: "Бронювання", icon: "bookings" },
  { href: "/admin/menu", label: "Меню", icon: "menu" },
  { href: "/admin/analytics", label: "Аналітика", icon: "analytics" },
];

export function getAdminPageTitle(pathname: string) {
  const item = ADMIN_NAV.find((entry) => pathname.startsWith(entry.href));
  return item?.label ?? "Адмін-панель";
}
