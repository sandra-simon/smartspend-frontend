
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  fetchAnalyticsSummary,
  fetchCashflowTrend,
  fetchSpendingBreakdown,
  fetchTopCategories,
  type AnalyticsCashflowTrend,
  type AnalyticsPeriodType,
  type AnalyticsSpendingBreakdown,
  type AnalyticsSummary,
  type AnalyticsTopCategories,
} from "../services/analyticsService";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (typeof detail?.error?.message === "string") {
      return detail.error.message;
    }

    if (!error.response) {
      return "Unable to connect to the server. Please try again.";
    }
  }

  return "Unable to load analytics. Please try again.";
}

function useAnalytics() {
  const navigate = useNavigate();

  const [period, setPeriod] = useState<AnalyticsPeriodType>("monthly");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [spendingBreakdown, setSpendingBreakdown] =
    useState<AnalyticsSpendingBreakdown | null>(null);
  const [cashflowTrend, setCashflowTrend] =
    useState<AnalyticsCashflowTrend | null>(null);
  const [topCategories, setTopCategories] =
    useState<AnalyticsTopCategories | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [
        summaryResult,
        breakdownResult,
        cashflowResult,
        categoriesResult,
      ] = await Promise.all([
        fetchAnalyticsSummary(period),
        fetchSpendingBreakdown(period),
        fetchCashflowTrend(period),
        fetchTopCategories(period),
      ]);

      setSummary(summaryResult);
      setSpendingBreakdown(breakdownResult);
      setCashflowTrend(cashflowResult);
      setTopCategories(categoriesResult);
    } catch (caughtError: unknown) {
      if (
        axios.isAxiosError(caughtError) &&
        caughtError.response?.status === 401
      ) {
        navigate("/login", { replace: true });
        return;
      }

      setError(getErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }, [period, navigate]);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  return {
    period,
    setPeriod,
    summary,
    spendingBreakdown,
    cashflowTrend,
    topCategories,
    isLoading,
    error,
    reload: loadAnalytics,
  };
}

export default useAnalytics;
