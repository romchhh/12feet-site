import SectionHead from "@/components/SectionHead";
import type { MenuColumn } from "@/types";
import type { Dictionary } from "@/lib/i18n/types";

type Props = {
  dict: Dictionary;
  menuColumns?: MenuColumn[];
};

export default function Menu({ dict, menuColumns }: Props) {
  const t = dict.menu;
  const columns = menuColumns ?? t.columns;
  return (
    <section className="block" id="menu">
      <div className="wrap">
        <SectionHead kicker={t.titleSans} title={t.titleSerif} lead={t.lead} />
        <div className="card-grid cols-3">
          {columns.map((col) => (
            <article className="ui-card menu-card" key={col.heading}>
              <h3 className="card-title menu-card-title">{col.heading}</h3>
              <ul className="menu-lines">
                {col.items.map((item) => (
                  <li key={item.name}>
                    <span>{item.name}</span>
                    <span>{item.price}</span>
                  </li>
                ))}
              </ul>
              {col.subheading && (
                <p className="card-title menu-card-sub">{col.subheading}</p>
              )}
              {col.subItems && (
                <ul className="menu-sub">
                  {col.subItems.map((sub) => (
                    <li key={sub}>{sub}</li>
                  ))}
                </ul>
              )}
              {col.note && <p className="card-text menu-note">{col.note}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
