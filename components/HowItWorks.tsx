import SectionHead from "@/components/SectionHead";
import type { Dictionary } from "@/lib/i18n/types";

type Props = { dict: Dictionary };

export default function HowItWorks({ dict }: Props) {
  const t = dict.how;
  return (
    <section className="block block-how" id="how">
      <div className="wrap">
        <SectionHead kicker={t.titleSans} title={t.titleSerif} lead={t.lead} />
        <ol className="how-track">
          {t.steps.map((step, i) => (
            <li className="how-step" key={step.title}>
              <span className="how-step-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="how-step-body">
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="how-cta">
          <a href="#book" className="btn green btn-lg">
            <span className="btn-label">{dict.cta.button}</span>
            <i aria-hidden="true">→</i>
          </a>
        </div>
      </div>
    </section>
  );
}
