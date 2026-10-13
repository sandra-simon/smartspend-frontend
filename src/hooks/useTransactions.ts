
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import useDebounce from "./useDebounce";
import {
  fetchTransactions,
  fetchDailyNetTotals,
  fetchCategories,
  fetchCurrentUser,
  type ActivityFilter,
  type DailyNetTotal,
  type UserProfile,
  type TransactionFilters,
} from "../services/transactionsService";
import type { Transaction } from "../components/organisms/TransactionDateGroup";
import { createCategoryIconLookup } from "../utils/categoryIcons";

const PAGE_SIZE = 7;

interface Category {
  category_id: number;
  name: string;
  type: string;
  icon: string;
}

function useTransactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dailyTotals, setDailyTotals] = useState<DailyNetTotal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [activity, setActivity] = useState<ActivityFilter>("all");
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(search.trim(), 300);

  const filters: TransactionFilters = {
    activity,
    categoryId,
    search: debouncedSearch,
    dateFrom,
    dateTo,
  };

  const categoryIcons = useMemo(
    () => createCategoryIconLookup(categories),
    [categories],
  );

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [transactionResponse, totalsResponse] = await Promise.all([
        fetchTransactions(filters, page, PAGE_SIZE),
        fetchDailyNetTotals(filters),
      ]);

      setTransactions(transactionResponse.items);
      setTotal(transactionResponse.pagination.total);
      setTotalPages(transactionResponse.pagination.total_pages);
      setDailyTotals(totalsResponse);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "status" in err.response &&
        err.response.status === 401
      ) {
        navigate("/login", { replace: true });
        return;
      }

      setError("Unable to load transactions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [
    activity,
    categoryId,
    dateFrom,
    dateTo,
    debouncedSearch,
    navigate,
    page,
  ]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    setPage(1);
  }, [activity, categoryId, debouncedSearch, dateFrom, dateTo]);

  useEffect(() => {
    let cancelled = false;

    async function loadSupportingData() {
      try {
        const [categoryResponse, profileResponse] = await Promise.all([
          fetchCategories(),
          fetchCurrentUser(),
        ]);

        if (!cancelled) {
          setCategories(categoryResponse.categories);
          setProfile(profileResponse);
        }
      } catch {
        // Transaction loading has its own error state.
      }
    }

    void loadSupportingData();

    return () => {
      cancelled = true;
    };
  }, []);

  const clearFilters = useCallback(() => {
    setActivity("all");
    setCategoryId("");
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }, []);

  return {
    transactions,
    dailyTotals,
    categories,
    categoryIcons,
    profile,
    activity,
    setActivity,
    categoryId,
    setCategoryId,
    search,
    setSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    page,
    setPage,
    total,
    totalPages,
    isLoading,
    error,
    loadTransactions,
    clearFilters,
    debouncedSearch,
  };
}

export default useTransactions;
