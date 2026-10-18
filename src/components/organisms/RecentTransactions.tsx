import { ArrowRight, Plus, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

import TransactionRow from "../molecules/TransactionRow";
import type { DashboardTransaction } from "../../services/dashboardService";

interface RecentTransactionsProps {
  transactions: DashboardTransaction[];
  categoryIcons: Map<number, string>;
  onSelectTransaction: (id: number) => void;
  onAddTransaction: () => void;
}

function RecentTransactions({
  transactions,
  categoryIcons,
  onSelectTransaction,
  onAddTransaction,
}: RecentTransactionsProps) {
  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-5 text-text-primary shadow-card sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold tracking-tight text-brand">Recent Transactions</h2>

          {transactions.length > 0 && (
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-text-secondary">
              {transactions.length} recent
            </span>
          )}
        </div>

        {transactions.length > 0 && (
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1 text-sm font-bold hover:text-income-dark"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-input text-xs uppercase tracking-wide text-text-secondary">
                <th className="rounded-l-lg px-4 py-3 font-bold">
                  Transaction &amp; Merchant/Source
                </th>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="rounded-r-lg px-4 py-3 text-right font-bold">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.transaction_id}
                  transaction={transaction}
                  categoryIconName={categoryIcons.get(
                    transaction.category.category_id,
                  )}
                  onSelect={onSelectTransaction}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
          <Wallet className="h-9 w-9 text-brand-muted" />
          <p className="mt-3 text-sm font-semibold">No transactions yet</p>
          <p className="mt-1 text-xs text-text-secondary">
            Your recent income and expenses will appear here.
          </p>
          <button
            type="button"
            onClick={onAddTransaction}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        </div>
      )}
    </section>
  );
}

export default RecentTransactions;
