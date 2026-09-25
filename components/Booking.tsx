"use client";

import SectionHead from "@/components/SectionHead";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { getBookingRate } from "@/lib/booking-rates";
import { useMemo, useState } from "react";

const dateLocales: Record<Locale, string> = {
  sk: "sk-SK",
  en: "en-GB",
  ru: "ru-RU",
  uk: "uk-UA",
  de: "de-DE",
};

function formatDate(dateStr: string, locale: Locale): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(dateLocales[locale], {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export default function Booking({ locale, dict }: Props) {
  const t = dict.book;
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [table, setTable] = useState(t.table1);
  const [hours, setHours] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [conflictError, setConflictError] = useState(false);

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const rate = useMemo(() => {
    if (!date) return null;
    return getBookingRate(date);
  }, [date]);

  const total = useMemo(() => {
    if (!date || rate === null) return "—";
    return `${rate * hours} €`;
  }, [date, hours, rate]);

  const summaryReady = Boolean(date && time && table && name && phone);

  const hoursLabel =
    hours === 1 ? t.hourUnit : hours < 5 ? t.hoursUnit : t.hoursUnitMany;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!summaryReady || submitting) return;

    setSubmitting(true);
    setSubmitError(false);
    setConflictError(false);
    setSubmitted(false);

    const tableNumber = table === t.table1 ? 1 : 2;

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
        setConflictError(true);
        return;
      }

      if (!res.ok) {
        setSubmitError(true);
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="block" id="book">
      <div className="wrap">
        <SectionHead kicker={t.titleSans} title={t.titleSerif} lead={t.lead} />
        <form className="book-form ui-card" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="d">{t.date}</label>
            <input
              type="date"
              id="d"
              min={todayISO}
              required
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSubmitted(false);
                setSubmitError(false);
                setConflictError(false);
              }}
            />
          </div>
          <div className="field">
            <label htmlFor="time-input">{t.time}</label>
            <input
              type="time"
              id="time-input"
              min="12:00"
              max="23:30"
              step={900}
              required
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                setSubmitted(false);
                setSubmitError(false);
                setConflictError(false);
              }}
            />
          </div>
          <div className="field">
            <label htmlFor="tb">{t.table}</label>
            <select
              id="tb"
              value={table}
              onChange={(e) => setTable(e.target.value)}
            >
              <option>{t.table1}</option>
              <option>{t.table2}</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="h">{t.hours}</label>
            <select
              id="h"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="n">{t.name}</label>
            <input
              id="n"
              placeholder={t.namePh}
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSubmitError(false);
              }}
            />
          </div>
          <div className="field">
            <label htmlFor="p">{t.phone}</label>
            <input
              id="p"
              type="tel"
              placeholder={t.phonePh}
              required
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setSubmitError(false);
              }}
            />
          </div>

          <div className="field full book-preview" aria-live="polite">
            {date ? (
              <>
                <p className="preview-line">
                  {formatDate(date, locale)}, {time}
                </p>
                <p className="preview-line">
                  {table} · {hours} {hoursLabel} · {rate}
                  {t.perHour}
                </p>
              </>
            ) : (
              <p className="preview-muted">{t.previewEmpty}</p>
            )}
          </div>

          <div className="field full book-footer">
            <div className="book-total">
              <span>{t.total}</span>
              <strong>{total}</strong>
            </div>
            <button
              className="btn green btn-lg"
              type="submit"
              disabled={!summaryReady || submitting}
            >
              <span className="btn-label">
                {submitting ? t.submitting : t.submit}
              </span>
              <i aria-hidden="true">→</i>
            </button>
          </div>
          <p
            className={`book-error full${submitError || conflictError ? " show" : ""}`}
          >
            {conflictError
              ? locale === "uk"
                ? "Цей слот уже зайнятий. Оберіть інший час або стіл."
                : locale === "ru"
                  ? "Этот слот уже занят. Выберите другое время или стол."
                  : locale === "sk"
                    ? "Tento termín je obsadený. Zvoľte iný čas alebo stôl."
                    : locale === "de"
                      ? "Dieser Slot ist belegt. Bitte andere Zeit oder Tisch wählen."
                      : "This slot is taken. Please choose another time or table."
              : t.submitError}
          </p>
          <p className={`book-done full${submitted ? " show" : ""}`}>
            {t.done} {date} {time}, {table}.
          </p>
        </form>
      </div>
    </section>
  );
}
