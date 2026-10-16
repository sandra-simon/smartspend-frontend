import { CalendarDays, Plus } from "lucide-react";

interface DashboardControlsProps {
  year: number;
  month: number;
  onChangeMonth: (offset: number) => void;
  onSelectPeriod: (year: number, month: number) => void;
  onAddTransaction: () => void;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function DashboardControls({
  year,
  month,
  onChangeMonth,
  onSelectPeriod,
  onAddTransaction,
}: DashboardControlsProps) {
  const now = new Date();

  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Financial overview and real-time ledger status
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex h-11 items-center gap-1 rounded-xl border border-border bg-surface px-2 text-text-primary shadow-sm">
          <button
            type="button"
            onClick={() => onChangeMonth(-1)}
            className="rounded-lg px-2 py-1 text-text-secondary hover:bg-brand-soft"
            aria-label="Previous month"
          >
            ‹
          </button>

          <CalendarDays className="h-4 w-4 shrink-0" />

          <select
            value={`${year}-${month}`}
            onChange={(event) => {
              const [selectedYear, selectedMonth] = event.target.value
                .split("-")
                .map(Number);

              onSelectPeriod(selectedYear, selectedMonth);
            }}
            className="max-w-[145px] cursor-pointer appearance-none bg-transparent px-1 text-sm font-semibold text-text-primary outline-none [color-scheme:light] dark:[color-scheme:dark]"
            aria-label="Dashboard month"
          >
            {Array.from({ length: 36 }, (_, index) => {
              const date = new Date(
                now.getFullYear(),
                now.getMonth() - index,
                1,
              );

              const value = `${date.getFullYear()}-${date.getMonth() + 1}`;

              return (
                <option
                  key={value}
                  value={value}
                  className="bg-surface text-text-primary"
                >
                  {monthNames[date.getMonth()]} {date.getFullYear()}
                </option>
              );
            })}
          </select>

          <button
            type="button"
            onClick={() => onChangeMonth(1)}
            disabled={
              year === now.getFullYear() && month === now.getMonth() + 1
            }
            className="rounded-lg px-2 py-1 text-text-secondary hover:bg-brand-soft disabled:opacity-30"
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        <button
          type="button"
          onClick={onAddTransaction}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold !text-white shadow-card transition hover:bg-brand-hover"
        >
          <Plus className="h-4 w-4" />
          Add New Transaction
        </button>
      </div>
    </div>
  );
}

export default DashboardControls;
