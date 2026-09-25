import type { Dictionary } from "@/lib/i18n/types";

type Props = { dict: Dictionary };

export default function StatsStrip({ dict }: Props) {
  return (
    <section className="stats-strip" aria-label={dict.stats.aria}>
      <div className="wrap stats-grid">
        {dict.stats.items.map((item) => (
          <div className="stat-item" key={item.label}>
            <p className="stat-line">{item.value}</p>
            <p className="stat-line">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
