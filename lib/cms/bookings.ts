import type { Booking } from "@/lib/cms/store";

/** Minutes from midnight for HH:MM */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function bookingEndMinutes(booking: Pick<Booking, "time" | "hours">) {
  return timeToMinutes(booking.time) + booking.hours * 60;
}

export function rangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
) {
  return aStart < bEnd && bStart < aEnd;
}

const ACTIVE: Booking["status"][] = ["new", "confirmed", "blocked"];

export function findBookingConflict(
  bookings: Booking[],
  candidate: {
    date: string;
    time: string;
    hours: number;
    tableNumber: 1 | 2;
    excludeId?: string;
  },
): Booking | null {
  const start = timeToMinutes(candidate.time);
  const end = start + candidate.hours * 60;

  for (const booking of bookings) {
    if (candidate.excludeId && booking.id === candidate.excludeId) continue;
    if (!ACTIVE.includes(booking.status)) continue;
    if (booking.date !== candidate.date) continue;
    if (booking.tableNumber !== candidate.tableNumber) continue;

    const bStart = timeToMinutes(booking.time);
    const bEnd = bookingEndMinutes(booking);
    if (rangesOverlap(start, end, bStart, bEnd)) {
      return booking;
    }
  }
  return null;
}

export function isSlotAvailable(
  bookings: Booking[],
  candidate: {
    date: string;
    time: string;
    hours: number;
    tableNumber: 1 | 2;
    excludeId?: string;
  },
) {
  return !findBookingConflict(bookings, candidate);
}
