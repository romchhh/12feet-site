"use client";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import styles from "@/components/admin/AdminUi.module.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/admin${next}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <div className={styles.loading}>Загрузка…</div>;
  }

  if (!user) {
    return null;
  }

  return children;
}
