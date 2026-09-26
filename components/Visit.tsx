import SectionHead from "@/components/SectionHead";
import type { Dictionary } from "@/lib/i18n/types";
import { sitePhoneDisplay, sitePhoneTel } from "@/lib/site";

const MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=Z%C3%A1hradn%C3%ADcka+36+Bratislava";
const MAP_EMBED =
  "https://maps.google.com/maps?q=Z%C3%A1hradn%C3%ADcka+36,+811+07+Bratislava,+Slovakia&hl=sk&z=16&output=embed";

type Props = { dict: Dictionary };

export default function Visit({ dict }: Props) {
  const t = dict.visit;
  return (
    <section className="block" id="visit">
      <div className="wrap">
        <SectionHead kicker={t.titleSans} title={t.titleSerif} lead={t.lead} />
        <div className="visit-grid">
          <ul className="visit-bullets ui-card">
            {t.bullets.map((line) => (
              <li key={line}>
                {line === sitePhoneDisplay ? (
                  <a className="visit-phone-link" href={`tel:${sitePhoneTel}`}>
                    {line}
                  </a>
                ) : (
                  line
                )}
              </li>
            ))}
          </ul>
          <div className="ui-card visit-map-wrap">
            <iframe
              className="visit-map-frame"
              title="12 FEET — Záhradnícka 36, Bratislava"
              src={MAP_EMBED}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="visit-map-cap">
              <p>
                Záhradnícka 36 · Bratislava ·{" "}
                <a className="visit-phone-link" href={`tel:${sitePhoneTel}`}>
                  {sitePhoneDisplay}
                </a>
              </p>
              <a href={MAP_LINK} target="_blank" rel="noopener noreferrer">
                {t.mapLabel} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
