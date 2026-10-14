
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Card from "../atoms/Card";
import type { AnalyticsSpendingBreakdown } from "../../services/analyticsService";
import { formatCurrency } from "../../utils/currency";

interface SpendingBreakdownChartProps {
  data: AnalyticsSpendingBreakdown;
}

const chartColors = [
  "#1e1b4b",
  "#ef4444",
  "#8585bd",
  "#57558b",
  "#484579",
  "#15803d",
  "#64748b",
  "#a78bfa",
];

function compactCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

function SpendingBreakdownChart({ data }: SpendingBreakdownChartProps) {
  const categories = data.categories.filter((category) => category.amount > 0);
  const topCategory = data.top_category;

  return (
    <Card className="h-full" padding="lg">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-brand">
            Spending Breakdown
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Total spend per category with percentage splits
          </p>
        </div>

        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
          {data.period.label}
        </span>
      </div>

      {categories.length === 0 ? (
        <div className="flex min-h-[260px] items-center justify-center text-center text-sm text-text-secondary">
          No spending data available for this period.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 items-center gap-5 sm:grid-cols-2">
          <div className="relative mx-auto h-[240px] w-full max-w-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="amount"
                  nameKey="category_name"
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="82%"
                  paddingAngle={1}
                  stroke="none"
                >
                  {categories.map((category, index) => (
                    <Cell
                      key={category.category_id}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Total
              </span>
              <span className="mt-1 text-xl font-bold text-brand">
                {compactCurrency(data.total_expenses)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2">
            {categories.map((category, index) => (
              <div
                key={category.category_id}
                className="flex min-w-0 items-start gap-2"
              >
                <span
                  className="mt-1.5 size-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      chartColors[index % chartColors.length],
                  }}
                />

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-text-primary">
                    {category.category_name}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {category.percentage.toFixed(1)}% (
                    {compactCurrency(category.amount)})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-control bg-canvas px-4 py-3">
        <span className="text-xs text-text-secondary">
          Highest outflow category
        </span>
        <span className="text-xs font-bold text-brand">
          {topCategory
            ? `${topCategory.category_name} (${topCategory.percentage.toFixed(1)}%)`
            : "No spending recorded"}
        </span>
      </div>
    </Card>
  );
}

export default SpendingBreakdownChart;
