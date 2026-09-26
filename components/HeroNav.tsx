"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { useCallback, useEffect, useState } from "react";

type Props = {
  locale: Locale;
  dict: Dictionary;
};

export default function HeroNav({ locale, dict }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const n = dict.nav;

  const links = [
    { href: "#tables", label: n.tables },
    { href: "#prices", label: n.prices },
    { href: "#menu", label: n.menu },
    { href: "#visit", label: n.visit },
  ];

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById("top");
      const threshold = hero
        ? Math.max(hero.offsetHeight - 100, 240)
        : window.innerHeight * 0.75;
      setScrolled(window.scrollY > threshold);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const headClass = [
    "hero-head",
    open ? "menu-open" : "",
    scrolled ? "is-scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={headClass}>
      <nav className={`nav${open ? " nav-open" : ""}`} aria-label={n.aria}>
        <div className="nav-brand">
          <a href="#top" className="logo" onClick={close}>
            12
          </a>
        </div>

        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-end">
          <div className="nav-mobile-cluster">
            <LanguageSwitcher locale={locale} variant="header" />
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={open}
              aria-controls="nav-menu"
              aria-label={open ? n.closeMenu : n.openMenu}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="nav-toggle-lines" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
          <a href="#book" className="btn green nav-cta" aria-label={n.book}>
            <span className="btn-label nav-cta-label nav-cta-label--long">
              {n.book}
            </span>
            <span className="btn-label nav-cta-label nav-cta-label--short">
              {n.bookShort}
            </span>
            <i aria-hidden="true">→</i>
          </a>
        </div>
      </nav>

      <div
        id="nav-menu"
        className={`nav-panel${open ? " open" : ""}`}
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
        aria-label={n.menuDialog}
      >
        <div className="nav-panel-top">
          <div className="nav-brand nav-brand--panel">
            <a href="#top" className="logo nav-panel-logo" onClick={close}>
              12
            </a>
          </div>
          <button
            type="button"
            className="nav-panel-close"
            aria-label={n.closeMenu}
            onClick={close}
          >
            <span aria-hidden="true" />
          </button>
        </div>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={close}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-panel-actions">
          <LanguageSwitcher locale={locale} variant="header" />
          <a href="#book" className="btn gold nav-panel-cta" onClick={close}>
            <span className="btn-label">{n.book}</span>
            <i aria-hidden="true">→</i>
          </a>
        </div>
      </div>

      <a
        href="#book"
        className={[
          "btn",
          "green",
          "book-fab",
          scrolled && !open ? "is-visible" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label={n.book}
      >
        <span className="btn-label">{n.book}</span>
        <i aria-hidden="true">→</i>
      </a>
    </div>
  );
}
