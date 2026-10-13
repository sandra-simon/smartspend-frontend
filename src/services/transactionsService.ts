
import api from "./api";
import type { Transaction } from "../components/organisms/TransactionDateGroup";

export type ActivityFilter = "all" | "income" | "expense";

export interface TransactionListResponse {
  items: Transaction[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface DailyNetTotal {
  date: string;
  income_total: number | string;
  expense_total: number | string;
  net_total: number | string;
}

export interface CategoryListResponse {
  categories: {
    category_id: number
    name: string
    type: string
    icon: string
  }[]
}

export interface UserProfile {
  username?: string;
  email?: string;
}

export interface TransactionFilters {
  activity: ActivityFilter;
  categoryId: string;
  search: string;
  dateFrom: string;
  dateTo: string;
}

function buildFilterParams(filters: TransactionFilters) {
  const params: Record<string, string | number> = {};

  if (filters.activity !== "all") {
    params.type = filters.activity;
  }

  if (filters.categoryId) {
    params.category_id = Number(filters.categoryId);
  }

  if (filters.search) {
    params.search = filters.search;
  }

  if (filters.dateFrom) {
    params.date_from = `${filters.dateFrom}T00:00:00+05:30`;
  }

  if (filters.dateTo) {
    params.date_to = `${filters.dateTo}T23:59:59.999+05:30`;
  }

  return params;
}

export async function fetchTransactions(
  filters: TransactionFilters,
  page: number,
  pageSize: number,
) {
  const response = await api.get<TransactionListResponse>("/transactions", {
    params: {
      ...buildFilterParams(filters),
      page,
      page_size: pageSize,
      sort_by: "transaction_at",
      sort_order: "desc",
    },
  });

  return response.data;
}

export async function fetchDailyNetTotals(filters: TransactionFilters) {
  const response = await api.get<DailyNetTotal[]>(
    "/transactions/daily-net-totals",
    { params: buildFilterParams(filters) },
  );

  return response.data;
}

export async function fetchCategories(type?: ActivityFilter) {
  const response = await api.get<CategoryListResponse>('/categories', {
    params: type && type !== 'all' ? { type } : {},
  })

  return response.data
}

export async function fetchCurrentUser() {
  const response = await api.get<UserProfile>("/users/me");
  return response.data;
}

export interface TransactionCreateRequest {
  category_id: number
  amount: number
  currency: string
  title: string
  transaction_at: string
  merchant: string | null
  notes: string | null
}

export async function createTransaction(
  data: TransactionCreateRequest,
): Promise<Transaction> {
  const response = await api.post<Transaction>('/transactions', data)
  return response.data
}


export interface MonthlyBudget {
  year: number
  month: number
  limit: number | string
  spent: number | string
  remaining: number | string
  percentage_used: number | string
}

export interface TransactionDetail extends Transaction {
  notes: string | null
  created_at: string
  updated_at: string
  monthly_budget: MonthlyBudget | null
}

export interface TransactionUpdateRequest {
  category_id?: number
  amount?: number
  currency?: string
  title?: string
  transaction_at?: string
  merchant?: string | null
  notes?: string | null
}

export async function fetchTransactionDetail(
  transactionId: number,
): Promise<TransactionDetail> {
  const response = await api.get<TransactionDetail>(
    `/transactions/${transactionId}`,
  )
  return response.data
}

export async function updateTransaction(
  transactionId: number,
  data: TransactionUpdateRequest,
): Promise<Transaction> {
  const response = await api.patch<Transaction>(
    `/transactions/${transactionId}`,
    data,
  )
  return response.data
}

export async function deleteTransaction(
  transactionId: number,
): Promise<void> {
  await api.delete(`/transactions/${transactionId}`)
}
