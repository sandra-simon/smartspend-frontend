
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Wallet } from "lucide-react";

import type { ExpenseSplit as ExpenseSplitData } from "../../services/dashboardService";
import { formatCurrency } from "../../utils/currency";

interface ExpenseSplitProps {
  expenseSplit: ExpenseSplitData | null;
}

const chartColors = [
  "var(--color-brand)",
  "var(--color-brand-muted)",
  "var(--color-expense)",
  "var(--color-border)",
  "var(--color-income)",
  "var(--color-brand-soft)",
];

const compactMoney = (amount: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

function ExpenseSplit({ expenseSplit }: ExpenseSplitProps) {
  const donutData = (expenseSplit?.categories ?? []).filter(
    (category) => category.amount > 0,
  );

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 text-text-primary shadow-card sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-brand">Expense Split</h2>
          <p className="mt-1 text-sm text-text-secondary">
            By categories this month
          </p>
        </div>

        <p className="pt-1 text-right text-sm font-bold">
          {expenseSplit
            ? `${formatCurrency(expenseSplit.total_expenses)} Total`
            : "—"}
        </p>
      </div>

      {donutData.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 items-center gap-4 sm:grid-cols-[minmax(145px,0.85fr)_minmax(0,1.15fr)]">
          <div className="relative mx-auto h-[210px] w-full max-w-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="amount"
                  nameKey="category_name"
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={3}
                  stroke="none"
                >
                  {donutData.map((item, index) => (
                    <Cell
                      key={item.category_id}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold">
                {expenseSplit?.top_category?.percentage.toFixed(0) ?? 0}%
              </span>
              <span className="max-w-[105px] text-xs text-text-secondary">
                {expenseSplit?.top_category?.category_name ?? "No expenses"}
              </span>
            </div>
          </div>

          <div className="min-w-0 space-y-4">
            {donutData.map((category, index) => (
              <div
                key={category.category_id}
                className="flex min-w-0 items-center gap-2 text-xs"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      chartColors[index % chartColors.length],
                  }}
                />
                <span className="min-w-0 flex-1 truncate font-semibold">
                  {category.category_name}
                </span>
                <span className="shrink-0 text-right font-bold">
                  {compactMoney(category.amount)}
                </span>
                <span className="w-10 shrink-0 text-right text-text-secondary">
                  ({category.percentage.toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
          <Wallet className="h-9 w-9 text-brand-muted" />
          <p className="mt-3 text-sm font-semibold">
            No expenses this month
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            Add an expense to see your category breakdown.
          </p>
        </div>
      )}
    </section>
  );
}

export default ExpenseSplit;
