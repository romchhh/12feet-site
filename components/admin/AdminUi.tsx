import type { BookingStatus } from "@/lib/cms/store";
import styles from "./AdminUi.module.css";
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  delta,
  trend = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <article className={styles.statCard}>
      <p className={styles.statLabel}>{label}</p>
      <div className={styles.statRow}>
        <span className={styles.statValue}>{value}</span>
        {delta ? (
          <span className={styles[`trend_${trend}`]}>{delta}</span>
        ) : null}
      </div>
      {hint ? <p className={styles.statHint}>{hint}</p> : null}
    </article>
  );
}

export function AdminPageHeader({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <h2 className={styles.pageHeaderTitle}>{title}</h2>
        {lead ? <p className={styles.pageHeaderLead}>{lead}</p> : null}
      </div>
      {action ? <div className={styles.pageHeaderAction}>{action}</div> : null}
    </header>
  );
}

export function AdminCard({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.card}>
      {title ? (
        <header className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
          {subtitle ? <p className={styles.cardSubtitle}>{subtitle}</p> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  new: "Нова",
  confirmed: "Підтверджено",
  cancelled: "Скасовано",
  completed: "Завершено",
  blocked: "Блок",
};

const STATUS_CLASS: Record<BookingStatus, string> = {
  new: styles.badge_new,
  confirmed: styles.badge_in_progress,
  cancelled: styles.badge_archived,
  completed: styles.badge_done,
  blocked: styles.badge_hidden,
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`${styles.badge} ${STATUS_CLASS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function bookingStatusLabel(status: BookingStatus) {
  return STATUS_LABELS[status];
}

export function GhostButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { className, ...rest } = props;
  return (
    <button
      type="button"
      className={[styles.ghostBtn, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}

export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { className, ...rest } = props;
  return (
    <button
      type="button"
      className={[styles.primaryBtn, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}

export function DangerButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { className, ...rest } = props;
  return (
    <button
      type="button"
      className={[styles.dangerBtn, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}

export function AdminTableWrap({ children }: { children: ReactNode }) {
  return <div className={styles.tableWrap}>{children}</div>;
}

export function AdminTable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <table className={[styles.table, className].filter(Boolean).join(" ")}>
      {children}
    </table>
  );
}

export function AdminEmpty({ children }: { children: ReactNode }) {
  return <p className={styles.empty}>{children}</p>;
}

export function AdminLoading() {
  return <p className={styles.loading}>Завантаження…</p>;
}

export function AdminField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function FilterChips({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className={styles.filters}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`${styles.filterChip} ${
            value === item.id ? styles.filterChipActive : ""
          }`}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function formatMoney(value: number) {
  return `${value.toLocaleString("uk-UA")} €`;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
