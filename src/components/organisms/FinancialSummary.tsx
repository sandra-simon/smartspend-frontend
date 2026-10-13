
import { ArrowDownLeft, ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";

import type { DashboardSummary } from "../../services/dashboardService";
import { formatCurrency } from "../../utils/currency";

interface FinancialSummaryProps {
  summary: DashboardSummary | null;
}


function FinancialSummary({ summary }: FinancialSummaryProps) {
  const retained = summary?.cashflow.retained_percentage ?? 0;
  const burned = summary?.cashflow.burned_percentage ?? 0;

  const comparison = summary?.comparison;
  const changePercentage =
    comparison?.net_available_capital_change_percentage ?? null;
  const changeAmount =
    comparison?.net_available_capital_change ?? null;

  const formattedPreviousPeriod = comparison?.previous_period_label.replace(
    /^([A-Za-z]+)\s+(\d{4})$/,
    (_, month, year) => `${month.slice(0, 3)} ${year}`,
  );

  const comparisonIsPositive =
    changePercentage != null && changePercentage > 0;
  const comparisonIsNegative =
    changePercentage != null && changePercentage < 0;

  const comparisonClass =
    changePercentage == null || changePercentage === 0
      ? "bg-surface-muted text-text-secondary"
      : comparisonIsPositive
        ? "bg-success-soft text-income-dark"
        : "bg-expense/10 text-expense-dark";

  return (
    <section className="rounded-2xl bg-white p-6 shadow-card sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-text-secondary">
            Net Available Capital
          </p>

          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {summary ? formatCurrency(summary.net_available_capital) : "—"}
            </h2>
            <span className="text-xs text-text-secondary">INR</span>
          </div>
        </div>

        {comparison &&
          (changePercentage != null || changeAmount != null) && (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${comparisonClass}`}
            >
              {changePercentage != null ? (
                <>
                  {comparisonIsPositive && (
                    <TrendingUp className="mr-1 inline h-3.5 w-3.5" />
                  )}

                  {comparisonIsNegative && (
                    <TrendingDown className="mr-1 inline h-3.5 w-3.5" />
                  )}

                  {changePercentage > 0 ? "+" : ""}
                  {changePercentage.toFixed(1)}%
                </>
              ) : (
                <>
                  {changeAmount! > 0 ? "+" : changeAmount! < 0 ? "−" : ""}
                  {formatCurrency(Math.abs(changeAmount!))}
                </>
              )}

              {formattedPreviousPeriod && (
                <>{" "}vs {formattedPreviousPeriod}</>
              )}
            </span>
          )}
      </div>

      <div className="mt-7 grid grid-cols-1 gap-3 rounded-xl bg-input p-4 sm:grid-cols-2 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-soft text-income-dark">
            <ArrowDownLeft className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <p className="text-xs text-text-secondary">Total Income</p>
            <p className="mt-1 break-words text-lg font-bold text-income-dark">
              {summary ? `+${formatCurrency(summary.total_income)}` : "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-expense/10 text-expense-dark">
            <ArrowUpRight className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <p className="text-xs text-text-secondary">Total Expenses</p>
            <p className="mt-1 break-words text-lg font-bold text-expense-dark">
              {summary ? `-${formatCurrency(summary.total_expenses)}` : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-text-secondary">
            Monthly Cashflow Ratio
          </span>
          <span className="font-bold">
            {retained.toFixed(0)}% Retained / {burned.toFixed(0)}% Burned
          </span>
        </div>

        <div
          className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-border"
          aria-label={`${burned.toFixed(1)} percent burned and ${retained.toFixed(1)} percent retained`}
        >
          <div
            className="bg-income-dark transition-all"
            style={{
              width: `${Math.max(0, Math.min(100, retained))}%`,
            }}
          />
          <div
            className="bg-expense-dark transition-all"
            style={{
              width: `${Math.max(0, Math.min(100, burned))}%`,
            }}
          />
        </div>

        <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-text-secondary">
          <span>
            <span className="mr-1 text-income-dark">●</span>
            Net Reserve:{" "}
            {summary ? formatCurrency(summary.net_available_capital) : "—"}
          </span>
          <span>
            <span className="mr-1 text-expense-dark">●</span>
            Operating Outflow:{" "}
            {summary ? formatCurrency(summary.total_expenses) : "—"}
          </span>
        </div>
      </div>
    </section>
  );
}

export default FinancialSummary;
