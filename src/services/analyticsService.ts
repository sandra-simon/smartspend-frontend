
import api from "./api";

export type AnalyticsPeriodType = "weekly" | "monthly" | "yearly";

export interface AnalyticsPeriod {
  period: AnalyticsPeriodType;
  label: string;
}

export interface AnalyticsComparison {
  previous_period_label: string;
  income_change_percentage: number | null;
  expense_change_percentage: number | null;
  net_savings_change_percentage: number | null;
}

export interface AnalyticsSummary {
  period: AnalyticsPeriod;
  total_income: number;
  total_expenses: number;
  net_savings: number;
  comparison: AnalyticsComparison;
}

export interface AnalyticsSpendingCategory {
  category_id: number;
  category_name: string;
  amount: number;
  percentage: number;
}

export interface AnalyticsSpendingBreakdown {
  period: AnalyticsPeriod;
  total_expenses: number;
  top_category: AnalyticsSpendingCategory | null;
  categories: AnalyticsSpendingCategory[];
}

export interface AnalyticsCashflowPoint {
  label: string;
  income: number;
  expenses: number;
}

export interface AnalyticsCashflowTrend {
  period: AnalyticsPeriod;
  granularity: string;
  data: AnalyticsCashflowPoint[];
}

export interface AnalyticsTopCategory {
  category_id: number;
  category_name: string;
  icon: string;
  transaction_count: number;
  spent: number;
  budget: number | null;
  remaining: number | null;
  percentage_used: number | null;
}

export interface AnalyticsTopCategories {
  period: AnalyticsPeriod;
  categories: AnalyticsTopCategory[];
}

export async function fetchAnalyticsSummary(
  period: AnalyticsPeriodType,
): Promise<AnalyticsSummary> {
  const response = await api.get<AnalyticsSummary>("/analytics/summary", {
    params: { period },
  });

  return response.data;
}

export async function fetchSpendingBreakdown(
  period: AnalyticsPeriodType,
): Promise<AnalyticsSpendingBreakdown> {
  const response = await api.get<AnalyticsSpendingBreakdown>(
    "/analytics/spending-breakdown",
    { params: { period } },
  );

  return response.data;
}

export async function fetchCashflowTrend(
  period: AnalyticsPeriodType,
): Promise<AnalyticsCashflowTrend> {
  const response = await api.get<AnalyticsCashflowTrend>(
    "/analytics/cashflow-trend",
    { params: { period } },
  );

  return response.data;
}

export async function fetchTopCategories(
  period: AnalyticsPeriodType,
): Promise<AnalyticsTopCategories> {
  const response = await api.get<AnalyticsTopCategories>(
    "/analytics/top-categories",
    { params: { period } },
  );

  return response.data;
}
