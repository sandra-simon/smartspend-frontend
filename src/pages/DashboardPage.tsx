import { useCallback, useEffect, useState } from 'react'
import {
    ArrowDownLeft,
    ArrowRight,
    ArrowUpRight,
    CalendarDays,
    Plus,
    TrendingDown,
    TrendingUp,
    Wallet,
} from 'lucide-react'
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import AppLayout from '../layouts/AppLayout'
import { logout } from '../utils/logout'
import TransactionRow from "../components/molecules/TransactionRow";
interface DashboardPeriod {
    year: number
    month: number
}
interface DashboardSummary {
    period: DashboardPeriod
    net_available_capital: number
    total_income: number
    total_expenses: number
    comparison: {
        previous_period_label: string
        net_available_capital_change_percentage: number | null
    }
    cashflow: {
        burned_percentage: number
        retained_percentage: number
    }
}
interface ExpenseCategory {
    category_id: number
    category_name: string
    amount: number
    percentage: number
}
interface ExpenseSplit {
    period: DashboardPeriod
    total_expenses: number
    top_category: ExpenseCategory | null
    categories: ExpenseCategory[]
}
interface Transaction {
    transaction_id: number
    type: 'income' | 'expense'
    amount: number
    currency: string
    category: {
        category_id: number
        name: string
        type: string
    }
    title: string
    merchant: string | null
    transaction_at: string
}
interface TransactionList {
    items: Transaction[]
    pagination: {
        page: number
        page_size: number
        total: number
        total_pages: number
    }
}
interface UserProfile {
    username: string
    email: string
}
const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]
const chartColors = [
    'var(--color-brand)',
    'var(--color-brand-muted)',
    'var(--color-expense)',
    'var(--color-border)',
    'var(--color-income)',
    'var(--color-brand-soft)',
]
const money = (amount: number, currency = 'INR') =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)
const compactMoney = (amount: number, currency = 'INR') =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(amount)
function DashboardPage() {
    const navigate = useNavigate()
    const now = new Date()
    const [period, setPeriod] = useState({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
    })
    const [summary, setSummary] = useState<DashboardSummary | null>(null)
    const [expenseSplit, setExpenseSplit] = useState<ExpenseSplit | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const loadDashboard = useCallback(async () => {
        setIsLoading(true)
        setError('')
        try {
            const [
                summaryResponse,
                splitResponse,
                transactionResponse,
                profileResponse,
            ] = await Promise.all([
                api.get<DashboardSummary>('/dashboard/summary', {
                    params: period,
                }),
                api.get<ExpenseSplit>('/dashboard/expense-split', {
                    params: period,
                }),
                api.get<TransactionList>('/transactions', {
                    params: {
                        page: 1,
                        page_size: 6,
                        sort_by: 'transaction_at',
                        sort_order: 'desc',
                    },
                }),
                api.get<UserProfile>('/users/me'),
            ])
            setSummary(summaryResponse.data)
            setExpenseSplit(splitResponse.data)
            setTransactions(transactionResponse.data.items)
            setProfile(profileResponse.data)
        } catch (err: unknown) {
            if (
                typeof err === 'object' &&
                err !== null &&
                'response' in err &&
                typeof err.response === 'object' &&
                err.response !== null &&
                'status' in err.response &&
                err.response.status === 401
            ) {
                logout()
                navigate('/login', { replace: true })
                return
            }
            setError('Unable to load your dashboard. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }, [period, navigate])
    useEffect(() => {
        void loadDashboard()
    }, [loadDashboard])
    const changeMonth = (offset: number) => {
        setPeriod((current) => {
            const date = new Date(
                current.year,
                current.month - 1 + offset,
                1,
            )
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
            }
        })
    }
    const goToAddTransaction = () => navigate('/transactions/new')
    const retained = summary?.cashflow.retained_percentage ?? 0
    const burned = summary?.cashflow.burned_percentage ?? 0
    const donutData = (expenseSplit?.categories ?? []).filter(
        (category) => category.amount > 0,
    )
    return (
        <AppLayout
            wide
            username={profile?.username}
            email={profile?.email}
        >
            <div className="py-2 lg:py-1">
                {/* Dashboard heading and controls */}
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-text-secondary">
                            Financial overview and real-time ledger status
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex h-11 items-center gap-1 rounded-xl border border-border bg-white px-2 shadow-sm">
                            <button
                                type="button"
                                onClick={() => changeMonth(-1)}
                                className="rounded-lg px-2 py-1 text-text-secondary hover:bg-brand-soft"
                                aria-label="Previous month"
                            >
                                ‹
                            </button>
                            <CalendarDays className="h-4 w-4 shrink-0" />
                            <select
                                value={`${period.year}-${period.month}`}
                                onChange={(event) => {
                                    const [year, month] = event.target.value
                                        .split('-')
                                        .map(Number)
                                    setPeriod({ year, month })
                                }}
                                className="max-w-[145px] cursor-pointer appearance-none bg-transparent px-1 text-sm font-semibold outline-none"
                                aria-label="Dashboard month"
                            >
                                {Array.from({ length: 36 }, (_, index) => {
                                    const date = new Date(
                                        now.getFullYear(),
                                        now.getMonth() - index,
                                        1,
                                    )
                                    const value = `${date.getFullYear()}-${date.getMonth() + 1}`
                                    return (
                                        <option key={value} value={value}>
                                            {monthNames[date.getMonth()]} {date.getFullYear()}
                                        </option>
                                    )
                                })}
                            </select>
                            <button
                                type="button"
                                onClick={() => changeMonth(1)}
                                disabled={
                                    period.year === now.getFullYear() &&
                                    period.month === now.getMonth() + 1
                                }
                                className="rounded-lg px-2 py-1 text-text-secondary hover:bg-brand-soft disabled:opacity-30"
                                aria-label="Next month"
                            >
                                ›
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={goToAddTransaction}
                            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold !text-white shadow-card transition hover:bg-brand-hover"
                        >
                            <Plus className="h-4 w-4" />
                            Add New Transaction
                        </button>
                    </div>
                </div>
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
                            {/* Financial summary */}
                            <section className="rounded-2xl bg-white p-6 shadow-card sm:p-7">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                                            Net Available Capital
                                        </p>
                                        <div className="mt-2 flex flex-wrap items-baseline gap-2">
                                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                                {summary
                                                    ? money(summary.net_available_capital)
                                                    : '—'}
                                            </h2>
                                            <span className="text-xs text-text-secondary">
                                                INR
                                            </span>
                                        </div>
                                    </div>
                                    {summary?.comparison.net_available_capital_change_percentage != null && (
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold ${summary.comparison.net_available_capital_change_percentage >= 0
                                                ? 'bg-success-soft text-income-dark'
                                                : 'bg-expense/10 text-expense-dark'
                                                }`}
                                        >
                                            {summary.comparison.net_available_capital_change_percentage >= 0 ? (
                                                <TrendingUp className="mr-1 inline h-3.5 w-3.5" />
                                            ) : (
                                                <TrendingDown className="mr-1 inline h-3.5 w-3.5" />
                                            )}
                                            {summary.comparison.net_available_capital_change_percentage >= 0
                                                ? '+'
                                                : ''}
                                            {summary.comparison.net_available_capital_change_percentage.toFixed(1)}%
                                            {' '}vs {summary.comparison.previous_period_label.replace(/^([A-Za-z]+)\s+(\d{4})$/, (_, month, year) => `${month.slice(0, 3)} ${year}`)}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-7 grid grid-cols-1 gap-3 rounded-xl bg-input p-4 sm:grid-cols-2 sm:p-5">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-soft text-income-dark">
                                            <ArrowDownLeft className="h-5 w-5" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs text-text-secondary">
                                                Total Income
                                            </p>
                                            <p className="mt-1 break-words text-lg font-bold text-income-dark">
                                                {summary ? `+${money(summary.total_income)}` : '—'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-expense/10 text-expense-dark">
                                            <ArrowUpRight className="h-5 w-5" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs text-text-secondary">
                                                Total Expenses
                                            </p>
                                            <p className="mt-1 break-words text-lg font-bold text-expense-dark">
                                                {summary ? `-${money(summary.total_expenses)}` : '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                        <span className="font-bold text-text-secondary">
                                            Monthly Cashflow Ratio
                                        </span>
                                        <span className="font-bold">
                                            {burned.toFixed(0)}% Burned / {retained.toFixed(0)}% Retained
                                        </span>
                                    </div>
                                    <div
                                        className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-border"
                                        aria-label={`${burned.toFixed(1)} percent burned and ${retained.toFixed(1)} percent retained`}
                                    >
                                        <div
                                            className="bg-income-dark transition-all"
                                            style={{
                                                width: `${Math.max(0, Math.min(100, retained))}%`,
                                            }}
                                        />
                                        <div
                                            className="bg-expense-dark transition-all"
                                            style={{
                                                width: `${Math.max(0, Math.min(100, burned))}%`,
                                            }}
                                        />
                                    </div>
                                    <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-text-secondary">
                                        <span>
                                            <span className="mr-1 text-income-dark">●</span>
                                            Net Reserve:{' '}
                                            {summary
                                                ? money(summary.net_available_capital)
                                                : '—'}
                                        </span>
                                        <span>
                                            <span className="mr-1 text-expense-dark">●</span>
                                            Operating Outflow:{' '}
                                            {summary ? money(summary.total_expenses) : '—'}
                                        </span>
                                    </div>
                                </div>
                            </section>
                            {/* Expense split */}
                            <section className="rounded-2xl bg-white p-6 shadow-card sm:p-7">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            Expense Split
                                        </h2>
                                        <p className="mt-1 text-sm text-text-secondary">
                                            By categories this month
                                        </p>
                                    </div>
                                    <p className="pt-1 text-right text-sm font-bold">
                                        {expenseSplit
                                            ? `${money(expenseSplit.total_expenses)} Total`
                                            : '—'}
                                    </p>
                                </div>
                                {donutData.length > 0 ? (
                                    <div className="mt-4 grid grid-cols-1 items-center gap-4 sm:grid-cols-[minmax(145px,0.85fr)_minmax(0,1.15fr)]">
                                        <div className="relative mx-auto h-[210px] w-full max-w-[230px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={donutData}
                                                        dataKey="amount"
                                                        nameKey="category_name"
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius="60%"
                                                        outerRadius="85%"
                                                        paddingAngle={3}
                                                        stroke="none"
                                                    >
                                                        {donutData.map((item, index) => (
                                                            <Cell
                                                                key={item.category_id}
                                                                fill={chartColors[index % chartColors.length]}
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        formatter={(value) => money(Number(value))}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                                                <span className="text-xl font-bold">
                                                    {expenseSplit?.top_category?.percentage.toFixed(0) ?? 0}%
                                                </span>
                                                <span className="max-w-[105px] text-xs text-text-secondary">
                                                    {expenseSplit?.top_category?.category_name ?? 'No expenses'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="min-w-0 space-y-4">
                                            {donutData.map((category, index) => (
                                                <div
                                                    key={category.category_id}
                                                    className="flex min-w-0 items-center gap-2 text-xs"
                                                >
                                                    <span
                                                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                chartColors[index % chartColors.length],
                                                        }}
                                                    />
                                                    <span className="min-w-0 flex-1 truncate font-semibold">
                                                        {category.category_name}
                                                    </span>
                                                    <span className="shrink-0 text-right font-bold">
                                                        {compactMoney(category.amount)}
                                                    </span>
                                                    <span className="w-10 shrink-0 text-right text-text-secondary">
                                                        ({category.percentage.toFixed(0)}%)
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                                        <Wallet className="h-9 w-9 text-brand-muted" />
                                        <p className="mt-3 text-sm font-semibold">
                                            No expenses this month
                                        </p>
                                        <p className="mt-1 text-xs text-text-secondary">
                                            Add an expense to see your category breakdown.
                                        </p>
                                    </div>
                                )}
                            </section>
                        </div>
                        {/* Recent transactions */}
                        <section className="mt-6 rounded-2xl bg-white p-5 shadow-card sm:p-6">
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-xl font-bold">
                                        Recent Transactions
                                    </h2>
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
                                                    Transaction & Merchant/Source
                                                </th>
                                                <th className="px-4 py-3 font-bold">
                                                    Category
                                                </th>
                                                <th className="px-4 py-3 font-bold">
                                                    Date
                                                </th>
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
                                                    onSelect={(id) => navigate(`/transactions/${id}`)}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
                                    <Wallet className="h-9 w-9 text-brand-muted" />
                                    <p className="mt-3 text-sm font-semibold">
                                        No transactions yet
                                    </p>
                                    <p className="mt-1 text-xs text-text-secondary">
                                        Your recent income and expenses will appear here.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={goToAddTransaction}
                                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Transaction
                                    </button>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </AppLayout>
    )
}
export default DashboardPage
