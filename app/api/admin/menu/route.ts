import { requireAdmin } from "@/lib/cms/session";
import { readDb, updateDb, type CmsMenuColumn } from "@/lib/cms/store";
import { locales } from "@/lib/i18n/config";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const db = readDb();
  return NextResponse.json({ ok: true, menu: db.menu });
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body: { menu?: CmsMenuColumn[] };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!Array.isArray(body.menu)) {
    return NextResponse.json({ ok: false, error: "invalid_menu" }, { status: 400 });
  }

  updateDb((draft) => {
    draft.menu = body.menu!;
  });

  for (const locale of locales) {
    revalidatePath(`/${locale}`);
  }

  return NextResponse.json({ ok: true, menu: body.menu });
}
