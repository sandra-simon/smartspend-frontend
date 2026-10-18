import { createElement } from "react";
import { getCategoryIcon } from "../../utils/categoryIcons";

export interface TransactionRowData {
  transaction_id: number;
  type: "income" | "expense";
  amount: number | string;
  currency: string;
  category: {
    category_id: number;
    name: string;
    type: string;
    icon?: string;
  };
  title: string;
  merchant: string | null;
  transaction_at: string;
}

interface TransactionRowProps {
  transaction: TransactionRowData;
  onSelect: (transactionId: number) => void;
  categoryIconName?: string;
}

function formatMoney(amount: number | string, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

function TransactionRow({
  transaction,
  onSelect,
  categoryIconName,
}: TransactionRowProps) {
  const isIncome = transaction.type === "income";
  const categoryIcon = getCategoryIcon(categoryIconName);

  return (
    <tr
      onClick={() => onSelect(transaction.transaction_id)}
      className="cursor-pointer transition hover:bg-canvas"
    >
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isIncome
                ? "bg-success-soft text-income-dark"
                : "bg-expense/10 text-expense-dark"
            }`}
          >
            {createElement(categoryIcon, { className: "h-5 w-5" })}
          </span>

          <div className="min-w-0">
            <p className="max-w-[240px] truncate text-sm font-bold">
              {transaction.title}
            </p>
            <p className="mt-1 max-w-[240px] truncate text-xs text-text-secondary">
              {transaction.merchant || "—"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <span
          className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
            isIncome
              ? "bg-success-soft text-income-dark"
              : "bg-brand-soft text-text-secondary"
          }`}
        >
          {transaction.category.name}
        </span>
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-sm text-text-secondary">
        {new Date(transaction.transaction_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        })}
      </td>

      <td
        className={`whitespace-nowrap px-4 py-4 text-right text-sm font-bold ${
          isIncome ? "text-income-dark" : "text-expense-dark"
        }`}
      >
        {isIncome ? "+" : "−"}
        {formatMoney(transaction.amount, transaction.currency)}
      </td>
    </tr>
  );
}

export default TransactionRow;
