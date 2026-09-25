"use client";

import styles from "@/components/Booking.module.css";
import SectionHead from "@/components/SectionHead";
import {
  getBookingRate,
  WEEKDAY_PRICE,
  WEEKEND_PRICE,
} from "@/lib/booking-rates";
import { parseISODate, startOfDay, toISODate } from "@/lib/booking-slots";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const dateLocales: Record<Locale, string> = {
  sk: "sk-SK",
  en: "en-GB",
  ru: "ru-RU",
  uk: "uk-UA",
  de: "de-DE",
};

type SlotInfo = {
  time: string;
  tables: Record<1 | 2, boolean>;
};

type Step = 1 | 2 | 3;

type Props = {
  locale: Locale;
  dict: Dictionary;
};

function formatDateLong(dateStr: string, locale: Locale): string {
  return parseISODate(dateStr).toLocaleDateString(dateLocales[locale], {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTimeRange(time: string, hours: number): string {
  const [h, m] = time.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return time;
  const endTotal = h * 60 + m + hours * 60;
  const endH = Math.floor(endTotal / 60) % 24;
  const endM = endTotal % 60;
  const end = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  return `${time}–${end}`;
}

function monthLabel(year: number, month: number, locale: Locale) {
  return new Date(year, month, 1).toLocaleDateString(dateLocales[locale], {
    month: "long",
    year: "numeric",
  });
}

function weekdayLabels(locale: Locale) {
  const base = new Date(2024, 0, 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d.toLocaleDateString(dateLocales[locale], { weekday: "short" });
  });
}

function buildMonthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startPad = (first.getDay() + 6) % 7;
  const cells: ({ iso: string; day: number } | null)[] = [];
  for (let i = 0; i < startPad; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, iso: toISODate(new Date(year, month, day)) });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function freeTableCount(slot: SlotInfo) {
  return (slot.tables[1] ? 1 : 0) + (slot.tables[2] ? 1 : 0);
}

function pickFreeTable(slot: SlotInfo, preferred?: 1 | 2): 1 | 2 | null {
  if (preferred && slot.tables[preferred]) return preferred;
  if (slot.tables[1]) return 1;
  if (slot.tables[2]) return 2;
  return null;
}

function isBookHref(href: string | null) {
  if (!href) return false;
  return href === "#book" || href.endsWith("#book");
}

export default function Booking({ locale, dict }: Props) {
  const t = dict.book;
  const today = useMemo(() => startOfDay(new Date()), []);
  const todayISO = useMemo(() => toISODate(today), [today]);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tableNumber, setTableNumber] = useState<1 | 2>(1);
  const [hours, setHours] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [conflictError, setConflictError] = useState(false);
  const [doneLabel, setDoneLabel] = useState("");
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  const rate = useMemo(() => (date ? getBookingRate(date) : null), [date]);
  const totalValue = rate !== null && time ? rate * hours : null;
  const hoursLabel =
    hours === 1 ? t.hourUnit : hours < 5 ? t.hoursUnit : t.hoursUnitMany;
  const weekdays = useMemo(() => weekdayLabels(locale), [locale]);
  const cells = useMemo(
    () => buildMonthCells(viewYear, viewMonth),
    [viewYear, viewMonth],
  );
  const canPrevMonth = useMemo(() => {
    const prev = new Date(viewYear, viewMonth - 1, 1);
    const floor = new Date(today.getFullYear(), today.getMonth(), 1);
    return prev >= floor;
  }, [viewYear, viewMonth, today]);

  const openWizard = useCallback(() => {
    setOpen(true);
    setStep(1);
    setDate("");
    setTime("");
    setTableNumber(1);
    setHours(2);
    setSubmitError(false);
    setConflictError(false);
    setSubmitted(false);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  }, [today]);

  const closeWizard = useCallback(() => {
    setOpen(false);
    setSubmitted(false);
    if (typeof window !== "undefined" && window.location.hash === "#book") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || !isBookHref(link.getAttribute("href"))) return;
      e.preventDefault();
      openWizard();
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [openWizard]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#book") openWizard();
  }, [openWizard]);

  useEffect(() => {
    if (!open || !date || step < 2) return;
    let cancelled = false;
    setSlotsLoading(true);
    void fetch(
      `/api/booking/availability?date=${encodeURIComponent(date)}&hours=${hours}`,
    )
      .then(async (res) => {
        if (!res.ok) throw new Error("fail");
        return (await res.json()) as { slots: SlotInfo[] };
      })
      .then((data) => {
        if (cancelled) return;
        setSlots(data.slots);
        setTime((prev) => {
          if (!prev) return prev;
          const slot = data.slots.find((s) => s.time === prev);
          if (!slot || freeTableCount(slot) === 0) return "";
          const nextTable = pickFreeTable(slot);
          if (nextTable) setTableNumber(nextTable);
          return prev;
        });
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, date, hours, step]);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    return () => unlockScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWizard();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeWizard]);

  function shiftMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    const floor = new Date(today.getFullYear(), today.getMonth(), 1);
    if (next < floor) return;
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function selectDate(iso: string) {
    if (iso < todayISO) return;
    setDate(iso);
    setTime("");
    setConflictError(false);
  }

  function selectSlot(slot: SlotInfo) {
    const table = pickFreeTable(slot);
    if (!table) return;
    setTime(slot.time);
    setTableNumber(table);
    setConflictError(false);
  }

  async function submitBooking() {
    if (!date || !time || !name.trim() || !phone.trim() || submitting) return;
    setSubmitting(true);
    setSubmitError(false);
    setConflictError(false);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          date,
          time,
          tableNumber,
          hours,
          name: name.trim(),
          phone: phone.trim(),
        }),
      });

      if (res.status === 409) {
        // Try the other table once if available
        const slot = slots.find((s) => s.time === time);
        const other: 1 | 2 = tableNumber === 1 ? 2 : 1;
        if (slot?.tables[other]) {
          const retry = await fetch("/api/booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              locale,
              date,
              time,
              tableNumber: other,
              hours,
              name: name.trim(),
              phone: phone.trim(),
            }),
          });
          if (retry.ok) {
            const label = other === 1 ? t.table1 : t.table2;
            setTableNumber(other);
            setDoneLabel(
              `${formatDateLong(date, locale)}, ${formatTimeRange(time, hours)} · ${label}`,
            );
            setSubmitted(true);
            setName("");
            setPhone("");
            setDate("");
            setTime("");
            setStep(1);
            return;
          }
        }
        setConflictError(true);
        setStep(2);
        return;
      }
      if (!res.ok) {
        setSubmitError(true);
        return;
      }

      const tableLabel = tableNumber === 1 ? t.table1 : t.table2;
      setDoneLabel(
        `${formatDateLong(date, locale)}, ${formatTimeRange(time, hours)} · ${tableLabel}`,
      );
      setSubmitted(true);
      setName("");
      setPhone("");
      setDate("");
      setTime("");
      setStep(1);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  const stepTitle =
    step === 1 ? t.stepWhen : step === 2 ? t.stepSlot : t.stepContact;
  const tableLabel = tableNumber === 1 ? t.table1 : t.table2;
  const freeSlotCount = slots.filter((s) => freeTableCount(s) > 0).length;

  const canContinue =
    step === 1
      ? Boolean(date)
      : step === 2
        ? Boolean(time)
        : Boolean(name.trim() && phone.trim() && date && time);

  return (
    <section className="block" id="book">
      <div className="wrap">
        <SectionHead kicker={t.titleSans} title={t.titleSerif} lead={t.lead} />

        <div className={`ui-card ${styles.teaser}`}>
          <p className={styles.prices}>
            <span>
              <strong>
                {WEEKDAY_PRICE} {t.perHour}
              </strong>{" "}
              {t.weekdayShort}
            </span>
            <span>·</span>
            <span>
              <strong>
                {WEEKEND_PRICE} {t.perHour}
              </strong>{" "}
              {t.weekendShort}
            </span>
          </p>

          <button
            type="button"
            className={`btn green btn-lg ${styles.cta}`}
            onClick={openWizard}
          >
            <span className="btn-label">{t.submit}</span>
            <i aria-hidden="true">→</i>
          </button>
        </div>

        {mounted && open
          ? createPortal(
              <div className={styles.overlay} role="presentation">
                <button
                  type="button"
                  className={styles.backdrop}
                  aria-label={t.close}
                  onClick={closeWizard}
                />
                <div
                  className={styles.sheet}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={titleId}
                >
                  {submitted ? (
                    <>
                      <div className={styles.sheetBody}>
                        <div className={styles.successBox}>
                          <div className={styles.successIcon} aria-hidden>
                            ✓
                          </div>
                          <h2 id={titleId} className={styles.successTitle}>
                            {t.successTitle}
                          </h2>
                          <p className={styles.successText}>{t.successText}</p>
                          {doneLabel ? (
                            <p className={styles.successMeta}>{doneLabel}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className={styles.sheetFoot}>
                        <button
                          type="button"
                          className={styles.primary}
                          onClick={closeWizard}
                        >
                          {t.successOk}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.sheetHead}>
                        <div>
                          <p id={titleId} className={styles.sheetTitle}>
                            {stepTitle}
                          </p>
                          <p className={styles.sheetSub}>
                            {step === 1
                              ? t.pickDate
                              : step === 2
                                ? date
                                  ? formatDateLong(date, locale)
                                  : t.pickTime
                                : date && time
                                  ? `${formatDateLong(date, locale)} · ${formatTimeRange(time, hours)}`
                                  : t.stepContact}
                          </p>
                        </div>
                        <button
                          type="button"
                          className={styles.closeBtn}
                          aria-label={t.close}
                          onClick={closeWizard}
                        >
                          ×
                        </button>
                      </div>

                      <div className={styles.steps} aria-hidden>
                        {[1, 2, 3].map((n) => (
                          <span
                            key={n}
                            className={`${styles.stepDot} ${
                              step >= n ? styles.stepDotOn : ""
                            }`}
                          />
                        ))}
                      </div>

                      <div className={styles.sheetBody}>
                        {step === 1 ? (
                          <>
                            <div className={styles.calHead}>
                              <button
                                type="button"
                                className={styles.calNav}
                                disabled={!canPrevMonth}
                                onClick={() => shiftMonth(-1)}
                              >
                                ‹
                              </button>
                              <p className={styles.calTitle}>
                                {monthLabel(viewYear, viewMonth, locale)}
                              </p>
                              <button
                                type="button"
                                className={styles.calNav}
                                onClick={() => shiftMonth(1)}
                              >
                                ›
                              </button>
                            </div>
                            <div className={styles.weekdays}>
                              {weekdays.map((w) => (
                                <span key={w} className={styles.weekday}>
                                  {w}
                                </span>
                              ))}
                            </div>
                            <div className={styles.days}>
                              {cells.map((cell, idx) => {
                                if (!cell) {
                                  return (
                                    <span
                                      key={`pad-${idx}`}
                                      className={`${styles.day} ${styles.dayMuted}`}
                                    />
                                  );
                                }
                                const past = cell.iso < todayISO;
                                const selected = cell.iso === date;
                                const dayRate = getBookingRate(cell.iso);
                                const weekend = dayRate === WEEKEND_PRICE;
                                return (
                                  <button
                                    key={cell.iso}
                                    type="button"
                                    disabled={past}
                                    className={[
                                      styles.day,
                                      past ? styles.dayDisabled : "",
                                      selected ? styles.daySelected : "",
                                      weekend ? styles.dayWeekend : "",
                                    ]
                                      .filter(Boolean)
                                      .join(" ")}
                                    onClick={() => selectDate(cell.iso)}
                                  >
                                    <span className={styles.dayNum}>
                                      {cell.day}
                                    </span>
                                    {!past ? (
                                      <span className={styles.dayPrice}>
                                        {dayRate}€
                                      </span>
                                    ) : null}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        ) : null}

                        {step === 2 ? (
                          <>
                            <p className={styles.hint}>{t.autoTable}</p>
                            <div className={styles.block}>
                              <span className={styles.blockLabel}>
                                {t.hours}
                              </span>
                              <div className={styles.segmentWide}>
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                  <button
                                    key={n}
                                    type="button"
                                    className={`${styles.chip} ${
                                      hours === n ? styles.chipActive : ""
                                    }`}
                                    onClick={() => {
                                      setHours(n);
                                      setTime("");
                                    }}
                                  >
                                    {n}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className={styles.block}>
                              <span className={styles.blockLabel}>
                                {t.time}
                                {rate !== null ? ` · ${rate}${t.perHour}` : ""}
                              </span>
                              {slotsLoading ? (
                                <p className={styles.slotsEmpty}>
                                  {t.loadingSlots}
                                </p>
                              ) : freeSlotCount === 0 ? (
                                <p className={styles.slotsEmpty}>{t.noSlots}</p>
                              ) : (
                                <div className={styles.slots}>
                                  {slots.map((slot) => {
                                    const freeN = freeTableCount(slot);
                                    const free = freeN > 0;
                                    const active = time === slot.time;
                                    const slotTotal = (rate ?? 0) * hours;
                                    const freeLabel = t.tablesFree.replace(
                                      "{n}",
                                      String(freeN),
                                    );
                                    return (
                                      <button
                                        key={slot.time}
                                        type="button"
                                        disabled={!free}
                                        className={[
                                          styles.slot,
                                          free ? "" : styles.slotBusy,
                                          active ? styles.slotActive : "",
                                        ]
                                          .filter(Boolean)
                                          .join(" ")}
                                        onClick={() => selectSlot(slot)}
                                      >
                                        <span className={styles.slotTime}>
                                          {slot.time}
                                        </span>
                                        <span className={styles.slotMeta}>
                                          {free
                                            ? `${slotTotal} € · ${freeLabel}`
                                            : t.busy}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                            {conflictError ? (
                              <p className={styles.error}>{t.conflictError}</p>
                            ) : null}
                          </>
                        ) : null}

                        {step === 3 ? (
                          <>
                            <div className={styles.summary}>
                              <p className={styles.summaryLine}>
                                {formatDateLong(date, locale)},{" "}
                                {formatTimeRange(time, hours)}
                              </p>
                              <p className={styles.summaryMuted}>
                                {tableLabel} · {hours} {hoursLabel}
                              </p>
                              <div className={styles.summaryTotal}>
                                <span>{t.total}</span>
                                <strong>
                                  {totalValue !== null
                                    ? `${totalValue} €`
                                    : "—"}
                                </strong>
                              </div>
                            </div>
                            <div className={styles.fields}>
                              <div className={styles.field}>
                                <label htmlFor="book-name">{t.name}</label>
                                <input
                                  id="book-name"
                                  autoComplete="name"
                                  placeholder={t.namePh}
                                  value={name}
                                  onChange={(e) => {
                                    setName(e.target.value);
                                    setSubmitError(false);
                                  }}
                                />
                              </div>
                              <div className={styles.field}>
                                <label htmlFor="book-phone">{t.phone}</label>
                                <input
                                  id="book-phone"
                                  type="tel"
                                  autoComplete="tel"
                                  placeholder={t.phonePh}
                                  value={phone}
                                  onChange={(e) => {
                                    setPhone(e.target.value);
                                    setSubmitError(false);
                                  }}
                                />
                              </div>
                            </div>
                            {submitError ? (
                              <p className={styles.error}>{t.submitError}</p>
                            ) : null}
                          </>
                        ) : null}
                      </div>

                      <div className={styles.sheetFoot}>
                        {step > 1 ? (
                          <button
                            type="button"
                            className={styles.ghost}
                            onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
                          >
                            {t.back}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={styles.ghost}
                            onClick={closeWizard}
                          >
                            {t.close}
                          </button>
                        )}
                        {step < 3 ? (
                          <button
                            type="button"
                            className={styles.primary}
                            disabled={!canContinue}
                            onClick={() => setStep((s) => (s === 1 ? 2 : 3))}
                          >
                            {t.continue}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={styles.primary}
                            disabled={!canContinue || submitting}
                            onClick={() => void submitBooking()}
                          >
                            {submitting ? t.submitting : t.submit}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>,
              document.body,
            )
          : null}
      </div>
    </section>
  );
}
