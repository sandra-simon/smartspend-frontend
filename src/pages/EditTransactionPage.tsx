
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Store,
} from "lucide-react";

import AppLayout from "../layouts/AppLayout";
import Button from "../components/atoms/Button";
import AlertMessage from "../components/molecules/AlertMessage";
import LoadingState from "../components/molecules/LoadingState";
import EmptyState from "../components/molecules/EmptyState";
import {
  createCategoryIconLookup,
  getCategoryIconById,
} from "../utils/categoryIcons";
import {
  fetchCategories,
  fetchTransactionDetail,
  updateTransaction,
  type TransactionDetail,
} from "../services/transactionsService";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

function toISTDateTimeValue(value: string) {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return ''
    }

    return new Date(date.getTime() + IST_OFFSET_MS)
        .toISOString()
        .slice(0, 16)
}

function istDateTimeToISOString(value: string) {
    return new Date(`${value}:00+05:30`).toISOString()
}

function EditTransactionPage() {
  const navigate = useNavigate();
  const { transactionId } = useParams<{ transactionId: string }>();

  const [transaction, setTransaction] =
    useState<TransactionDetail | null>(null);

  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [transactionAt, setTransactionAt] = useState("");
  const [merchant, setMerchant] = useState("");
  const [notes, setNotes] = useState("");

  const [categories, setCategories] = useState<
    { category_id: number; name: string; type: string; icon: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const categoryIcons = useMemo(
    () => createCategoryIconLookup(categories),
    [categories],
  );

  useEffect(() => {
    let active = true;

    async function loadTransaction() {
      if (!transactionId || !/^\d+$/.test(transactionId)) {
        setError("Invalid transaction ID.");
        setIsLoading(false);
        return;
      }

      try {
        const result = await fetchTransactionDetail(Number(transactionId));

        if (!active) return;

        setTransaction(result);
        setType(result.type as "expense" | "income");
        setAmount(String(result.amount));
        setCategoryId(result.category.category_id);
        setTitle(result.title);
        setTransactionAt(toISTDateTimeValue(result.transaction_at));
        setMerchant(result.merchant ?? "");
        setNotes(result.notes ?? "");
      } catch (caughtError: unknown) {
        if (!active) return;

        if (
          axios.isAxiosError(caughtError) &&
          caughtError.response?.status === 401
        ) {
          navigate("/login", { replace: true });
          return;
        }

        setError(
          axios.isAxiosError(caughtError) &&
            caughtError.response?.status === 404
            ? "This transaction could not be found."
            : "Unable to load transaction details. Please try again.",
        );
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadTransaction();

    return () => {
      active = false;
    };
  }, [transactionId, navigate]);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      setIsLoadingCategories(true);
      setCategoryError("");

      try {
        const response = await fetchCategories(type);

        if (active) {
          setCategories(response.categories);
        }
      } catch {
        if (active) {
          setCategories([]);
          setCategoryError("Unable to load categories. Please try again.");
        }
      } finally {
        if (active) setIsLoadingCategories(false);
      }
    }

    void loadCategories();

    return () => {
      active = false;
    };
  }, [type]);

  const handleTypeChange = (nextType: "expense" | "income") => {
    if (nextType === type) return;

    setType(nextType);
    setCategoryId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!transactionId || !transaction) return;

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a transaction title.");
      return;
    }

    if (!transactionAt || Number.isNaN(new Date(transactionAt).getTime())) {
      setError("Please enter a valid transaction date and time.");
      return;
    }

    if (new Date(transactionAt).getTime() > Date.now()) {
      setError("Transaction date and time cannot be in the future.");
      return;
    }

    if (
      !categories.some(
        (category) =>
          category.category_id === categoryId && category.type === type,
      )
    ) {
      setError("Please select a valid category for this transaction type.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateTransaction(Number(transactionId), {
        category_id: categoryId,
        amount: numericAmount,
        currency: transaction.currency,
        title: title.trim(),
        transaction_at: istDateTimeToISOString(transactionAt),
        merchant: merchant.trim() || null,
        notes: notes.trim() || null,
      });

      navigate(`/transactions/${transactionId}`, { replace: true });
    } catch (caughtError: unknown) {
      if (
        axios.isAxiosError(caughtError) &&
        caughtError.response?.status === 401
      ) {
        navigate("/login", { replace: true });
        return;
      }

      const detail = axios.isAxiosError(caughtError)
        ? caughtError.response?.data?.detail
        : null;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to update this transaction. Please check your details and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingState
          message="Loading transaction for editing..."
          minHeight="320px"
        />
      </AppLayout>
    );
  }

  if (error && !transaction) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-[640px] py-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/transactions")}
          >
            <ArrowLeft size={17} className="mr-2" />
            Back to transactions
          </Button>

          <div className="mt-6">
            <EmptyState
              icon={<CircleAlert size={24} />}
              title="Unable to edit transaction"
              description={error}
              action={
                <Button onClick={() => navigate("/transactions")}>
                  Transaction History
                </Button>
              }
            />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="min-h-screen bg-canvas px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[640px]">
          <div className="mb-6">
            <button
              type="button"
              onClick={() => navigate(`/transactions/${transactionId}`)}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-brand"
            >
              <ArrowLeft size={16} />
              Transaction Details
            </button>

            <h1 className="text-3xl font-bold tracking-tight text-brand">
              Edit Transaction
            </h1>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Update your transaction details. Your monthly budget information
              will be refreshed after you save.
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
                onClick={() => handleTypeChange("expense")}
                aria-pressed={type === "expense"}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  type === "expense"
                    ? "bg-white !text-expense shadow-sm"
                    : "!text-expense-dark hover:bg-white/60"
                }`}
              >
                <ArrowUp size={18} />
                Expense
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange("income")}
                aria-pressed={type === "income"}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  type === "income"
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
                htmlFor="edit-transaction-amount"
                className="text-xs font-bold uppercase tracking-wide text-text-secondary"
              >
                Transaction Amount (INR)
              </label>

              <div className="mt-1 flex items-center gap-1">
                <span className="text-3xl font-bold leading-none text-text-secondary">
                  ₹
                </span>
                <input
                  id="edit-transaction-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  required
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  className="min-w-0 flex-1 bg-transparent !text-3xl !font-bold leading-none text-brand outline-none placeholder:!text-3xl placeholder:!font-bold placeholder:text-brand-muted/60"
                />
              </div>
            </div>

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-brand">Category</h2>
                <span className="text-xs text-text-secondary">
                  Select one
                </span>
              </div>

              {isLoadingCategories ? (
                <p className="text-sm text-text-secondary">
                  Loading categories...
                </p>
              ) : categoryError ? (
                <p role="alert" className="text-sm text-danger">
                  {categoryError}
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
                    const selected = categoryId === category.category_id;

                    return (
                      <button
                        key={category.category_id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setCategoryId(category.category_id)}
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
                  htmlFor="edit-transaction-title"
                  className="mb-2 block text-sm font-medium text-brand"
                >
                  Title
                </label>
                <input
                  id="edit-transaction-title"
                  type="text"
                  maxLength={150}
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Monthly Rent Payment"
                  className="min-h-11 w-full rounded-control border border-transparent bg-input px-4 py-3 text-sm text-brand outline-none transition focus:border-brand"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-transaction-date"
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
                    id="edit-transaction-date"
                    type="datetime-local"
                    required
                    max={new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60_000,
                    )
                      .toISOString()
                      .slice(0, 16)}
                    value={transactionAt}
                    onChange={(event) => setTransactionAt(event.target.value)}
                    className="min-h-11 min-w-0 flex-1 bg-transparent py-2 text-sm text-brand outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-transaction-merchant"
                  className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-brand"
                >
                  Merchant / Payee
                  <span className="text-xs font-normal text-text-secondary">
                    Optional
                  </span>
                </label>
                <div className="flex items-center gap-3 rounded-control border border-transparent bg-input px-4 focus-within:border-brand">
                  <Store
                    size={18}
                    className="shrink-0 text-text-secondary"
                  />
                  <input
                    id="edit-transaction-merchant"
                    type="text"
                    maxLength={150}
                    value={merchant}
                    onChange={(event) => setMerchant(event.target.value)}
                    placeholder="Enter merchant or payee"
                    className="min-h-11 min-w-0 flex-1 bg-transparent py-2 text-sm text-brand outline-none placeholder:text-text-secondary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-transaction-notes"
                  className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-brand"
                >
                  Notes
                  <span className="text-xs font-normal text-text-secondary">
                    Optional
                  </span>
                </label>
                <textarea
                  id="edit-transaction-notes"
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
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
                disabled={isSubmitting}
                onClick={() =>
                  navigate(`/transactions/${transactionId}`)
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="lg"
                disabled={
                  isSubmitting ||
                  isLoadingCategories ||
                  categories.length === 0 ||
                  !categoryId
                }
              >
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
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

export default EditTransactionPage;
