import {
  getBookingRate,
  isValidDateISO,
  isValidTime,
} from "@/lib/booking-rates";
import { findBookingConflict } from "@/lib/cms/bookings";
import { locales, type Locale } from "@/lib/i18n/config";
import {
  createTimestampedBooking,
  readDb,
  updateDb,
  uid,
} from "@/lib/cms/store";
import {
  formatBookingTelegramMessage,
  sendTelegramMessage,
} from "@/lib/telegram";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type BookingBody = {
  locale?: string;
  date?: string;
  time?: string;
  tableNumber?: number;
  hours?: number;
  name?: string;
  phone?: string;
};

function trimField(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: BookingBody;
  try {
    body = (await request.json()) as BookingBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const locale = body.locale;
  if (!locale || !locales.includes(locale as Locale)) {
    return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
  }

  const date = trimField(body.date, 10);
  const time = trimField(body.time, 5);
  const name = trimField(body.name, 120);
  const phone = trimField(body.phone, 40);
  const tableNumber = body.tableNumber;
  const hours = body.hours;

  if (!isValidDateISO(date)) {
    return NextResponse.json({ error: "invalid_date" }, { status: 400 });
  }
  if (!isValidTime(time)) {
    return NextResponse.json({ error: "invalid_time" }, { status: 400 });
  }
  if (tableNumber !== 1 && tableNumber !== 2) {
    return NextResponse.json({ error: "invalid_table" }, { status: 400 });
  }
  if (typeof hours !== "number" || !Number.isInteger(hours) || hours < 1 || hours > 6) {
    return NextResponse.json({ error: "invalid_hours" }, { status: 400 });
  }
  if (name.length < 2) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }
  if (phone.length < 6) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = date.split("-").map(Number);
  const bookingDay = new Date(y, m - 1, d);
  if (bookingDay < today) {
    return NextResponse.json({ error: "past_date" }, { status: 400 });
  }

  const rate = getBookingRate(date);
  const total = rate * hours;

  const db = readDb();
  const conflict = findBookingConflict(db.bookings, {
    date,
    time,
    hours,
    tableNumber,
  });
  if (conflict) {
    return NextResponse.json({ error: "conflict" }, { status: 409 });
  }

  const booking = createTimestampedBooking({
    date,
    time,
    tableNumber,
    hours,
    name,
    phone,
    locale,
    rate,
    total,
    status: "new",
    source: "web",
    notes: "",
  });

  updateDb((draft) => {
    draft.bookings.push(booking);
    draft.analytics.push({
      id: uid("ev"),
      type: "booking",
      path: `/${locale}#book`,
      locale,
      meta: { bookingId: booking.id, tableNumber, hours },
      createdAt: new Date().toISOString(),
    });
  });

  const text = formatBookingTelegramMessage({
    locale,
    date,
    time,
    tableNumber,
    hours,
    name,
    phone,
    rate,
    total,
  });

  try {
    await sendTelegramMessage(text);
  } catch (err) {
    console.error("[booking] telegram", err);
  }

  return NextResponse.json({ ok: true, total });
}
