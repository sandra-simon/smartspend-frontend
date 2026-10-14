import AppLayout from "../layouts/AppLayout";
import AnalyticsSummary from "../components/organisms/AnalyticsSummary";
import AnalyticsCharts from "../components/organisms/AnalyticsCharts";
import TopSpendingCategories from "../components/organisms/TopSpendingCategories";
import useAnalytics from "../hooks/useAnalytics";
import LoadingState from "../components/molecules/LoadingState";
import AlertMessage from "../components/molecules/AlertMessage";

function AnalyticsPage() {
  const {
    period,
    setPeriod,
    summary,
    spendingBreakdown,
    cashflowTrend,
    topCategories,
    isLoading,
    error,
    reload,
  } = useAnalytics();

  return (
    <AppLayout wide>
      <div className="space-y-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              Financial Analytics
            </h1>
            <p className="mt-2 text-text-secondary">
              Understand your spending habits and track your financial progress.
            </p>
          </div>

          <div className="flex self-start rounded-control border border-border bg-surface p-1 shadow-card">
            {(["weekly", "monthly", "yearly"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPeriod(option)}
                className={`rounded-control px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  period === option
                    ? "bg-brand text-white"
                    : "text-text-secondary hover:bg-brand-soft hover:text-brand"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <AlertMessage message={error} variant="error" />
        )}

        {isLoading ? (
          <LoadingState message="Loading analytics..." />
        ) : summary && spendingBreakdown && cashflowTrend && topCategories ? (
          <>
            <AnalyticsSummary summary={summary} />

            <AnalyticsCharts
              spendingBreakdown={spendingBreakdown}
              cashflowTrend={cashflowTrend}
            />

            <TopSpendingCategories categories={topCategories.categories} />
          </>
        ) : (
          <div className="rounded-card border border-border bg-surface p-8 text-center">
            <p className="font-medium text-text-primary">
              Unable to load analytics.
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Please try again.
            </p>
            <button
              type="button"
              onClick={reload}
              className="mt-4 rounded-control bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default AnalyticsPage;