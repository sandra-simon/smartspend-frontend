
import TransactionRow, {
  type TransactionRowData,
} from "../molecules/TransactionRow";

export type Transaction = TransactionRowData;

interface TransactionDateGroupProps {
  label: string;
  transactions: Transaction[];
  netTotal: number;
  onSelect: (transactionId: number) => void;
}

function formatMoney(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function TransactionDateGroup({
  label,
  transactions,
  netTotal,
  onSelect,
}: TransactionDateGroupProps) {
  return (
    <>
      <tr>
        <td
          colSpan={4}
          className="border-b border-border bg-surface-muted px-5 py-3 sm:px-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-text-primary">{label}</h3>

            <p
              className={`text-xs font-bold ${
                netTotal >= 0 ? "text-income-dark" : "text-expense-dark"
              }`}
            >
              {netTotal > 0 ? "+" : netTotal < 0 ? "−" : ""}
              {formatMoney(Math.abs(netTotal))} Net
            </p>
          </div>
        </td>
      </tr>

      {transactions.map((transaction) => (
        <TransactionRow
          key={transaction.transaction_id}
          transaction={transaction}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

export default TransactionDateGroup;
