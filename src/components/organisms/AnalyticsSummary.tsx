import AnalyticsStatCard from "../molecules/AnalyticsStatCard";
import type { AnalyticsSummary as AnalyticsSummaryData } from "../../services/analyticsService";
import { formatCurrency } from "../../utils/currency";

interface AnalyticsSummaryProps {
  summary: AnalyticsSummaryData;
}

function AnalyticsSummary({ summary }: AnalyticsSummaryProps) {
  const { comparison, total_income, total_expenses, net_savings } = summary;

  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <AnalyticsStatCard
        title="TOTAL INCOME"
        value={formatCurrency(total_income)}
        kind="income"
        change={comparison.income_change_percentage}
        comparisonLabel={comparison.previous_period_label}
      />

      <AnalyticsStatCard
        title="TOTAL SPEND"
        value={formatCurrency(total_expenses)}
        kind="expenses"
        change={comparison.expense_change_percentage}
        comparisonLabel={comparison.previous_period_label}
      />

      <AnalyticsStatCard
        title="NET SAVINGS"
        value={formatCurrency(net_savings)}
        kind="savings"
        change={comparison.net_savings_change_percentage}
        comparisonLabel={comparison.previous_period_label}
        savingsRate={
          total_income > 0 ? (net_savings / total_income) * 100 : 0
        }
      />
    </section>
  );
}

export default AnalyticsSummary;