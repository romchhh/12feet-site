import SectionHead from "@/components/SectionHead";
import type { Dictionary } from "@/lib/i18n/types";

type Props = { dict: Dictionary };

export default function Faq({ dict }: Props) {
  const t = dict.faq;
  return (
    <section className="block block-faq" id="faq">
      <div className="wrap">
        <SectionHead kicker={t.titleSans} title={t.titleSerif} lead={t.lead} />
        <div className="faq-grid">
          {t.items.map((item, i) => (
            <details className="faq-item" key={item.q}>
              <summary>
                <span className="faq-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="faq-q">{item.q}</span>
                <span className="faq-toggle" aria-hidden="true" />
              </summary>
              <div className="faq-a">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
