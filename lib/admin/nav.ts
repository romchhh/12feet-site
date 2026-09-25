export type AdminNavIcon =
  | "dashboard"
  | "leads"
  | "bookings"
  | "menu"
  | "analytics";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: AdminNavIcon;
  badge?: string;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Дашборд", icon: "dashboard" },
  { href: "/admin/leads", label: "Заявки", icon: "leads" },
  { href: "/admin/bookings", label: "Бронирования", icon: "bookings" },
  { href: "/admin/menu", label: "Меню", icon: "menu" },
  { href: "/admin/analytics", label: "Аналитика", icon: "analytics" },
];

export function getAdminPageTitle(pathname: string) {
  const item = ADMIN_NAV.find((nav) => pathname.startsWith(nav.href));
  return item?.label ?? "Админ-панель";
}
