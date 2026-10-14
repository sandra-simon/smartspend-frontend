import SpendingBreakdownChart from "./SpendingBreakdownChart";
import CashflowChart from "./CashflowChart";
import type {
  AnalyticsSpendingBreakdown,
  AnalyticsCashflowTrend,
} from "../../services/analyticsService";

interface AnalyticsChartsProps {
  spendingBreakdown: AnalyticsSpendingBreakdown;
  cashflowTrend: AnalyticsCashflowTrend;
}

function AnalyticsCharts({
  spendingBreakdown,
  cashflowTrend,
}: AnalyticsChartsProps) {
  return (
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <SpendingBreakdownChart data={spendingBreakdown} />
      <CashflowChart data={cashflowTrend} />
    </section>
  );
}

export default AnalyticsCharts;