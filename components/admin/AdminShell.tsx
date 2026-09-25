"use client";

import { adminFetch } from "@/components/admin/adminApi";
import AdminIcon from "@/components/admin/AdminIcon";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import styles from "@/components/admin/AdminShell.module.css";
import { ADMIN_NAV, getAdminPageTitle } from "@/lib/admin/nav";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newLeads, setNewLeads] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadBadge() {
      try {
        const data = await adminFetch<{ ok: true; stats: { new: number } }>(
          "/api/admin/leads",
        );
        if (!cancelled) setNewLeads(data.stats.new);
      } catch {
        /* ignore */
      }
    }
    void loadBadge();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const pageTitle = getAdminPageTitle(pathname || "/admin/dashboard");
  const initials = (user?.name || user?.login || "A").slice(0, 1).toUpperCase();

  async function handleLogout() {
    await logout();
    router.replace("/admin");
  }

  return (
    <div className={styles.shell}>
      <button
        type="button"
        className={`${styles.backdrop} ${sidebarOpen ? styles.backdropOpen : ""}`}
        aria-label="Закрыть меню"
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarTop}>
          <Link href="/admin/dashboard" className={styles.brand}>
            <span className={styles.brandMark}>12 FEET</span>
            <span className={styles.brandBadge}>Admin</span>
          </Link>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Закрыть меню"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>
        <nav className={styles.nav}>
          {ADMIN_NAV.map((item) => {
            const active = pathname?.startsWith(item.href);
            const badge =
              item.icon === "leads" && newLeads > 0
                ? String(newLeads)
                : item.badge;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <AdminIcon name={item.icon} />
                <span>{item.label}</span>
                {badge ? <span className={styles.navBadge}>{badge}</span> : null}
              </Link>
            );
          })}
        </nav>
        <div className={styles.sidebarBottom}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.userMeta}>
              <strong>{user?.name || "Админ"}</strong>
              <span>{user?.login}</span>
            </div>
          </div>
          <button type="button" className={styles.logout} onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </aside>
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.menuBtn}
            aria-label="Меню"
            onClick={() => setSidebarOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className={styles.topbarCopy}>
            <p className={styles.eyebrow}>12 FEET · CMS</p>
            <h1 className={styles.pageTitle}>{pageTitle}</h1>
          </div>
          <div className={styles.topbarActions}>
            <Link href="/sk" className={styles.siteLink} target="_blank">
              Сайт
            </Link>
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
