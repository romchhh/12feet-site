import { getBookingRate, isValidDateISO } from "@/lib/booking-rates";
import { isSlotAvailable } from "@/lib/cms/bookings";
import {
  BOOKING_TIME_SLOTS,
  isPastDate,
  slotFitsHours,
} from "@/lib/booking-slots";
import { readDb } from "@/lib/cms/store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || "";
  const hoursRaw = Number(searchParams.get("hours") || "2");
  const hours =
    Number.isInteger(hoursRaw) && hoursRaw >= 1 && hoursRaw <= 6 ? hoursRaw : 2;

  if (!isValidDateISO(date) || isPastDate(date)) {
    return NextResponse.json({ error: "invalid_date" }, { status: 400 });
  }

  const db = readDb();
  const rate = getBookingRate(date);

  const slots = BOOKING_TIME_SLOTS.filter((time) =>
    slotFitsHours(time, hours),
  ).map((time) => ({
    time,
    tables: {
      1: isSlotAvailable(db.bookings, {
        date,
        time,
        hours,
        tableNumber: 1,
      }),
      2: isSlotAvailable(db.bookings, {
        date,
        time,
        hours,
        tableNumber: 2,
      }),
    } as Record<1 | 2, boolean>,
  }));

  return NextResponse.json({
    ok: true,
    date,
    hours,
    rate,
    slots,
  });
}
