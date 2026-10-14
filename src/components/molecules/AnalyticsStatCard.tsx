
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
    change === null || change === undefined
      ? "neutral"
      : (isIncome || isSavings) === isPositive
        ? "positive"
        : "negative";

  const trend = isSavings
    ? undefined
    : change === null || change === undefined
      ? undefined
      : {
          value: `${isPositive ? "+" : ""}${change.toFixed(1)}%`,
          direction: trendDirection as "positive" | "negative" | "neutral",
        };

  return (
    <StatCard
      title={title}
      value={value}
      icon={icon}
      iconColor={iconColor}
      iconBackground={iconBackground}
      trend={trend}
      description={
        isSavings && savingsRate !== undefined
          ? `${savingsRate.toFixed(1)}% savings rate`
          : comparisonLabel
      }
      className="h-full border-transparent"
    />
  );
}

export default AnalyticsStatCard;
