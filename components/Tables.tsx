import SectionHead from "@/components/SectionHead";
import type { Dictionary } from "@/lib/i18n/types";

type Props = { dict: Dictionary };

export default function Tables({ dict }: Props) {
  const t = dict.tables;
  const prices = [
    { title: t.weekdayTitle, subtitle: t.weekdaySub, price: 20 },
    { title: t.weekendTitle, subtitle: t.weekendSub, price: 25 },
  ];

  return (
    <section className="block" id="tables">
      <SectionHead kicker={t.titleSans} title={t.titleSerif} lead={t.lead} />
      <div className="wrap">
        <div className="card-grid cols-2" id="prices">
          {prices.map((row) => (
            <article className="ui-card price-card" key={row.title}>
              <p className="card-title">{row.subtitle}</p>
              <h3 className="card-title">{row.title}</h3>
              <p className="card-title price-line">
                {row.price} {t.perHour}
              </p>
            </article>
          ))}
        </div>
        <p className="prose-block">{t.note}</p>
        <div className="card-grid cols-3">
          {t.specs.map((spec) => (
            <article className="ui-card" key={spec.title}>
              <h3 className="card-title">{spec.title}</h3>
              <p className="card-text">{spec.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
