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
import { useEffect, useMemo, useState } from "react";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
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
  const [date, setDate] = useState(todayIso());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [time, setTime] = useState("18:00");
  const [tableNumber, setTableNumber] = useState<1 | 2>(1);
  const [hours, setHours] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<BookingStatus>("confirmed");
  const [blockMode, setBlockMode] = useState(false);

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
        setFormError("Цей слот уже зайнятий — оберіть інший час або стіл.");
      } else {
        setFormError("Не вдалося створити запис.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function removeBooking(id: string) {
    if (!window.confirm("Видалити запис?")) return;
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
              <span>{taken ? slotLabel(taken) : "Вільно"}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Бронювання"
        lead="Календар столів на обраний день та ручне створення бронювань."
      />
      <AdminCard>
        <AdminField label="Дата">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </AdminField>
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : (
        <div className={styles.grid2} style={{ marginTop: 18 }}>
          <AdminCard title="Стіл 1">
            {renderSlotGrid(1)}
          </AdminCard>
          <AdminCard title="Стіл 2">
            {renderSlotGrid(2)}
          </AdminCard>
        </div>
      )}

      <div className={styles.grid2} style={{ marginTop: 18 }}>
        <AdminCard title="Записи на день">
          {bookings.length === 0 ? (
            <AdminEmpty>Немає бронювань</AdminEmpty>
          ) : (
            <AdminTableWrap>
              <AdminTable>
                <thead>
                  <tr>
                    <th>Час</th>
                    <th>Стіл</th>
                    <th>Клієнт</th>
                    <th>Год.</th>
                    <th>Сума</th>
                    <th>Статус</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((row) => (
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
                          Видалити
                        </DangerButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </AdminTable>
            </AdminTableWrap>
          )}
        </AdminCard>

        <AdminCard title="Новий запис">
          <div className={styles.formGrid}>
            <AdminField label="Час">
              <input
                type="time"
                value={time}
                min="12:00"
                max="23:30"
                onChange={(e) => setTime(e.target.value)}
              />
            </AdminField>
            <AdminField label="Стіл">
              <select
                value={tableNumber}
                onChange={(e) =>
                  setTableNumber(Number(e.target.value) as 1 | 2)
                }
              >
                <option value={1}>Стіл 1</option>
                <option value={2}>Стіл 2</option>
              </select>
            </AdminField>
            <AdminField label="Години">
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
                Заблокувати слот
              </label>
            </AdminField>
            {!blockMode ? (
              <>
                <AdminField label="Ім&apos;я">
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
                    <option value="confirmed">Підтверджено</option>
                    <option value="new">Нова</option>
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
              {submitting ? "Збереження…" : "Створити"}
            </PrimaryButton>
            <GhostButton type="button" onClick={() => void load(date)}>
              Оновити
            </GhostButton>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
