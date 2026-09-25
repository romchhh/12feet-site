import SectionHead from "@/components/SectionHead";
import type { Dictionary } from "@/lib/i18n/types";

type Props = { dict: Dictionary };

export default function ClubIntro({ dict }: Props) {
  const t = dict.about;
  return (
    <section className="block" id="about">
      <SectionHead kicker={t.titleSans} title={t.titleSerif} lead={t.lead} />
      <div className="wrap">
        <p className="prose-block">{t.extra}</p>
        <div className="card-grid cols-3">
          <article className="ui-card">
            <p className="card-title">{t.addressKicker}</p>
            <h3 className="card-title">{t.addressTitle}</h3>
            <p className="card-text">{t.addressText}</p>
          </article>
          <article className="ui-card">
            <p className="card-title">{t.hoursKicker}</p>
            <h3 className="card-title">{t.hoursTitle}</h3>
            <p className="card-text">{t.hoursText}</p>
          </article>
          <article className="ui-card">
            <p className="card-title">{t.bookKicker}</p>
            <h3 className="card-title">{t.bookTitle}</h3>
            <p className="card-text">
              <a href="#book" className="card-link">
                {t.bookLink}
              </a>
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
