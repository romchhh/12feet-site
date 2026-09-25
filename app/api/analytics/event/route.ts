import { updateDb, uid, type AnalyticsEvent } from "@/lib/cms/store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TYPES: AnalyticsEvent["type"][] = [
  "pageview",
  "booking",
  "cta_click",
  "scroll_depth",
];

export async function POST(request: Request) {
  let body: {
    type?: AnalyticsEvent["type"];
    path?: string;
    locale?: string;
    value?: string;
    meta?: Record<string, unknown>;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const type = body.type;
  const path = typeof body.path === "string" ? body.path.trim().slice(0, 200) : "";

  if (!type || !TYPES.includes(type) || !path) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 400 });
  }

  const event: AnalyticsEvent = {
    id: uid("ev"),
    type,
    path,
    locale:
      typeof body.locale === "string" ? body.locale.trim().slice(0, 8) : undefined,
    value: typeof body.value === "string" ? body.value.slice(0, 120) : undefined,
    meta: body.meta && typeof body.meta === "object" ? body.meta : undefined,
    createdAt: new Date().toISOString(),
  };

  updateDb((draft) => {
    draft.analytics.push(event);
    if (draft.analytics.length > 5000) {
      draft.analytics = draft.analytics.slice(-5000);
    }
  });

  return NextResponse.json({ ok: true });
}
