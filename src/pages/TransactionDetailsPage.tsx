import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Store,
  FileText,
  Pencil,
  Trash2,
  Wallet,
  CircleAlert,
  ReceiptText,
} from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import Button from "../components/atoms/Button";
import Card from "../components/atoms/Card";
import LoadingState from "../components/molecules/LoadingState";
import EmptyState from "../components/molecules/EmptyState";
import {
  createCategoryIconLookup,
  getCategoryIconById,
} from "../utils/categoryIcons";
import { fetchCategories } from "../services/transactionsService";
import { formatCurrency } from "../utils/currency";
import useTransactionDetail from "../hooks/useTransactionDetail";

function TransactionDetailsPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<
    { category_id: number; icon: string }[]
  >([]);

  useEffect(() => {
    let active = true;

    fetchCategories()
      .then((response) => {
        if (active) setCategories(response.categories);
      })
      .catch(() => {
        // Keep the fallback icon if category loading fails.
      });

    return () => {
      active = false;
    };
  }, []);

  const categoryIcons = useMemo(
    () => createCategoryIconLookup(categories),
    [categories],
  );

  const {
    transaction,
    isLoading,
    isDeleting,
    error,
    deleteError,
    loadTransaction,
    removeTransaction,
  } = useTransactionDetail();

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });

  const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingState
          message="Loading transaction details..."
          minHeight="320px"
        />
      </AppLayout>
    );
  }

  if (error || !transaction) {
    return (
      <AppLayout>
        <div className="py-4">
          <Button variant="ghost" onClick={() => navigate("/transactions")}>
            <ArrowLeft size={17} className="mr-2" />
            Back to transactions
          </Button>

          <div className="mt-6">
            <EmptyState
              icon={<CircleAlert size={24} />}
              title="Unable to show transaction"
              description={error || "Transaction details are unavailable."}
              action={
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => void loadTransaction()}
                  >
                    Try again
                  </Button>
                  <Button onClick={() => navigate("/transactions")}>
                    Transaction History
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </AppLayout>
    );
  }

  const isIncome = transaction.type === "income";
  const CategoryIcon = getCategoryIconById(
    transaction.category.category_id,
    categoryIcons,
  );
  const budget = transaction.monthly_budget;
  const budgetPercentage = Math.max(
    0,
    Math.min(100, Number(budget?.percentage_used ?? 0)),
  );

  return (
    <AppLayout>
      <div className="mx-auto max-w-[640px] space-y-5 py-2">
        <button
          type="button"
          onClick={() => navigate("/transactions")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-brand"
        >
          <ArrowLeft size={17} />
          Back to Transactions
        </button>

        {/* Main transaction card */}
        <Card padding="lg" className="overflow-hidden">
          <div className="relative">
            {/* Compact action icons */}
            <div className="absolute right-0 top-0 flex items-center gap-2">
              <button
                type="button"
                aria-label="Edit transaction"
                title="Edit transaction"
                onClick={() =>
                  navigate(`/transactions/${transaction.transaction_id}/edit`)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-hover"
              >
                <Pencil size={17} />
              </button>

              <button
                type="button"
                aria-label="Delete transaction"
                title="Delete transaction"
                onClick={() => setShowDeleteConfirmation(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 transition hover:bg-red-200"
              >
                <Trash2 size={17} />
              </button>
            </div>

            {/* Centered transaction summary */}
            <div className="flex flex-col items-center px-2 pb-1 pt-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-brand">
                <CategoryIcon size={29} />
              </div>

              <span
                className={`mt-4 inline-flex max-w-full items-center gap-1.5 rounded-full px-4 py-1 text-xs font-semibold ${
                  isIncome
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                {isIncome ? "Income" : "Expense"} · {transaction.category.name}
              </span>

              <h1 className="mt-3 max-w-full break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {transaction.title}
              </h1>

              <p
                className={`mt-2 break-words text-3xl font-bold sm:text-4xl ${
                  isIncome ? "text-green-600" : "text-red-500"
                }`}
              >
                {isIncome ? "+" : "−"}
                {formatCurrency(
                  Number(transaction.amount),
                  transaction.currency,
                )}
              </p>
            </div>

            {/* Lavender information rows */}
            <div className="mt-8 space-y-2">
              <div className="flex min-h-16 items-center justify-between gap-4 rounded-lg bg-[#edf2ff] px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e0eaff] text-slate-600">
                    <ReceiptText size={18} />
                  </span>
                  <span className="text-sm text-slate-600">Category</span>
                </div>
                <span className="break-words text-right text-sm font-semibold text-slate-900">
                  {transaction.category.name}
                </span>
              </div>

              <div className="flex min-h-16 items-center justify-between gap-4 rounded-lg bg-[#edf2ff] px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e0eaff] text-slate-600">
                    <CalendarDays size={18} />
                  </span>
                  <span className="text-sm text-slate-600">
                    Date &amp; Time
                  </span>
                </div>
                <span className="text-right text-sm font-semibold text-slate-900">
                  {formatDate(transaction.transaction_at)} ·{" "}
                  {formatTime(transaction.transaction_at)}
                </span>
              </div>

              <div className="flex min-h-16 items-center justify-between gap-4 rounded-lg bg-[#edf2ff] px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e0eaff] text-slate-600">
                    <Store size={18} />
                  </span>
                  <span className="text-sm text-slate-600">Merchant</span>
                </div>
                <span className="break-words text-right text-sm font-semibold text-slate-900">
                  {transaction.merchant || "—"}
                </span>
              </div>

              <div className="rounded-lg bg-[#edf2ff] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e0eaff] text-slate-600">
                    <FileText size={18} />
                  </span>
                  <span className="text-sm text-slate-600">Notes</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap break-words pl-12 text-sm leading-6 text-slate-900">
                  {transaction.notes?.trim() || "—"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Monthly category impact */}
        <Card padding="lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-soft text-brand">
                <Wallet size={19} />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Monthly Category Impact
              </h2>
            </div>

            <span className="text-sm font-semibold text-text-secondary">
              {budget
                ? `${new Date(budget.year, budget.month - 1).toLocaleDateString(
                    "en-IN",
                    {
                      month: "long",
                      year: "numeric",
                    },
                  )} Budget`
                : "Budget overview"}
            </span>
          </div>

          {budget ? (
            <div className="mt-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <p className="text-text-secondary">
                  Spent:{" "}
                  <span className="font-semibold text-text-primary">
                    {formatCurrency(Number(budget.spent), transaction.currency)}
                  </span>{" "}
                  of{" "}
                  {formatCurrency(Number(budget.limit), transaction.currency)}
                </p>

                <span
                  className={`font-semibold ${
                    Number(budget.percentage_used) >= 100
                      ? "text-expense-dark"
                      : "text-income-dark"
                  }`}
                >
                  {Number(budget.percentage_used).toFixed(1)}% used
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#dbe7ff]">
                <div
                  className={`h-full rounded-full transition-all ${
                    budgetPercentage >= 100 ? "bg-expense" : "bg-brand"
                  }`}
                  style={{ width: `${budgetPercentage}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-text-secondary">
                  {Number(budget.remaining) < 0 ? "Over budget" : "Remaining"}
                </span>
                <span
                  className={`font-semibold ${
                    Number(budget.remaining) < 0
                      ? "text-expense-dark"
                      : "text-income-dark"
                  }`}
                >
                  {formatCurrency(
                    Math.abs(Number(budget.remaining)),
                    transaction.currency,
                  )}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              No applicable monthly budget exists for this category and
              transaction month.
            </p>
          )}
        </Card>

        {/* Delete confirmation */}
        {showDeleteConfirmation && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
            onClick={() => !isDeleting && setShowDeleteConfirmation(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-transaction-title"
              className="w-full max-w-md rounded-panel bg-surface p-6 shadow-elevated"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <Trash2 size={23} />
              </div>

              <h2
                id="delete-transaction-title"
                className="mt-4 text-xl font-bold text-text-primary"
              >
                Delete transaction?
              </h2>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                This will permanently delete “{transaction.title}”. This action
                cannot be undone.
              </p>

              {deleteError && (
                <p role="alert" className="mt-3 text-sm text-danger">
                  {deleteError}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="secondary"
                  disabled={isDeleting}
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  disabled={isDeleting}
                  onClick={() => void removeTransaction()}
                >
                  {isDeleting ? "Deleting..." : "Delete Transaction"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default TransactionDetailsPage;
