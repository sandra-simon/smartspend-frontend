import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  description?: string;
  descriptionClassName?: string;
  trend?: {
    value: string;
    label?: string;
    direction: "positive" | "negative" | "neutral";
  };
  iconColor?: string;
  iconBackground?: string;
  className?: string;
}

function StatCard({
  title,
  value,
  icon,
  description,
  descriptionClassName = "",
  trend,
  iconColor = "text-brand",
  iconBackground = "bg-brand-soft",
  className = "",
}: StatCardProps) {
  const trendStyles = {
    positive: "bg-success-soft text-income-dark",
    negative: "bg-expense/10 text-expense-dark",
    neutral: "bg-surface-muted text-text-secondary",
  };

  return (
    <article
      className={`rounded-card border border-border bg-surface p-5 shadow-card sm:p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-secondary">{title}</p>

          <p className="mt-2 break-words text-2xl font-bold tracking-tight text-text-primary">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-control ${iconBackground} ${iconColor}`}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {trend && (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${trendStyles[trend.direction]}`}
            >
              {trend.value}
            </span>
          )}

          {description && (
            <span
              className={`text-xs leading-5 text-text-secondary ${descriptionClassName}`}
            >
              {description}
            </span>
          )}

          {trend?.label && (
            <span className="text-xs text-text-secondary">{trend.label}</span>
          )}
        </div>
      )}
    </article>
  );
}

export default StatCard;
