import type { Dictionary } from "@/lib/i18n/types";

type Props = { dict: Dictionary };

export default function CtaBand({ dict }: Props) {
  const t = dict.cta;
  return (
    <section className="cta-band">
      <div className="wrap cta-band-inner">
        <div>
          <h2 className="cta-band-title">{t.title}</h2>
          <p className="cta-band-text">{t.text}</p>
        </div>
        <a href="#book" className="btn gold btn-lg cta-band-btn">
          <span className="btn-label">{t.button}</span>
          <i aria-hidden="true">→</i>
        </a>
      </div>
    </section>
  );
}
