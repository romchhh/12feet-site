import { getBookingRate, isValidDateISO } from "@/lib/booking-rates";
import { TABLE_NUMBERS } from "@/lib/booking-tables";
import { isSlotAvailable } from "@/lib/cms/bookings";
import {
  buildTimeSlotsForDate,
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

  const slots = buildTimeSlotsForDate(date)
    .filter((time) => slotFitsHours(time, hours, date))
    .map((time) => {
      const tables = {} as Record<1 | 2 | 3, boolean>;
      for (const tableNumber of TABLE_NUMBERS) {
        tables[tableNumber] = isSlotAvailable(db.bookings, {
          date,
          time,
          hours,
          tableNumber,
        });
      }
      return { time, tables };
    });

  return NextResponse.json({
    ok: true,
    date,
    hours,
    rate,
    slots,
  });
}
