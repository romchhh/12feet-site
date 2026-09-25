"use client";

import { AreaChart } from "@/components/admin/AdminCharts";
import {
  AdminCard,
  AdminLoading,
  AdminPageHeader,
  AdminTable,
  AdminTableWrap,
  StatCard,
  StatusBadge,
  formatMoney,
} from "@/components/admin/AdminUi";
import styles from "@/components/admin/AdminUi.module.css";
import { adminFetch } from "@/components/admin/adminApi";
import type { Booking } from "@/lib/cms/store";
import { useEffect, useState } from "react";

type DashboardStats = {
  visits30: number;
  bookingsTotal: number;
  bookings30: number;
  newBookings: number;
  confirmedBookings: number;
  revenue30: number;
  conversion: number;
  visitsByDay: { label: string; value: number }[];
  recentBookings: Booking[];
};

export default function DashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    void adminFetch<{ ok: true; stats: DashboardStats }>("/api/admin/dashboard")
      .then((data) => setStats(data.stats))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <p className={styles.empty}>Не вдалося завантажити дані</p>;
  }

  if (!stats) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader
        title="Огляд"
        lead="Ключові показники сайту та останні бронювання за 30 днів."
      />
      <div className={styles.grid4}>
        <StatCard label="Візити (30 дн.)" value={stats.visits30} />
        <StatCard label="Бронювання" value={stats.bookingsTotal} hint={`+${stats.bookings30} за 30 дн.`} />
        <StatCard label="Нові заявки" value={stats.newBookings} />
        <StatCard
          label="Дохід (30 дн.)"
          value={formatMoney(stats.revenue30)}
          hint={`Конверсія ${stats.conversion}%`}
        />
      </div>
      <div className={styles.stack} style={{ marginTop: 18 }}>
        <AdminCard title="Візити за 7 днів" subtitle="Унікальні перегляди сторінок">
          <AreaChart data={stats.visitsByDay} />
        </AdminCard>
        <AdminCard title="Останні бронювання">
          {stats.recentBookings.length === 0 ? (
            <p className={styles.empty}>Поки немає заявок</p>
          ) : (
            <AdminTableWrap>
              <AdminTable>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Час</th>
                    <th>Стіл</th>
                    <th>Клієнт</th>
                    <th>Сума</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map((row) => (
                    <tr key={row.id}>
                      <td>{row.date}</td>
                      <td>{row.time}</td>
                      <td>{row.tableNumber}</td>
                      <td>{row.name}</td>
                      <td>{formatMoney(row.total)}</td>
                      <td>
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </AdminTable>
            </AdminTableWrap>
          )}
        </AdminCard>
      </div>
    </>
  );
}
