import { Trophy } from "lucide-react";
import Card from "../atoms/Card";
import type { AnalyticsTopCategory } from "../../services/analyticsService";
import { formatCurrency } from "../../utils/currency";
import { getCategoryIcon } from "../../utils/categoryIcons";

interface TopSpendingCategoriesProps {
  categories: AnalyticsTopCategory[];
}

function TopSpendingCategories({
  categories,
}: TopSpendingCategoriesProps) {
  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-card-title font-semibold text-text-primary">
          Top Spending Categories
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          See where your money goes and track your budget usage.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="py-10 text-center text-sm text-text-secondary">
          No spending categories found for this period.
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category, index) => {
            const percentage = category.percentage_used;
            const progress = Math.min(Math.max(percentage ?? 0, 0), 100);
            const CategoryIcon = getCategoryIcon(category.icon);

            return (
              <div
                key={category.category_id}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-soft text-brand">
                    {index === 0 ? (
                      <Trophy size={19} />
                    ) : (
                      <CategoryIcon size={19} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-primary">
                      {category.category_name}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {category.transaction_count}{" "}
                      {category.transaction_count === 1
                        ? "transaction"
                        : "transactions"}
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-56">
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-text-primary">
                      {formatCurrency(category.spent)}
                    </span>
                    {percentage !== null ? (
                      <span className="text-text-secondary">
                        {percentage.toFixed(1)}% used
                      </span>
                    ) : (
                      <span className="text-text-secondary">
                        No budget set
                      </span>
                    )}
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-violet-soft">
                    <div
                      className="h-full rounded-full bg-brand transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {category.budget !== null && (
                    <p className="mt-1 text-xs text-text-secondary">
                      {category.remaining !== null
                        ? `${formatCurrency(category.remaining)} remaining`
                        : `Budget: ${formatCurrency(category.budget)}`}
                    </p>
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