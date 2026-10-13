import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  Store,
  CheckCircle2,
} from "lucide-react";
import {
  createCategoryIconLookup,
  getCategoryIconById,
} from "../utils/categoryIcons";
import AppLayout from "../layouts/AppLayout";
import Button from "../components/atoms/Button";
import AlertMessage from "../components/molecules/AlertMessage";
import useAddTransaction from "../hooks/useAddTransaction";

function AddTransactionPage() {
  const navigate = useNavigate();
  const {
    form,
    categories,
    isLoadingCategories,
    isSubmitting,
    error,
    updateField,
    submit,
  } = useAddTransaction();

  const categoryIcons = useMemo(
    () => createCategoryIconLookup(categories),
    [categories],
  );

  useEffect(() => {
    if (
      form.categoryId !== null &&
      !categories.some((category) => category.category_id === form.categoryId)
    ) {
      updateField("categoryId", null);
    }
  }, [categories, form.categoryId, updateField]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const success = await submit();

    if (success) {
      navigate("/transactions");
    }
  };
  return (
    <AppLayout>
      <main className="min-h-screen bg-canvas px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[640px]">
          <div className="mb-6">
            <button
              type="button"
              onClick={() => navigate("/transactions")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-brand"
            >
              <ArrowLeft size={16} />
              Transactions
            </button>

            <h1 className="text-3xl font-bold tracking-tight text-brand">
              Record Activity
            </h1>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Log an expense or income to keep your monthly budget accurate and
              clean.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-panel bg-surface p-5 shadow-card sm:p-6"
          >
            <div
              className="grid grid-cols-2 gap-1 rounded-control bg-brand-soft p-1"
              aria-label="Transaction type"
            >
              <button
                type="button"
                onClick={() => updateField("type", "expense")}
                aria-pressed={form.type === "expense"}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  form.type === "expense"
                    ? "bg-white !text-expense shadow-sm"
                    : "!text-expense-dark hover:bg-white/60"
                }`}
              >
                <ArrowUp size={18} />
                Expense
              </button>

              <button
                type="button"
                onClick={() => updateField("type", "income")}
                aria-pressed={form.type === "income"}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  form.type === "income"
                    ? "bg-white !text-income-dark shadow-sm"
                    : "!text-income-dark hover:bg-white/60"
                }`}
              >
                <ArrowDown size={18} />
                Income
              </button>
            </div>

            <div className="mt-6 rounded-control bg-input p-4 sm:p-5">
              <label
                htmlFor="transaction-amount"
                className="text-xs font-bold uppercase tracking-wide text-text-secondary"
              >
                Transaction Amount (INR)
              </label>

              <div className="mt-1 flex items-center gap-1">
                <span className="text-3xl font-bold leading-none text-text-secondary">
                  ₹
                </span>
                <input
                  id="transaction-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  required
                  value={form.amount}
                  onChange={(event) =>
                    updateField("amount", event.target.value)
                  }
                  placeholder="0.00"
                  className="min-w-0 flex-1 bg-transparent !text-3xl !font-bold leading-none text-brand outline-none placeholder:!text-3xl placeholder:!font-bold placeholder:text-brand-muted/60"
                />
              </div>
            </div>

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-brand">Category</h2>
                <span className="text-xs text-text-secondary">Select one</span>
              </div>

              {isLoadingCategories ? (
                <p className="text-sm text-text-secondary">
                  Loading categories...
                </p>
              ) : categories.length === 0 ? (
                <p className="rounded-control bg-surface-muted p-4 text-sm text-text-secondary">
                  No categories available for this transaction type.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2 min-[420px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6">
                  {categories.map((category) => {
                    const Icon = getCategoryIconById(
                      category.category_id,
                      categoryIcons,
                    );
                    const selected = form.categoryId === category.category_id;

                    return (
                      <button
                        key={category.category_id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          updateField("categoryId", category.category_id)
                        }
                        className={`flex min-h-[76px] min-w-0 flex-col items-center justify-center gap-2 rounded-control border p-2 text-center transition ${
                          selected
                            ? "border-brand bg-brand text-white shadow-sm"
                            : "border-transparent bg-brand-soft text-brand hover:border-brand/30"
                        }`}
                      >
                        <span
                          className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                            selected ? "bg-white/15" : "bg-white"
                          }`}
                        >
                          <Icon size={18} />
                        </span>
                        <span className="line-clamp-2 text-xs font-medium">
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="transaction-title"
                  className="mb-2 block text-sm font-medium text-brand"
                >
                  Title
                </label>
                <input
                  id="transaction-title"
                  type="text"
                  maxLength={150}
                  required
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="e.g. Monthly Rent Payment"
                  className="min-h-11 w-full rounded-control border border-transparent bg-input px-4 py-3 text-sm text-brand outline-none transition focus:border-brand"
                />
              </div>

              <div>
                <label
                  htmlFor="transaction-date"
                  className="mb-2 block text-sm font-medium text-brand"
                >
                  Date &amp; Time
                </label>
                <div className="flex items-center gap-3 rounded-control border border-transparent bg-input px-4 focus-within:border-brand">
                  <CalendarDays
                    size={18}
                    className="shrink-0 text-text-secondary"
                  />
                  <input
                    id="transaction-date"
                    type="datetime-local"
                    required
                    max={new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60_000,
                    )
                      .toISOString()
                      .slice(0, 16)}
                    value={form.transactionAt}
                    onChange={(event) =>
                      updateField("transactionAt", event.target.value)
                    }
                    className="min-h-11 min-w-0 flex-1 bg-transparent py-2 text-sm text-brand outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="transaction-merchant"
                  className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-brand"
                >
                  Merchant / Payee
                  <span className="text-xs font-normal text-text-secondary">
                    Optional
                  </span>
                </label>
                <div className="flex items-center gap-3 rounded-control border border-transparent bg-input px-4 focus-within:border-brand">
                  <Store size={18} className="shrink-0 text-text-secondary" />
                  <input
                    id="transaction-merchant"
                    type="text"
                    maxLength={150}
                    value={form.merchant}
                    onChange={(event) =>
                      updateField("merchant", event.target.value)
                    }
                    placeholder="Enter merchant or payee"
                    className="min-h-11 min-w-0 flex-1 bg-transparent py-2 text-sm text-brand outline-none placeholder:text-text-secondary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="transaction-notes"
                  className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-brand"
                >
                  Notes
                  <span className="text-xs font-normal text-text-secondary">
                    Optional
                  </span>
                </label>
                <textarea
                  id="transaction-notes"
                  rows={3}
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="Add any additional details..."
                  className="w-full resize-y rounded-control border border-transparent bg-input px-4 py-3 text-sm text-brand outline-none transition focus:border-brand placeholder:text-text-secondary"
                />
              </div>
            </div>

            {error && (
              <div className="mt-5">
                <AlertMessage message={error} variant="error" />
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/transactions")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="lg"
                disabled={
                  isSubmitting || isLoadingCategories || categories.length === 0
                }
              >
                {isSubmitting ? "Saving..." : "Save Transaction"}
                {!isSubmitting && <CheckCircle2 size={18} />}
                {isSubmitting && <ArrowRight size={18} />}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </AppLayout>
  );
}

export default AddTransactionPage;
