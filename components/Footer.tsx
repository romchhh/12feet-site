import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

type Props = {
  dict: Dictionary;
  locale: Locale;
};

export default function Footer({ dict, locale }: Props) {
  const t = dict.footer;
  return (
    <footer className="site-footer" id="visit-footer">
      <div className="wrap footer-inner">
        <p className="footer-logo">{t.logo}</p>
        <div className="footer-cols">
          <p>{t.address}</p>
          <p>{t.hours}</p>
          <p>
            <a href="#book" className="inline-link-light">
              {t.book}
            </a>
          </p>
        </div>
        <LanguageSwitcher locale={locale} variant="footer" />
        <p className="footer-tag">{t.tag}</p>
        <p className="footer-credit">
          Created by{" "}
          <a
            href="https://telebots.site/en"
            target="_blank"
            rel="noopener noreferrer"
          >
            TeleBots
          </a>
        </p>
      </div>
    </footer>
  );
}
