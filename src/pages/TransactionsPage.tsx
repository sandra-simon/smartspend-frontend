import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, CircleAlert, Plus, Shapes, Wallet } from "lucide-react";
import useTransactions from "../hooks/useTransactions";
import AppLayout from "../layouts/AppLayout";
import Button from "../components/atoms/Button";
import Card from "../components/atoms/Card";
import DateInput from "../components/atoms/DateInput";
import EmptyState from "../components/molecules/EmptyState";
import LoadingState from "../components/molecules/LoadingState";
import SearchInput from "../components/molecules/SearchInput";
import Pagination from "../components/molecules/Pagination";
import TransactionDateGroup, {
  type Transaction,
} from "../components/organisms/TransactionDateGroup";
const PAGE_SIZE = 7;
const TIME_ZONE = "Asia/Kolkata";
function getDateParts(value: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
  };
}
function dateKey(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  const { year, month, day } = getDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function dateFromKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
function startOfDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}
function startOfWeek(date: Date) {
  const result = startOfDay(date);
  const weekday = (result.getUTCDay() + 6) % 7;
  result.setUTCDate(result.getUTCDate() - weekday);
  return result;
}
function sameDay(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}
function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function groupLabel(dateKeyValue: string, now = new Date()) {
  const date = dateFromKey(dateKeyValue);
  const today = dateFromKey(dateKey(now));
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const thisWeek = startOfWeek(today);
  const lastWeek = new Date(thisWeek);
  lastWeek.setUTCDate(lastWeek.getUTCDate() - 7);

  if (sameDay(date, today)) {
    return `Today · ${formatShortDate(date)}`;
  }

  if (sameDay(date, yesterday)) {
    return `Yesterday · ${formatShortDate(date)}`;
  }

  // Handle future dates before assigning historical group labels.
  if (date > today) {
    return `Upcoming · ${formatShortDate(date)}`;
  }

  if (date >= thisWeek && date < yesterday) {
    const weekEnd = new Date(yesterday);
    weekEnd.setUTCDate(weekEnd.getUTCDate() - 1);

    const startLabel = formatShortDate(thisWeek);
    const endLabel = formatShortDate(weekEnd);

    return startLabel === endLabel
      ? `Earlier this week · ${startLabel}`
      : `Earlier this week · ${startLabel}–${endLabel}`;
  }

  if (date >= lastWeek && date < thisWeek) {
    const weekEnd = new Date(thisWeek);
    weekEnd.setUTCDate(weekEnd.getUTCDate() - 1);
    return `Last week · ${formatShortDate(lastWeek)}–${formatShortDate(weekEnd)}`;
  }

  if (
    date.getUTCFullYear() === today.getUTCFullYear() &&
    date.getUTCMonth() === today.getUTCMonth()
  ) {
    return `Earlier this month · ${date.toLocaleDateString("en-IN", {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
    })}`;
  }

  return date.toLocaleDateString("en-IN", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  });
}

function TransactionsPage() {
  const navigate = useNavigate();
  const {
    transactions,
    dailyTotals,
    categories,
    categoryIcons,
    profile,
    activity,
    setActivity,
    categoryId,
    setCategoryId,
    search,
    setSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    page,
    setPage,
    total,
    totalPages,
    isLoading,
    error,
    loadTransactions,
    clearFilters,
  } = useTransactions();
  const visibleCategories = useMemo(
    () =>
      categories.filter(
        (category) => activity === "all" || category.type === activity,
      ),
    [activity, categories],
  );
  const groupedTransactions = useMemo(() => {
    const now = new Date();
    // Aggregate the full, filtered daily totals into the same date groups
    // used by the visible transaction rows.
    const totalsByGroup = new Map<string, number>();
    dailyTotals.forEach((dailyTotal) => {
      const label = groupLabel(dailyTotal.date, now);
      totalsByGroup.set(
        label,
        (totalsByGroup.get(label) ?? 0) + Number(dailyTotal.net_total),
      );
    });
    const groups = new Map<
      string,
      {
        key: string;
        label: string;
        items: Transaction[];
        netTotal: number;
        latestDate: number;
      }
    >();
    transactions.forEach((transaction) => {
      const key = dateKey(transaction.transaction_at);
      const label = groupLabel(key, now);
      const groupKey = label;
      const group = groups.get(groupKey) ?? {
        key: groupKey,
        label,
        items: [],
        netTotal: 0,
        latestDate: new Date(transaction.transaction_at).getTime(),
      };
      group.items.push(transaction);
      group.latestDate = Math.max(
        group.latestDate,
        new Date(transaction.transaction_at).getTime(),
      );
      groups.set(groupKey, group);
    });
    groups.forEach((group) => {
      group.netTotal = totalsByGroup.get(group.label) ?? 0;
    });
    return Array.from(groups.values()).sort(
      (a, b) => b.latestDate - a.latestDate,
    );
  }, [transactions, dailyTotals]);
  const hasFilters =
    activity !== "all" ||
    categoryId !== "" ||
    search !== "" ||
    dateFrom !== "" ||
    dateTo !== "";
  return (
    <AppLayout wide username={profile?.username} email={profile?.email}>
      <div className="py-2 lg:py-1">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              Transaction History
            </h1>
          </div>
          <Button
            onClick={() => navigate("/transactions/new")}
            className="shrink-0"
          >
            <Plus size={17} className="mr-2" />
            Add Transaction
          </Button>
        </div>
        <Card padding="md" className="mb-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div
              className="inline-flex flex-wrap items-center gap-1 rounded-control bg-input p-1"
              aria-label="Filter by activity type"
            >
              {(
                [
                  ["all", "All Activity"],
                  ["income", "Income Only"],
                  ["expense", "Expenses Only"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActivity(value)}
                  aria-pressed={activity === value}
                  className={`rounded-control px-3 py-2 text-sm font-semibold transition-colors ${
                    activity === value
                      ? "bg-brand text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">{total}</span>{" "}
              transactions
            </p>
          </div>
          <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-[1.8fr_0.85fr_0.85fr_0.85fr_auto]">
            <div className="min-w-0">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by title, merchant, category, or note..."
                ariaLabel="Search transactions"
              />
            </div>
            <div className="min-w-0">
              <DateInput
                label="From date"
                value={dateFrom}
                max={dateTo || undefined}
                onChange={setDateFrom}
              />
            </div>
            <div className="min-w-0">
              <DateInput
                label="To date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={setDateTo}
              />
            </div>
            <label className="block min-w-0">
              <span className="mb-1 block text-xs font-medium text-text-secondary">
                Category
              </span>
              <span className="relative block">
                <Shapes
                  size={17}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-3 my-auto text-text-secondary"
                />
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className="h-11 w-full appearance-none rounded-control border border-border bg-input pl-10 pr-9 text-sm text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                >
                  <option value="">All Categories</option>
                  {visibleCategories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-3 my-auto text-text-secondary"
                />
              </span>
            </label>
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="h-11 w-fit px-3 lg:justify-self-start"
            >
              Clear
            </Button>
          </div>
        </Card>
        {error && (
          <div
            role="alert"
            className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-card border border-danger/20 bg-expense/5 p-4 text-sm text-danger"
          >
            <span className="flex items-center gap-2">
              <CircleAlert size={17} />
              {error}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void loadTransactions()}
            >
              Try again
            </Button>
          </div>
        )}
        <Card padding="none" className="overflow-hidden">
          {isLoading && transactions.length === 0 ? (
            <LoadingState message="Loading transactions..." minHeight="240px" />
          ) : error && transactions.length === 0 ? (
            <EmptyState
              icon={<CircleAlert size={24} />}
              title="Couldn't load transactions"
              description="Please check your connection and try again."
              action={
                <Button onClick={() => void loadTransactions()}>
                  Try again
                </Button>
              }
            />
          ) : groupedTransactions.length === 0 ? (
            <EmptyState
              icon={<Wallet size={24} />}
              title={
                hasFilters ? "No matching transactions" : "No transactions yet"
              }
              description={
                hasFilters
                  ? "Try changing your search or filters."
                  : "Your income and expenses will appear here once you add a transaction."
              }
              action={
                hasFilters ? (
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/transactions/new")}>
                    <Plus size={16} className="mr-2" />
                    Add Transaction
                  </Button>
                )
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="bg-input text-xs uppercase tracking-wide text-text-secondary">
                    <th className="px-4 py-3 font-bold">
                      Transaction &amp; Merchant/Source
                    </th>
                    <th className="px-4 py-3 font-bold">Category</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 text-right font-bold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {groupedTransactions.map((group) => (
                    <TransactionDateGroup
                      key={group.key}
                      label={group.label}
                      transactions={group.items}
                      netTotal={group.netTotal}
                      categoryIcons={categoryIcons}
                      onSelect={(id) => navigate(`/transactions/${id}`)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {total > 0 && (
            <div className="flex flex-col gap-3 border-t border-border bg-surface-muted px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-text-secondary">
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)}-
                {Math.min(page * PAGE_SIZE, total)} of {total} transactions
              </p>
              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  disabled={isLoading}
                />
              )}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
export default TransactionsPage;
