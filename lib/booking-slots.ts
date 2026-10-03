import { isValidDateISO } from "@/lib/booking-rates";

export type DayHours = {
  openMin: number;
  closeMin: number;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function minutesToTime(total: number): string {
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${pad(h)}:${pad(m)}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Club hours by weekday: Mon–Thu 12–22, Fri–Sat 12–00, Sun 14–22. */
export function getDayHours(dateIso: string): DayHours {
  const [y, m, d] = dateIso.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay(); // 0 Sun … 6 Sat
  if (day === 0) return { openMin: 14 * 60, closeMin: 22 * 60 };
  if (day === 5 || day === 6) return { openMin: 12 * 60, closeMin: 24 * 60 };
  return { openMin: 12 * 60, closeMin: 22 * 60 };
}

/** Half-hour start slots that open on this date (before closing). */
export function buildTimeSlotsForDate(dateIso: string): string[] {
  if (!isValidDateISO(dateIso)) return [];
  const { openMin, closeMin } = getDayHours(dateIso);
  const slots: string[] = [];
  for (let t = openMin; t < closeMin; t += 30) {
    slots.push(minutesToTime(t));
  }
  return slots;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function isPastDate(iso: string, today = startOfDay(new Date())): boolean {
  return parseISODate(iso) < today;
}

/** Start time still fits `hours` before that day's closing. */
export function slotFitsHours(
  time: string,
  hours: number,
  dateIso: string,
): boolean {
  if (!/^\d{2}:\d{2}$/.test(time)) return false;
  if (!Number.isInteger(hours) || hours < 1) return false;
  const { closeMin } = getDayHours(dateIso);
  return timeToMinutes(time) + hours * 60 <= closeMin;
}

export function isValidBookingSlot(
  dateIso: string,
  time: string,
  hours: number,
): boolean {
  if (!isValidDateISO(dateIso)) return false;
  if (!Number.isInteger(hours) || hours < 1 || hours > 6) return false;
  return (
    buildTimeSlotsForDate(dateIso).includes(time) &&
    slotFitsHours(time, hours, dateIso)
  );
}
