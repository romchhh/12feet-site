"use client";

import type { Locale } from "@/lib/i18n/config";
import { useEffect } from "react";

function sendPageview(locale: Locale) {
  const path = window.location.pathname + window.location.search;
  const payload = JSON.stringify({
    type: "pageview",
    path,
    locale,
  });

  if (typeof navigator.sendBeacon === "function") {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon("/api/analytics/event", blob);
    return;
  }

  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {
    /* ignore */
  });
}

export default function AnalyticsBeacon({ locale }: { locale: Locale }) {
  useEffect(() => {
    const run = () => sendPageview(locale);
    const idle = (
      window as Window & {
        requestIdleCallback?: (
          cb: () => void,
          opts?: { timeout: number },
        ) => number;
        cancelIdleCallback?: (id: number) => void;
      }
    ).requestIdleCallback;

    if (typeof idle === "function") {
      const id = idle(run, { timeout: 2500 });
      return () => {
        (
          window as Window & { cancelIdleCallback?: (id: number) => void }
        ).cancelIdleCallback?.(id);
      };
    }

    const timer = window.setTimeout(run, 1200);
    return () => window.clearTimeout(timer);
  }, [locale]);

  return null;
}
