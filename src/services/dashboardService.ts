import api from './api'

export interface DashboardPeriod {
    year: number
    month: number
}

export interface DashboardSummary {
    period: DashboardPeriod
    net_available_capital: number
    total_income: number
    total_expenses: number
    comparison: {
        previous_period_label: string
        net_available_capital_change_percentage: number | null
        net_available_capital_change: number | null
    }
    cashflow: {
        burned_percentage: number
        retained_percentage: number
    }
}

export interface ExpenseCategory {
    category_id: number
    category_name: string
    amount: number
    percentage: number
}

export interface ExpenseSplit {
    period: DashboardPeriod
    total_expenses: number
    top_category: ExpenseCategory | null
    categories: ExpenseCategory[]
}

export interface DashboardTransaction {
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

export interface DashboardTransactionList {
    items: DashboardTransaction[]
    pagination: {
        page: number
        page_size: number
        total: number
        total_pages: number
    }
}

export interface DashboardUserProfile {
    username: string
    email: string
}

export async function fetchDashboardSummary(period: DashboardPeriod) {
    const response = await api.get<DashboardSummary>('/dashboard/summary', {
        params: period,
    })

    return response.data
}

export async function fetchExpenseSplit(period: DashboardPeriod) {
    const response = await api.get<ExpenseSplit>('/dashboard/expense-split', {
        params: period,
    })

    return response.data
}

export async function fetchRecentTransactions() {
    const response = await api.get<DashboardTransactionList>('/transactions', {
        params: {
            page: 1,
            page_size: 6,
            sort_by: 'transaction_at',
            sort_order: 'desc',
        },
    })

    return response.data
}

export async function fetchDashboardProfile() {
    const response = await api.get<DashboardUserProfile>('/users/me')

    return response.data
}