export const runtime = "nodejs";

import { leadsStats } from "@/lib/cms/stats";
import { requireAdmin } from "@/lib/cms/session";
import {
  readDb,
  updateDb,
  type Booking,
  type BookingStatus,
} from "@/lib/cms/store";
import { NextResponse } from "next/server";

const STATUSES: BookingStatus[] = [
  "new",
  "confirmed",
  "cancelled",
  "completed",
  "blocked",
];

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const db = readDb();
  const leads = [...db.bookings]
    .filter((b) => b.status !== "blocked")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return NextResponse.json({
    ok: true,
    leads,
    stats: leadsStats(db.bookings),
  });
}

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body: { id?: string; status?: BookingStatus; notes?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }

  if (
    body.status &&
    !STATUSES.includes(body.status)
  ) {
    return NextResponse.json({ ok: false, error: "invalid_status" }, { status: 400 });
  }

  let updated: Booking | null = null;
  updateDb((draft) => {
    const row = draft.bookings.find((b) => b.id === id);
    if (!row) return;
    if (body.status && STATUSES.includes(body.status)) {
      row.status = body.status;
    }
    if (typeof body.notes === "string") {
      row.notes = body.notes.trim().slice(0, 500);
    }
    row.updatedAt = new Date().toISOString();
    updated = { ...row };
  });

  if (!updated) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, lead: updated });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body: { id?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
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
