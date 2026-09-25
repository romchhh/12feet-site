"use client";

import { adminFetch } from "@/components/admin/adminApi";
import {
  AdminCard,
  AdminEmpty,
  AdminLoading,
  AdminPageHeader,
  AdminTable,
  AdminTableWrap,
  StatCard,
  formatDateTime,
} from "@/components/admin/AdminUi";
import styles from "@/components/admin/AdminUi.module.css";
import type { AnalyticsEvent } from "@/lib/cms/store";
import { useEffect, useState } from "react";

type AnalyticsStats = {
  events30: number;
  byType: { label: string; value: number }[];
  topPages: { path: string; value: number }[];
  locales: { label: string; value: number }[];
  recent: AnalyticsEvent[];
};

const TYPE_LABELS: Record<string, string> = {
  pageview: "Просмотры",
  booking: "Бронирования",
  cta_click: "CTA",
  scroll_depth: "Скролл",
};

export default function AnalyticsView() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);

  useEffect(() => {
    void adminFetch<{ ok: true; stats: AnalyticsStats }>(
      "/api/admin/analytics",
    ).then((data) => setStats(data.stats));
  }, []);

  if (!stats) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader
        title="Аналитика"
        lead="События на сайте за последние 30 дней."
      />
      <div className={styles.grid3}>
        <StatCard label="Событий" value={stats.events30} />
        <StatCard
          label="Просмотры"
          value={stats.byType.find((t) => t.label === "pageview")?.value ?? 0}
        />
        <StatCard
          label="Бронирования"
          value={stats.byType.find((t) => t.label === "booking")?.value ?? 0}
        />
      </div>
      <div className={styles.grid2} style={{ marginTop: 18 }}>
        <AdminCard title="По типу">
          <ul className={styles.stack}>
            {stats.byType.map((row) => (
              <li key={row.label} className={styles.detailRow}>
                <span className={styles.detailLabel}>
                  {TYPE_LABELS[row.label] || row.label}
                </span>
                <span className={styles.detailValue}>{row.value}</span>
              </li>
            ))}
          </ul>
        </AdminCard>
        <AdminCard title="Языки / локали">
          {stats.locales.length === 0 ? (
            <AdminEmpty>Нет данных</AdminEmpty>
          ) : (
            <ul className={styles.stack}>
              {stats.locales.map((row) => (
                <li key={row.label} className={styles.detailRow}>
                  <span className={styles.detailLabel}>{row.label}</span>
                  <span className={styles.detailValue}>{row.value}</span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
      <div className={styles.stack} style={{ marginTop: 18 }}>
        <AdminCard title="Топ страниц">
          {stats.topPages.length === 0 ? (
            <AdminEmpty>Нет просмотров</AdminEmpty>
          ) : (
            <AdminTableWrap>
              <AdminTable>
                <thead>
                  <tr>
                    <th>Путь</th>
                    <th>Просмотры</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topPages.map((row) => (
                    <tr key={row.path}>
                      <td>{row.path}</td>
                      <td>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </AdminTable>
            </AdminTableWrap>
          )}
        </AdminCard>
        <AdminCard title="Последние события">
          <AdminTableWrap>
            <AdminTable>
              <thead>
                <tr>
                  <th>Время</th>
                  <th>Тип</th>
                  <th>Путь</th>
                  <th>Локаль</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((event) => (
                  <tr key={event.id}>
                    <td>{formatDateTime(event.createdAt)}</td>
                    <td>{TYPE_LABELS[event.type] || event.type}</td>
                    <td>{event.path}</td>
                    <td>{event.locale || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          </AdminTableWrap>
        </AdminCard>
      </div>
    </>
  );
}
