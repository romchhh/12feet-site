import type { AnalyticsEvent, Booking, CmsDb } from "@/lib/cms/store";

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

function lastNDays(n: number) {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function cmsDashboardStats(db: CmsDb) {
  const days7 = lastNDays(7);
  const days30 = lastNDays(30);
  const set30 = new Set(days30);

  const visits30 = db.analytics.filter(
    (e) => e.type === "pageview" && set30.has(dayKey(e.createdAt)),
  );
  const bookings = db.bookings.filter((b) => b.status !== "blocked");
  const bookings30 = bookings.filter((b) => set30.has(dayKey(b.createdAt)));
  const newBookings = bookings.filter((b) => b.status === "new");
  const confirmed = bookings.filter((b) => b.status === "confirmed");

  const visitsByDay = days7.map((day) => ({
    label: day.slice(5),
    value: db.analytics.filter(
      (e) => e.type === "pageview" && dayKey(e.createdAt) === day,
    ).length,
  }));

  const bookingsByDay = days7.map((day) => ({
    label: day.slice(5),
    value: bookings.filter((b) => dayKey(b.createdAt) === day).length,
  }));

  const revenue30 = bookings30
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.total || 0), 0);

  const conversion =
    visits30.length > 0
      ? Math.round((bookings30.length / visits30.length) * 1000) / 10
      : 0;

  const statusBreakdown = [
    { label: "new", value: bookings.filter((b) => b.status === "new").length },
    {
      label: "confirmed",
      value: bookings.filter((b) => b.status === "confirmed").length,
    },
    {
      label: "completed",
      value: bookings.filter((b) => b.status === "completed").length,
    },
    {
      label: "cancelled",
      value: bookings.filter((b) => b.status === "cancelled").length,
    },
    {
      label: "blocked",
      value: db.bookings.filter((b) => b.status === "blocked").length,
    },
  ];

  const topPages = topPaths(db.analytics.filter((e) => e.type === "pageview"));

  return {
    visits30: visits30.length,
    bookingsTotal: bookings.length,
    bookings30: bookings30.length,
    newBookings: newBookings.length,
    confirmedBookings: confirmed.length,
    revenue30,
    conversion,
    visitsByDay,
    bookingsByDay,
    statusBreakdown,
    topPages,
    recentBookings: [...bookings]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 8),
  };
}

function topPaths(events: AnalyticsEvent[]) {
  const map = new Map<string, number>();
  for (const event of events) {
    map.set(event.path, (map.get(event.path) || 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([path, value]) => ({ path, value }));
}

export function cmsAnalyticsStats(db: CmsDb) {
  const days30 = lastNDays(30);
  const set30 = new Set(days30);
  const events = db.analytics.filter((e) => set30.has(dayKey(e.createdAt)));

  const byType = ["pageview", "booking", "cta_click", "scroll_depth"].map(
    (type) => ({
      label: type,
      value: events.filter((e) => e.type === type).length,
    }),
  );

  return {
    events30: events.length,
    byType,
    topPages: topPaths(events.filter((e) => e.type === "pageview")),
    recent: [...events]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 40),
    locales: localeBreakdown(events),
  };
}

function localeBreakdown(events: AnalyticsEvent[]) {
  const map = new Map<string, number>();
  for (const event of events) {
    const key = event.locale || "—";
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()].map(([label, value]) => ({ label, value }));
}

export function leadsStats(bookings: Booking[]) {
  const active = bookings.filter((b) => b.status !== "blocked");
  return {
    total: active.length,
    new: active.filter((b) => b.status === "new").length,
    confirmed: active.filter((b) => b.status === "confirmed").length,
    completed: active.filter((b) => b.status === "completed").length,
    cancelled: active.filter((b) => b.status === "cancelled").length,
    revenue: active
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + b.total, 0),
  };
}
