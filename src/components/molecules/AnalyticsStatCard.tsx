import { ArrowDown, ArrowUp, PiggyBank } from "lucide-react";
import StatCard from "./StatCard";

interface AnalyticsStatCardProps {
  title: string;
  value: string;
  kind: "income" | "expenses" | "savings";
  change?: number | null;
  comparisonLabel: string;
  savingsRate?: number;
}

function AnalyticsStatCard({
  title,
  value,
  kind,
  change,
  comparisonLabel,
  savingsRate,
}: AnalyticsStatCardProps) {
  const isIncome = kind === "income";
  const isSavings = kind === "savings";
  const hasComparison = change !== null && change !== undefined;
  const isPositive = (change ?? 0) >= 0;

  const icon = isSavings ? (
    <PiggyBank size={19} />
  ) : isIncome ? (
    <ArrowDown size={19} />
  ) : (
    <ArrowUp size={19} />
  );

  const iconColor = isSavings
    ? "text-brand"
    : isIncome
      ? "text-income-dark"
      : "text-expense-dark";

  const iconBackground = isSavings
    ? "bg-violet-soft"
    : isIncome
      ? "bg-success-soft"
      : "bg-expense/10";

  const trendDirection =
    (isIncome || isSavings) === isPositive ? "positive" : "negative";

  const trend =
    !isSavings && hasComparison
      ? {
          value: `${isPositive ? "+" : ""}${change!.toFixed(1)}%`,
          direction: trendDirection as "positive" | "negative",
        }
      : undefined;

  const description = isSavings
    ? savingsRate !== undefined
      ? `Savings rate · ${savingsRate.toFixed(1)}% of income`
      : undefined
    : hasComparison
      ? `vs ${comparisonLabel}`
      : "No previous-period data";

  return (
    <StatCard
      title={title}
      value={value}
      icon={icon}
      iconColor={iconColor}
      iconBackground={iconBackground}
      trend={trend}
      description={description}
      descriptionClassName={
        isSavings ? "rounded-full bg-violet-soft px-2.5 py-1 text-brand" : ""
      }
      className="h-full border-transparent"
    />
  );
}

export default AnalyticsStatCard;
