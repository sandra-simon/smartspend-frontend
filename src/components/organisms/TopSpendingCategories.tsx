import Card from "../atoms/Card";
import type { AnalyticsTopCategory } from "../../services/analyticsService";
import { formatCurrency } from "../../utils/currency";
import { getCategoryIcon } from "../../utils/categoryIcons";

interface TopSpendingCategoriesProps {
  categories: AnalyticsTopCategory[];
}

function TopSpendingCategories({ categories }: TopSpendingCategoriesProps) {
  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-card-title font-semibold text-text-primary">
          Top Spending Categories
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Detailed breakdown of monthly budget consumption and remaining
          balance.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="py-10 text-center text-sm text-text-secondary">
          No spending categories found for this month.
        </div>
      ) : (
        <div>
          {categories.map((category, index) => {
            const percentage = category.percentage_used;
            const progress = Math.min(Math.max(percentage ?? 0, 0), 100);

            const CategoryIcon = getCategoryIcon(category.icon);

            const isOverBudget =
              category.budget !== null &&
              category.budget > 0 &&
              category.spent >= category.budget * 0.9;

            const isComfortable = percentage !== null && percentage < 75;

            const progressColor =
              category.budget === null
                ? "bg-border"
                : isOverBudget
                  ? "bg-expense-dark"
                  : isComfortable
                    ? "bg-income-dark"
                    : "bg-brand";

            const statusColor =
              category.budget === null
                ? "bg-surface-muted text-text-secondary"
                : isOverBudget
                  ? "bg-expense/10 text-expense-dark"
                  : isComfortable
                    ? "bg-success-soft text-income-dark"
                    : "bg-brand-soft text-brand";

            const remainingColor =
              category.remaining !== null && category.remaining >= 0
                ? isComfortable
                  ? "text-income-dark"
                  : "text-text-primary"
                : "text-expense-dark";

            return (
              <div
                key={category.category_id}
                className={`grid grid-cols-1 gap-4 py-5 md:grid-cols-[minmax(190px,0.85fr)_minmax(0,1.25fr)_minmax(300px,auto)] md:items-center md:gap-6 ${
                  index > 0 ? "border-t border-border" : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
                      index === 0
                        ? "bg-brand text-white"
                        : "bg-violet-soft text-brand"
                    }`}
                  >
                    <CategoryIcon size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-text-primary">
                      {category.category_name}
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {category.transaction_count}{" "}
                      {category.transaction_count === 1
                        ? "transaction"
                        : "transactions"}
                    </p>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="mb-2 grid min-h-5 grid-cols-[auto_1fr] items-center gap-3 text-sm">
                    <span className="font-semibold text-text-primary">
                      {formatCurrency(category.spent)}
                    </span>

                    <span className="truncate text-right text-text-secondary">
                      {category.budget !== null
                        ? `Monthly limit: ${formatCurrency(category.budget)}`
                        : "No monthly budget set"}
                    </span>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-soft">
                    <div
                      className={`h-full rounded-full transition-all ${progressColor}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  {percentage !== null ? (
                    <span
                      className={`rounded-full px-3 py-2 text-xs font-semibold ${statusColor}`}
                    >
                      {percentage.toFixed(1)}% consumed
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface-muted px-3 py-2 text-xs font-semibold text-text-secondary">
                      No budget
                    </span>
                  )}

                  {category.remaining !== null ? (
                    <span className={`text-sm font-semibold ${remainingColor}`}>
                      {category.remaining < 0
                        ? `${formatCurrency(Math.abs(category.remaining))} over budget`
                        : `${formatCurrency(category.remaining)} remaining`}
                    </span>
                  ) : (
                    <span className="text-sm text-text-secondary">
                      Remaining unavailable
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default TopSpendingCategories;
