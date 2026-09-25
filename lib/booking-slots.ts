import { isValidTime } from "@/lib/booking-rates";

/** Half-hour slots from 12:00 to 23:30 inclusive. */
export function buildTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 12; h <= 23; h += 1) {
    for (const m of [0, 30]) {
      if (h === 23 && m > 30) continue;
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

export const BOOKING_TIME_SLOTS = buildTimeSlots();

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

/** Last start time that still fits `hours` before closing (24:00 soft end from 23:30 last start for 0.5h — we allow until end exceeds midnight lightly). Club lasts until ~00/02; slots end when start+hours would go past 24:00 for simplicity. */
export function slotFitsHours(time: string, hours: number): boolean {
  if (!isValidTime(time)) return false;
  const [h, m] = time.split(":").map(Number);
  const end = h * 60 + m + hours * 60;
  return end <= 24 * 60;
}
