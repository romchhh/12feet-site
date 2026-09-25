export const runtime = "nodejs";

import { findBookingConflict } from "@/lib/cms/bookings";
import { requireAdmin } from "@/lib/cms/session";
import {
  createTimestampedBooking,
  readDb,
  updateDb,
  type Booking,
  type BookingStatus,
} from "@/lib/cms/store";
import { getBookingRate, isValidDateISO, isValidTime } from "@/lib/booking-rates";
import { NextResponse } from "next/server";

const STATUSES: BookingStatus[] = [
  "new",
  "confirmed",
  "cancelled",
  "completed",
  "blocked",
];

function parseTable(value: unknown): 1 | 2 | null {
  if (value === 1 || value === 2) return value;
  return null;
}

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || undefined;

  const db = readDb();
  let bookings = [...db.bookings];
  if (date) {
    if (!isValidDateISO(date)) {
      return NextResponse.json({ ok: false, error: "invalid_date" }, { status: 400 });
    }
    bookings = bookings.filter((b) => b.date === date);
  }

  bookings.sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.time.localeCompare(b.time) ||
      a.tableNumber - b.tableNumber,
  );

  return NextResponse.json({ ok: true, bookings });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const date = typeof body.date === "string" ? body.date.trim() : "";
  const time = typeof body.time === "string" ? body.time.trim() : "";
  const tableNumber = parseTable(body.tableNumber);
  const hours =
    typeof body.hours === "number" && Number.isInteger(body.hours)
      ? body.hours
      : null;
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";
  const status =
    typeof body.status === "string" && STATUSES.includes(body.status as BookingStatus)
      ? (body.status as BookingStatus)
      : "confirmed";
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 500) : "";

  if (!isValidDateISO(date) || !isValidTime(time) || !tableNumber || !hours) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 400 });
  }
  if (hours < 1 || hours > 6) {
    return NextResponse.json({ ok: false, error: "invalid_hours" }, { status: 400 });
  }
  if (status !== "blocked" && name.length < 2) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }

  const db = readDb();
  const conflict = findBookingConflict(db.bookings, {
    date,
    time,
    hours,
    tableNumber,
  });
  if (conflict) {
    return NextResponse.json(
      { ok: false, error: "conflict", booking: conflict },
      { status: 409 },
    );
  }

  const rate = getBookingRate(date);
  const total = status === "blocked" ? 0 : rate * hours;
  const booking = createTimestampedBooking({
    date,
    time,
    tableNumber,
    hours,
    name: name || "Blocked",
    phone: phone || "—",
    locale: "admin",
    rate,
    total,
    status,
    source: "admin",
    notes,
  });

  updateDb((draft) => {
    draft.bookings.push(booking);
  });

  return NextResponse.json({ ok: true, booking });
}

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }

  const db = readDb();
  const existing = db.bookings.find((b) => b.id === id);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const nextDate =
    typeof body.date === "string" && isValidDateISO(body.date)
      ? body.date
      : existing.date;
  const nextTime =
    typeof body.time === "string" && isValidTime(body.time)
      ? body.time
      : existing.time;
  const nextTable = parseTable(body.tableNumber) ?? existing.tableNumber;
  const nextHours =
    typeof body.hours === "number" && Number.isInteger(body.hours)
      ? body.hours
      : existing.hours;
  const nextStatus =
    typeof body.status === "string" &&
    STATUSES.includes(body.status as BookingStatus)
      ? (body.status as BookingStatus)
      : existing.status;

  const conflict = findBookingConflict(db.bookings, {
    date: nextDate,
    time: nextTime,
    hours: nextHours,
    tableNumber: nextTable,
    excludeId: id,
  });
  if (conflict) {
    return NextResponse.json(
      { ok: false, error: "conflict", booking: conflict },
      { status: 409 },
    );
  }

  let updated: Booking | null = null;
  updateDb((draft) => {
    const row = draft.bookings.find((b) => b.id === id);
    if (!row) return;
    row.date = nextDate;
    row.time = nextTime;
    row.tableNumber = nextTable;
    row.hours = nextHours;
    row.status = nextStatus;
    if (typeof body.name === "string") row.name = body.name.trim().slice(0, 120);
    if (typeof body.phone === "string") row.phone = body.phone.trim().slice(0, 40);
    if (typeof body.notes === "string") row.notes = body.notes.trim().slice(0, 500);
    row.rate = getBookingRate(nextDate);
    row.total =
      row.status === "blocked" ? 0 : row.rate * row.hours;
    row.updatedAt = new Date().toISOString();
    updated = { ...row };
  });

  return NextResponse.json({ ok: true, booking: updated });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let id = "";
  try {
    const body = (await request.json()) as { id?: string };
    id = typeof body.id === "string" ? body.id : "";
  } catch {
    /* empty */
  }

  if (!id) {
    const { searchParams } = new URL(request.url);
    id = searchParams.get("id") || "";
  }

  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }

  let removed = false;
  updateDb((draft) => {
    const before = draft.bookings.length;
    draft.bookings = draft.bookings.filter((b) => b.id !== id);
    removed = draft.bookings.length < before;
  });

  if (!removed) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
