import SectionHead from "@/components/SectionHead";
import type { Dictionary } from "@/lib/i18n/types";

type Props = { dict: Dictionary };

export default function Experience({ dict }: Props) {
  const t = dict.experience;
  return (
    <section className="block" id="experience">
      <div className="wrap">
        <SectionHead kicker={t.titleSans} title={t.titleSerif} lead={t.lead} />
        <div className="card-grid cols-2">
          {t.items.map((item, i) => (
            <article className="ui-card" key={item.title}>
              <h3 className="card-title">
                {String(i + 1).padStart(2, "0")} · {item.title}
              </h3>
              <p className="card-text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
