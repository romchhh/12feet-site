export const runtime = "nodejs";

import { cmsDashboardStats } from "@/lib/cms/stats";
import { readDb } from "@/lib/cms/store";
import { requireAdmin } from "@/lib/cms/session";
import { NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const db = readDb();
  return NextResponse.json({ ok: true, stats: cmsDashboardStats(db) });
}
