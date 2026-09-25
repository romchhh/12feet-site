"use client";

import Link from "next/link";
import { localeLabels, locales, type Locale } from "@/lib/i18n/config";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type Props = {
  locale: Locale;
  variant?: "default" | "header" | "footer";
};

function GlobeIcon() {
  return (
    <svg
      className="lang-switch-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        d="M3 12h18M12 3c2.5 2.8 2.5 14.2 0 18M12 3c-2.5 2.8-2.5 14.2 0 18"
      />
    </svg>
  );
}

export default function LanguageSwitcher({
  locale,
  variant = "default",
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open, close]);

  const variantClass =
    variant !== "default" ? ` lang-switch--${variant}` : "";
  const showCode = variant === "header";

  return (
    <div
      ref={rootRef}
      className={`lang-switch${variantClass}${open ? " is-open" : ""}`}
    >
      <button
        type="button"
        className="lang-switch-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={menuId}
        aria-label="Choose language"
        onClick={() => setOpen((v) => !v)}
      >
        <GlobeIcon />
        <span className="lang-switch-current">
          {showCode ? locale.toUpperCase() : localeLabels[locale]}
        </span>
      </button>
      <ul
        id={menuId}
        className="lang-switch-menu"
        role="listbox"
        aria-label="Languages"
        hidden={!open}
      >
        {locales.map((code) => (
          <li key={code} role="option" aria-selected={code === locale}>
            <Link
              href={`/${code}`}
              className={code === locale ? "active" : undefined}
              hrefLang={code}
              lang={code}
              onClick={close}
            >
              {showCode ? (
                <>
                  <span className="lang-switch-code">{code.toUpperCase()}</span>
                  <span className="lang-switch-name">{localeLabels[code]}</span>
                </>
              ) : (
                localeLabels[code]
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
