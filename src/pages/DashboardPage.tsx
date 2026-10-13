import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import RecentTransactions from "../components/organisms/RecentTransactions";
import useDashboard from "../hooks/useDashboard";
import AppLayout from "../layouts/AppLayout";
import DashboardControls from "../components/organisms/DashboardControls";
import FinancialSummary from "../components/organisms/FinancialSummary";
import ExpenseSplit from "../components/organisms/ExpenseSplit";
import { fetchCategories } from "../services/transactionsService";
import {
  createCategoryIconLookup,
  type CategoryIconData,
} from "../utils/categoryIcons";

function DashboardPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryIconData[]>([]);

  useEffect(() => {
    let active = true;

    fetchCategories()
      .then((response) => {
        if (active) {
          setCategories(response.categories);
        }
      })
      .catch(() => {
        // Recent transactions will use the fallback icon if this fails.
      });

    return () => {
      active = false;
    };
  }, []);

  const categoryIcons = useMemo(
    () => createCategoryIconLookup(categories),
    [categories],
  );
  const now = new Date();

  const [period, setPeriod] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const {
    summary,
    expenseSplit,
    transactions,
    profile,
    isLoading,
    error,
    loadDashboard,
  } = useDashboard(period);

  const changeMonth = (offset: number) => {
    setPeriod((current) => {
      const date = new Date(current.year, current.month - 1 + offset, 1);

      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      };
    });
  };
  const goToAddTransaction = () => navigate("/transactions/new");

  return (
    <AppLayout wide username={profile?.username} email={profile?.email}>
      <div className="py-2 lg:py-1">
        <DashboardControls
          year={period.year}
          month={period.month}
          onChangeMonth={changeMonth}
          onSelectPeriod={(year, month) => setPeriod({ year, month })}
          onAddTransaction={goToAddTransaction}
        />
        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && !summary ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl bg-white text-sm text-text-secondary shadow-sm">
            Loading your dashboard...
          </div>
        ) : (
          <>
            {/* Summary and expense split */}
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.45fr_1fr]">
              {/* Financial Summary */}
              <FinancialSummary summary={summary} />
              {/* Expense split */}
              <ExpenseSplit expenseSplit={expenseSplit} />
            </div>
            {/* Recent transactions */}
            <RecentTransactions
              transactions={transactions}
              categoryIcons={categoryIcons}
              onSelectTransaction={(id) => navigate(`/transactions/${id}`)}
              onAddTransaction={goToAddTransaction}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default DashboardPage;
