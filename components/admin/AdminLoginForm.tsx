"use client";

import { adminFetch } from "@/components/admin/adminApi";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import styles from "@/components/admin/AdminLoginForm.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminLoginForm() {
  const { refresh } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await adminFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ login, password, remember }),
      });
      await refresh();
      const next = searchParams.get("next") || "/admin/dashboard";
      router.replace(next.startsWith("/admin") ? next : "/admin/dashboard");
    } catch {
      setError("Невірний логін або пароль");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.brand}>
          <span className={styles.logo}>12 FEET</span>
          <span className={styles.badge}>Admin</span>
        </div>
        <div className={styles.intro}>
          <h1 className={styles.title}>Вхід до панелі</h1>
          <p className={styles.lead}>
            Керуйте бронюваннями, меню та аналітикою клубу 12 FEET.
          </p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Логін</span>
            <input
              type="text"
              name="login"
              autoComplete="username"
              required
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span>Пароль</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className={styles.remember}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Запам&apos;ятати мене
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.submit} type="submit" disabled={submitting}>
            {submitting ? "Вхід…" : "Увійти"}
          </button>
          <p className={styles.hint}>Доступ лише для персоналу клубу.</p>
        </form>
      </div>
      <div className={styles.visual} aria-hidden>
        <div className={styles.visualShade} />
      </div>
    </div>
  );
}
