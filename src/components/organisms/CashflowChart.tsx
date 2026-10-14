
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "../atoms/Card";
import type { AnalyticsCashflowTrend } from "../../services/analyticsService";
import { formatCurrency } from "../../utils/currency";

interface CashflowChartProps {
  data: AnalyticsCashflowTrend;
}

function compactCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(amount);
}

function CashflowChart({ data }: CashflowChartProps) {
  return (
    <Card className="h-full" padding="lg">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-brand">
          Income vs. Expense
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Comparative cash flow for {data.period.label.toLowerCase()}
        </p>
      </div>

      {data.data.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center text-center text-sm text-text-secondary">
          No cash-flow data available for this period.
        </div>
      ) : (
        <div className="mt-6 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.data}
              margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
              barGap={5}
            >
              <CartesianGrid
                stroke="var(--color-border)"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tick={{ fill: "var(--color-text-secondary)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={12}
              />

              <YAxis
                tickFormatter={(value: number) => compactCurrency(value)}
                tick={{ fill: "var(--color-text-secondary)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={58}
              />

              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-card)",
                }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingBottom: "20px",
                  fontSize: "12px",
                }}
              />

              <Bar
                dataKey="income"
                name="Income"
                fill="#15803d"
                radius={[3, 3, 0, 0]}
                maxBarSize={18}
              />

              <Bar
                dataKey="expenses"
                name="Expense"
                fill="#b91c1c"
                radius={[3, 3, 0, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

export default CashflowChart;
