"use client";

import { adminFetch } from "@/components/admin/adminApi";
import {
  AdminCard,
  AdminEmpty,
  AdminField,
  AdminLoading,
  AdminPageHeader,
  AdminTable,
  AdminTableWrap,
  DangerButton,
  FilterChips,
  PrimaryButton,
  StatCard,
  StatusBadge,
  bookingStatusLabel,
  formatDateTime,
  formatMoney,
} from "@/components/admin/AdminUi";
import styles from "@/components/admin/AdminUi.module.css";
import type { Booking, BookingStatus } from "@/lib/cms/store";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type LeadsPayload = {
  leads: Booking[];
  stats: {
    total: number;
    new: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    revenue: number;
  };
};

const FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "new", label: "Новые" },
  { id: "confirmed", label: "Подтверждённые" },
  { id: "completed", label: "Завершённые" },
  { id: "cancelled", label: "Отменённые" },
];

const STATUSES: BookingStatus[] = [
  "new",
  "confirmed",
  "cancelled",
  "completed",
];

export default function LeadsView() {
  const router = useRouter();
  const [data, setData] = useState<LeadsPayload | null>(null);
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const payload = await adminFetch<{ ok: true } & LeadsPayload>(
      "/api/admin/leads",
    );
    setData({ leads: payload.leads, stats: payload.stats });
  }

  useEffect(() => {
    void load().catch(() =>
      setData({
        leads: [],
        stats: {
          total: 0,
          new: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
          revenue: 0,
        },
      }),
    );
  }, []);

  const rows = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data.leads;
    return data.leads.filter((row) => row.status === filter);
  }, [data, filter]);

  async function updateStatus(id: string, status: BookingStatus, date?: string) {
    setBusyId(id);
    try {
      await adminFetch("/api/admin/leads", {
        method: "PATCH",
        body: JSON.stringify({ id, status }),
      });
      await load();
      if (status === "confirmed" && date) {
        router.push(`/admin/bookings?date=${encodeURIComponent(date)}`);
      }
    } finally {
      setBusyId(null);
    }
  }

  async function confirmLead(row: Booking) {
    setBusyId(row.id);
    try {
      await adminFetch("/api/admin/leads", {
        method: "PATCH",
        body: JSON.stringify({ id: row.id, status: "confirmed" }),
      });
      await load();
      router.push(`/admin/bookings?date=${encodeURIComponent(row.date)}`);
    } finally {
      setBusyId(null);
    }
  }

  async function removeLead(id: string) {
    if (!window.confirm("Удалить заявку?")) return;
    setBusyId(id);
    try {
      await adminFetch("/api/admin/leads", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  if (!data) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader
        title="Заявки"
        lead="Новые заявки с сайта. После подтверждения бронь появляется во вкладке «Бронирования»."
      />
      <div className={styles.grid4}>
        <StatCard label="Всего" value={data.stats.total} />
        <StatCard label="Новые" value={data.stats.new} />
        <StatCard label="Подтверждённые" value={data.stats.confirmed} />
        <StatCard label="Доход" value={formatMoney(data.stats.revenue)} />
      </div>
      <AdminCard>
        <FilterChips items={FILTERS} value={filter} onChange={setFilter} />
        {rows.length === 0 ? (
          <AdminEmpty>Нет заявок в этой категории</AdminEmpty>
        ) : (
          <AdminTableWrap>
            <AdminTable>
              <thead>
                <tr>
                  <th>Создано</th>
                  <th>Дата игры</th>
                  <th>Время</th>
                  <th>Стол</th>
                  <th>Клиент</th>
                  <th>Телефон</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{formatDateTime(row.createdAt)}</td>
                    <td>{row.date}</td>
                    <td>{row.time}</td>
                    <td>{row.tableNumber}</td>
                    <td>{row.name}</td>
                    <td>{row.phone}</td>
                    <td>{formatMoney(row.total)}</td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td>
                      <div className={styles.formActions}>
                        {row.status === "new" ? (
                          <PrimaryButton
                            disabled={busyId === row.id}
                            onClick={() => void confirmLead(row)}
                          >
                            Подтвердить
                          </PrimaryButton>
                        ) : null}
                        <AdminField label="Статус">
                          <select
                            value={row.status}
                            disabled={busyId === row.id}
                            onChange={(e) =>
                              void updateStatus(
                                row.id,
                                e.target.value as BookingStatus,
                                row.date,
                              )
                            }
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {bookingStatusLabel(s)}
                              </option>
                            ))}
                          </select>
                        </AdminField>
                        {row.status === "confirmed" ||
                        row.status === "completed" ? (
                          <PrimaryButton
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() =>
                              router.push(
                                `/admin/bookings?date=${encodeURIComponent(row.date)}`,
                              )
                            }
                          >
                            В календарь
                          </PrimaryButton>
                        ) : null}
                        <DangerButton
                          disabled={busyId === row.id}
                          onClick={() => void removeLead(row.id)}
                        >
                          Удалить
                        </DangerButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          </AdminTableWrap>
        )}
      </AdminCard>
    </>
  );
}
