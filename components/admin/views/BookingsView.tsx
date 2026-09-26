"use client";

import { adminFetch, AdminRequestError } from "@/components/admin/adminApi";
import {
  AdminCard,
  AdminEmpty,
  AdminField,
  AdminLoading,
  AdminPageHeader,
  AdminTable,
  AdminTableWrap,
  DangerButton,
  GhostButton,
  PrimaryButton,
  StatusBadge,
  formatMoney,
} from "@/components/admin/AdminUi";
import styles from "@/components/admin/AdminUi.module.css";
import { bookingEndMinutes, timeToMinutes } from "@/lib/cms/bookings";
import type { Booking, BookingStatus } from "@/lib/cms/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 12; h <= 23; h += 1) {
    for (const m of [0, 30]) {
      if (h === 23 && m > 30) continue;
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

const TIME_SLOTS = buildTimeSlots();

function slotLabel(booking: Booking) {
  const endMin = bookingEndMinutes(booking);
  const endH = Math.floor(endMin / 60);
  const endM = endMin % 60;
  const end = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  return `${booking.time}–${end}`;
}

export default function BookingsView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dateFromUrl = searchParams.get("date");
  const [date, setDate] = useState(
    dateFromUrl && /^\d{4}-\d{2}-\d{2}$/.test(dateFromUrl)
      ? dateFromUrl
      : todayIso(),
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [time, setTime] = useState("18:00");
  const [tableNumber, setTableNumber] = useState<1 | 2>(1);
  const [hours, setHours] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<BookingStatus>("confirmed");
  const [blockMode, setBlockMode] = useState(false);

  useEffect(() => {
    if (dateFromUrl && /^\d{4}-\d{2}-\d{2}$/.test(dateFromUrl) && dateFromUrl !== date) {
      setDate(dateFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync URL → state only
  }, [dateFromUrl]);

  async function load(selectedDate: string) {
    setLoading(true);
    try {
      const data = await adminFetch<{ ok: true; bookings: Booking[] }>(
        `/api/admin/bookings?date=${encodeURIComponent(selectedDate)}`,
      );
      setBookings(data.bookings);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(date);
  }, [date]);

  function changeDate(next: string) {
    setDate(next);
    router.replace(`/admin/bookings?date=${encodeURIComponent(next)}`);
  }

  const calendarBookings = useMemo(
    () =>
      bookings.filter((b) =>
        ["confirmed", "blocked", "completed"].includes(b.status),
      ),
    [bookings],
  );

  const pendingBookings = useMemo(
    () => bookings.filter((b) => b.status === "new"),
    [bookings],
  );

  const byTable = useMemo(() => {
    return {
      1: bookings.filter((b) => b.tableNumber === 1),
      2: bookings.filter((b) => b.tableNumber === 2),
    };
  }, [bookings]);

  function isSlotTaken(table: 1 | 2, slotTime: string) {
    const start = timeToMinutes(slotTime);
    for (const booking of byTable[table]) {
      if (!["new", "confirmed", "blocked"].includes(booking.status)) continue;
      const bStart = timeToMinutes(booking.time);
      const bEnd = bookingEndMinutes(booking);
      if (start >= bStart && start < bEnd) return booking;
    }
    return null;
  }

  async function confirmPending(id: string) {
    setBusyId(id);
    try {
      await adminFetch("/api/admin/leads", {
        method: "PATCH",
        body: JSON.stringify({ id, status: "confirmed" }),
      });
      await load(date);
    } finally {
      setBusyId(null);
    }
  }

  async function createBooking() {
    setFormError(null);
    setSubmitting(true);
    const payload = {
      date,
      time,
      tableNumber,
      hours,
      name: blockMode ? "Blocked" : name.trim(),
      phone: blockMode ? "—" : phone.trim(),
      status: blockMode ? ("blocked" as const) : status,
    };

    try {
      await adminFetch("/api/admin/bookings", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setName("");
      setPhone("");
      setBlockMode(false);
      await load(date);
    } catch (err) {
      if (err instanceof AdminRequestError && err.status === 409) {
        setFormError("Этот слот уже занят — выберите другое время или стол.");
      } else {
        setFormError("Не удалось создать запись.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function removeBooking(id: string) {
    if (!window.confirm("Удалить запись?")) return;
    await adminFetch("/api/admin/bookings", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    await load(date);
  }

  function renderSlotGrid(table: 1 | 2) {
    return (
      <div className={styles.grid2}>
        {TIME_SLOTS.map((slot) => {
          const taken = isSlotTaken(table, slot);
          return (
            <div
              key={`${table}-${slot}`}
              className={styles.filterChip}
              style={{
                opacity: taken ? 0.55 : 1,
                borderColor: taken ? "rgba(15,90,67,0.35)" : undefined,
              }}
            >
              <strong>{slot}</strong>
              <span>{taken ? slotLabel(taken) : "Свободно"}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Бронирования"
        lead="Подтверждённые брони и блокировки слотов. Новые заявки с сайта подтверждаются во вкладке «Заявки»."
      />
      <AdminCard>
        <AdminField label="Дата">
          <input
            type="date"
            value={date}
            onChange={(e) => changeDate(e.target.value)}
          />
        </AdminField>
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : (
        <div className={styles.grid2} style={{ marginTop: 18 }}>
          <AdminCard title="Стол 1">
            {renderSlotGrid(1)}
          </AdminCard>
          <AdminCard title="Стол 2">
            {renderSlotGrid(2)}
          </AdminCard>
        </div>
      )}

      {pendingBookings.length > 0 ? (
        <div style={{ marginTop: 18 }}>
          <AdminCard
            title="Ожидают подтверждения"
            subtitle="Заявки с сайта на этот день — подтвердите, чтобы добавить в календарь."
          >
            <AdminTableWrap>
              <AdminTable>
                <thead>
                  <tr>
                    <th>Время</th>
                    <th>Стол</th>
                    <th>Клиент</th>
                    <th>Телефон</th>
                    <th>Ч.</th>
                    <th>Сумма</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {pendingBookings.map((row) => (
                    <tr key={row.id}>
                      <td>{slotLabel(row)}</td>
                      <td>{row.tableNumber}</td>
                      <td>{row.name}</td>
                      <td>{row.phone}</td>
                      <td>{row.hours}</td>
                      <td>{formatMoney(row.total)}</td>
                      <td>
                        <div className={styles.formActions}>
                          <PrimaryButton
                            disabled={busyId === row.id}
                            onClick={() => void confirmPending(row.id)}
                          >
                            Подтвердить
                          </PrimaryButton>
                          <DangerButton
                            onClick={() => void removeBooking(row.id)}
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
          </AdminCard>
        </div>
      ) : null}

      <div className={styles.grid2} style={{ marginTop: 18 }}>
        <AdminCard title="Подтверждённые на день">
          {calendarBookings.length === 0 ? (
            <AdminEmpty>Нет подтверждённых бронирований</AdminEmpty>
          ) : (
            <AdminTableWrap>
              <AdminTable>
                <thead>
                  <tr>
                    <th>Время</th>
                    <th>Стол</th>
                    <th>Клиент</th>
                    <th>Ч.</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {calendarBookings.map((row) => (
                    <tr key={row.id}>
                      <td>{slotLabel(row)}</td>
                      <td>{row.tableNumber}</td>
                      <td>{row.name}</td>
                      <td>{row.hours}</td>
                      <td>{formatMoney(row.total)}</td>
                      <td>
                        <StatusBadge status={row.status} />
                      </td>
                      <td>
                        <DangerButton onClick={() => void removeBooking(row.id)}>
                          Удалить
                        </DangerButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </AdminTable>
            </AdminTableWrap>
          )}
        </AdminCard>

        <AdminCard title="Новая запись">
          <div className={styles.formGrid}>
            <AdminField label="Время">
              <input
                type="time"
                value={time}
                min="12:00"
                max="23:30"
                onChange={(e) => setTime(e.target.value)}
              />
            </AdminField>
            <AdminField label="Стол">
              <select
                value={tableNumber}
                onChange={(e) =>
                  setTableNumber(Number(e.target.value) as 1 | 2)
                }
              >
                <option value={1}>Стол 1</option>
                <option value={2}>Стол 2</option>
              </select>
            </AdminField>
            <AdminField label="Часы">
              <select
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Режим">
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={blockMode}
                  onChange={(e) => setBlockMode(e.target.checked)}
                />
                Заблокировать слот
              </label>
            </AdminField>
            {!blockMode ? (
              <>
                <AdminField label="Имя">
                  <input value={name} onChange={(e) => setName(e.target.value)} />
                </AdminField>
                <AdminField label="Телефон">
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </AdminField>
                <AdminField label="Статус">
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as BookingStatus)
                    }
                  >
                    <option value="confirmed">Подтверждено</option>
                    <option value="new">Новая</option>
                  </select>
                </AdminField>
              </>
            ) : null}
          </div>
          {formError ? <p className={styles.tableHint}>{formError}</p> : null}
          <div className={styles.formActions}>
            <PrimaryButton
              disabled={submitting}
              onClick={() => void createBooking()}
            >
              {submitting ? "Сохранение…" : "Создать"}
            </PrimaryButton>
            <GhostButton type="button" onClick={() => void load(date)}>
              Обновить
            </GhostButton>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
