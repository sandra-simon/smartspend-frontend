
import { useCallback, useEffect, useState } from 'react'
import {
    ArrowDownLeft,
    ArrowRight,
    ArrowUpRight,
    CalendarDays,
    ChevronDown,
    CircleUserRound,
    Clapperboard,
    CreditCard,
    DollarSign,
    LogOut,
    Menu,
    Plus,
    ShoppingCart,
    TrendingUp,
    Utensils,
    Wallet,
    X,
} from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

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
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
]

const chartColors = ['#11104f', '#62608f', '#ff5555', '#c5c5d0', '#77bba0', '#e5b567']

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

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
    })

function categoryIcon(category: string) {
    const value = category.toLowerCase()

    if (value.includes('food') || value.includes('dining')) return Utensils
    if (value.includes('grocery') || value.includes('shopping')) return ShoppingCart
    if (value.includes('entertainment')) return Clapperboard
    if (value.includes('rent') || value.includes('housing')) return CreditCard
    if (value.includes('salary') || value.includes('income')) return Wallet

    return DollarSign
}

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
    const [profileOpen, setProfileOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const logout = useCallback(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        navigate('/login', { replace: true })
    }, [navigate])

    const loadDashboard = useCallback(async () => {
        setIsLoading(true)
        setError('')

        try {
            const [summaryResponse, splitResponse, transactionResponse, profileResponse] =
                await Promise.all([
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
                return
            }

            setError('Unable to load your dashboard. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }, [period, logout])

    useEffect(() => {
        void loadDashboard()
    }, [loadDashboard])

    const changeMonth = (offset: number) => {
        setPeriod((current) => {
            const date = new Date(current.year, current.month - 1 + offset, 1)

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
        <main className="min-h-screen bg-[#f7f8ff] text-[#11104f]">
            {/* Navigation */}
            <header className="sticky top-0 z-30 border-b border-[#e7e9f4] bg-white">
                <div className="mx-auto flex min-h-[72px] max-w-[1400px] items-center justify-between gap-4 px-5 py-3 lg:px-8">
                    <div className="flex min-w-0 items-center gap-6">
                        <Link to="/" className="flex shrink-0 items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#181653] text-white">
                                <span className="text-lg">◆</span>
                            </div>
                            <span className="text-lg font-bold tracking-tight sm:text-xl">
                                SmartSpend
                            </span>
                        </Link>
                        <nav className="hidden items-center gap-1 lg:flex">
                            <Link
                                to="/dashboard"
                                className="rounded-xl bg-[#211e61] px-5 py-3 text-sm font-bold text-white"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/transactions"
                                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#56566a] transition hover:bg-[#f1f2fb]"
                            >
                                Transactions
                            </Link>
                            <Link
                                to="/analytics"
                                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#56566a] transition hover:bg-[#f1f2fb]"
                            >
                                Analytics
                            </Link>
                            <Link
                                to="/settings"
                                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#56566a] transition hover:bg-[#f1f2fb]"
                            >
                                Settings
                            </Link>
                        </nav>
                    </div>

                    <div className="relative flex shrink-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 rounded-xl p-1.5 text-left hover:bg-[#f7f8ff]"
                            aria-expanded={profileOpen}
                            aria-label="Open profile menu"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d0b50] text-white">
                                <CircleUserRound className="h-5 w-5" />
                            </span>
                            <span className="hidden max-w-[170px] sm:block">
                                <span className="block truncate text-sm font-bold">
                                    {profile?.username ?? 'My Profile'}
                                </span>
                                <span className="block truncate text-xs text-[#777786]">
                                    {profile?.email ?? ''}
                                </span>
                            </span>
                            <ChevronDown className="hidden h-4 w-4 sm:block" />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 top-full z-40 mt-2 w-48 rounded-xl border border-[#e7e9f4] bg-white p-2 shadow-lg">
                                <Link
                                    to="/profile"
                                    onClick={() => setProfileOpen(false)}
                                    className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[#f1f2fb]"
                                >
                                    Profile
                                </Link>
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-lg p-2 hover:bg-[#f1f2fb] lg:hidden"
                            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <nav className="grid gap-1 border-t border-[#e7e9f4] bg-white p-3 lg:hidden">
                        {[
                            ['/dashboard', 'Dashboard'],
                            ['/transactions', 'Transactions'],
                            ['/analytics', 'Analytics'],
                            ['/settings', 'Settings'],
                        ].map(([path, label]) => (
                            <Link
                                key={path}
                                to={path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`rounded-lg px-4 py-3 text-sm font-semibold ${path === '/dashboard'
                                    ? 'bg-[#211e61] text-white'
                                    : 'hover:bg-[#f1f2fb]'
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                )}
            </header>

            {/* Dashboard content */}
            <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-9">
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="mt-1 text-sm text-[#626274]">
                            Financial overview and real-time ledger status
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex h-11 items-center gap-1 rounded-xl border border-[#ececf5] bg-white px-2 shadow-sm">
                            <button
                                type="button"
                                onClick={() => changeMonth(-1)}
                                className="rounded-lg px-2 py-1 text-[#626274] hover:bg-[#f1f2fb]"
                                aria-label="Previous month"
                            >
                                ‹
                            </button>

                            <CalendarDays className="h-4 w-4 shrink-0" />
                            <select
                                value={`${period.year}-${period.month}`}
                                onChange={(event) => {
                                    const [year, month] = event.target.value.split('-').map(Number)
                                    setPeriod({ year, month })
                                }}
                                className="max-w-[145px] cursor-pointer appearance-none bg-transparent px-1 text-sm font-semibold outline-none"
                                aria-label="Dashboard month"
                            >
                                {Array.from({ length: 36 }, (_, index) => {
                                    const date = new Date(now.getFullYear(), now.getMonth() - index, 1)
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
                                className="rounded-lg px-2 py-1 text-[#626274] hover:bg-[#f1f2fb] disabled:opacity-30"
                                aria-label="Next month"
                            >
                                ›
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={goToAddTransaction}
                            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#211e61] px-4 text-sm font-bold text-white shadow-md shadow-[#211e61]/15 transition hover:bg-[#17164f]"
                        >
                            <Plus className="h-4 w-4" />
                            Add New Transaction
                        </button>
                    </div>
                </div>

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

                {isLoading && !summary ? (
                    <div className="flex min-h-64 items-center justify-center rounded-2xl bg-white text-sm text-[#777786] shadow-sm">
                        Loading your dashboard...
                    </div>
                ) : (
                    <>
                        {/* Summary and expense split */}
                        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.45fr_1fr]">
                            <section className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(35,34,85,0.03)] sm:p-7">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-[#56566a]">
                                            Net Available Capital
                                        </p>
                                        <div className="mt-2 flex flex-wrap items-baseline gap-2">
                                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                                {summary ? money(summary.net_available_capital) : '—'}
                                            </h2>
                                            <span className="text-xs text-[#626274]">INR</span>
                                        </div>
                                    </div>

                                    {summary?.comparison.net_available_capital_change_percentage != null && (
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold ${summary.comparison.net_available_capital_change_percentage >= 0
                                                ? 'bg-[#d9fbe5] text-[#087b3d]'
                                                : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            <TrendingUp className="mr-1 inline h-3.5 w-3.5" />
                                            {summary.comparison.net_available_capital_change_percentage >= 0 ? '+' : ''}
                                            {summary.comparison.net_available_capital_change_percentage.toFixed(1)}%
                                            {' '}vs {summary.comparison.previous_period_label}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-7 grid grid-cols-1 gap-3 rounded-xl bg-[#eef3ff] p-4 sm:grid-cols-2 sm:p-5">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#a9f9c4] text-[#087b3d]">
                                            <ArrowDownLeft className="h-5 w-5" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs text-[#626274]">Total Income</p>
                                            <p className="mt-1 break-words text-lg font-bold text-[#087b3d]">
                                                {summary ? `+${money(summary.total_income)}` : '—'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffe5e4] text-[#c81e1e]">
                                            <ArrowUpRight className="h-5 w-5" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs text-[#626274]">Total Expenses</p>
                                            <p className="mt-1 break-words text-lg font-bold text-[#c81e1e]">
                                                {summary ? `-${money(summary.total_expenses)}` : '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                        <span className="font-bold text-[#56566a]">
                                            Monthly Cashflow Ratio
                                        </span>
                                        <span className="font-bold">
                                            {burned.toFixed(0)}% Burned / {retained.toFixed(0)}% Retained
                                        </span>
                                    </div>

                                    <div
                                        className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-[#e9eaf1]"
                                        aria-label={`${burned.toFixed(1)} percent burned and ${retained.toFixed(1)} percent retained`}
                                    >
                                        <div
                                            className="bg-[#087b3d] transition-all"
                                            style={{ width: `${Math.max(0, Math.min(100, retained))}%` }}
                                        />
                                        <div
                                            className="bg-[#c81e1e] transition-all"
                                            style={{ width: `${Math.max(0, Math.min(100, burned))}%` }}
                                        />
                                    </div>

                                    <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-[#626274]">
                                        <span>
                                            <span className="mr-1 text-[#087b3d]">●</span>
                                            Net Reserve: {summary ? money(summary.net_available_capital) : '—'}
                                        </span>
                                        <span>
                                            <span className="mr-1 text-[#c81e1e]">●</span>
                                            Operating Outflow: {summary ? money(summary.total_expenses) : '—'}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Expense split */}
                            <section className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(35,34,85,0.03)] sm:p-7">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-xl font-bold">Expense Split</h2>
                                        <p className="mt-1 text-sm text-[#626274]">
                                            By categories this month
                                        </p>
                                    </div>
                                    <p className="pt-1 text-right text-sm font-bold">
                                        {expenseSplit ? `${money(expenseSplit.total_expenses)} Total` : '—'}
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
                                                <span className="max-w-[105px] text-xs text-[#626274]">
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

                                                    <span className="w-10 shrink-0 text-right text-[#626274]">
                                                        ({category.percentage.toFixed(0)}%)
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                ) : (
                                    <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                                        <Wallet className="h-9 w-9 text-[#b6b7ca]" />
                                        <p className="mt-3 text-sm font-semibold">No expenses this month</p>
                                        <p className="mt-1 text-xs text-[#777786]">
                                            Add an expense to see your category breakdown.
                                        </p>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Recent transactions */}
                        <section className="mt-6 rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(35,34,85,0.03)] sm:p-6">
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-xl font-bold">Recent Transactions</h2>
                                    <span className="rounded-full bg-[#e5edff] px-3 py-1 text-xs font-semibold text-[#56566a]">
                                        {transactions.length} recent
                                    </span>
                                </div>

                                <Link
                                    to="/transactions"
                                    className="inline-flex items-center gap-1 text-sm font-bold hover:text-[#087b3d]"
                                >
                                    View All <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {transactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[650px] border-separate border-spacing-0 text-left">
                                        <thead>
                                            <tr className="bg-[#eef3ff] text-xs uppercase tracking-wide text-[#56566a]">
                                                <th className="rounded-l-lg px-4 py-3 font-bold">Transaction & Merchant/Source</th>
                                                <th className="px-4 py-3 font-bold">Category</th>
                                                <th className="px-4 py-3 font-bold">Date</th>
                                                <th className="rounded-r-lg px-4 py-3 text-right font-bold">Amount</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {transactions.map((transaction) => {
                                                const isIncome = transaction.type === 'income'
                                                const Icon = categoryIcon(transaction.category.name)

                                                return (
                                                    <tr
                                                        key={transaction.transaction_id}
                                                        onClick={() => navigate(`/transactions/${transaction.transaction_id}`)}
                                                        className="cursor-pointer transition hover:bg-[#fafbff]"
                                                    >
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <span
                                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isIncome
                                                                        ? 'bg-[#d9fbe5] text-[#087b3d]'
                                                                        : 'bg-[#ffe8e6] text-[#c81e1e]'
                                                                        }`}
                                                                >
                                                                    <Icon className="h-5 w-5" />
                                                                </span>
                                                                <div className="min-w-0">
                                                                    <p className="max-w-[240px] truncate text-sm font-bold">
                                                                        {transaction.title}
                                                                    </p>
                                                                    <p className="mt-1 max-w-[240px] truncate text-xs text-[#626274]">
                                                                        {transaction.merchant || '—'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="px-4 py-4">
                                                            <span
                                                                className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${isIncome
                                                                    ? 'bg-[#e4f4e9] text-[#087b3d]'
                                                                    : 'bg-[#dce8ff] text-[#4f5670]'
                                                                    }`}
                                                            >
                                                                {transaction.category.name}
                                                            </span>
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-4 text-sm">
                                                            {formatDate(transaction.transaction_at)}
                                                        </td>

                                                        <td
                                                            className={`whitespace-nowrap px-4 py-4 text-right text-sm font-bold ${isIncome ? 'text-[#087b3d]' : 'text-[#c81e1e]'
                                                                }`}
                                                        >
                                                            {isIncome ? '+' : '-'}
                                                            {money(transaction.amount, transaction.currency)}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
                                    <Wallet className="h-9 w-9 text-[#b6b7ca]" />
                                    <p className="mt-3 text-sm font-semibold">No transactions yet</p>
                                    <p className="mt-1 text-xs text-[#777786]">
                                        Your recent income and expenses will appear here.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={goToAddTransaction}
                                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#211e61] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17164f]"
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
        </main>
    )
}

export default DashboardPage
