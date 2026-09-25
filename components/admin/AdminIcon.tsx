import type { AdminNavIcon } from "@/lib/admin/nav";
import type { ReactNode } from "react";

const paths: Record<AdminNavIcon, ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="5" rx="2" />
      <rect x="13" y="10" width="8" height="11" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
    </>
  ),
  leads: (
    <>
      <path d="M4 6h16v12H4z" />
      <path d="M8 10h8M8 14h5" />
    </>
  ),
  analytics: (
    <>
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
    </>
  ),
  menu: (
    <>
      <path d="M6 7h12M6 12h12M6 17h8" />
    </>
  ),
  bookings: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M4 11h16" />
    </>
  ),
};

export default function AdminIcon({
  name,
  className,
}: {
  name: AdminNavIcon;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}
