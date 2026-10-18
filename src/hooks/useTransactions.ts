import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

async function requestTransactions(
  filters: TransactionFilters,
  page: number,
) {
  const [transactionResponse, totalsResponse] = await Promise.all([
    fetchTransactions(filters, page, PAGE_SIZE),
    fetchDailyNetTotals(filters),
  ]);

  return { transactionResponse, totalsResponse };
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
  const requestIdRef = useRef(0);

  const updateActivity = useCallback((value: ActivityFilter) => {
    setActivity(value);
    setPage(1);
    setIsLoading(true);
    setError("");
  }, []);

  const updateCategoryId = useCallback((value: string) => {
    setCategoryId(value);
    setPage(1);
    setIsLoading(true);
    setError("");
  }, []);

  const updateSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
    setIsLoading(true);
    setError("");
  }, []);

  const updateDateFrom = useCallback((value: string) => {
    setDateFrom(value);
    setPage(1);
    setIsLoading(true);
    setError("");
  }, []);

  const updateDateTo = useCallback((value: string) => {
    setDateTo(value);
    setPage(1);
    setIsLoading(true);
    setError("");
  }, []);

  const updatePage = useCallback((value: number) => {
    setPage(value);
    setIsLoading(true);
    setError("");
  }, []);

  const filters = useMemo<TransactionFilters>(
    () => ({
      activity,
      categoryId,
      search: debouncedSearch,
      dateFrom,
      dateTo,
    }),
    [activity, categoryId, debouncedSearch, dateFrom, dateTo],
  );

  const categoryIcons = useMemo(
    () => createCategoryIconLookup(categories),
    [categories],
  );

  const runTransactionRequest = useCallback(
    async (requestId: number, isCancelled: () => boolean = () => false) => {
      try {
        const { transactionResponse, totalsResponse } =
          await requestTransactions(filters, page);

        if (isCancelled() || requestId !== requestIdRef.current) return;

        setTransactions(transactionResponse.items);
        setTotal(transactionResponse.pagination.total);
        setTotalPages(transactionResponse.pagination.total_pages);
        setDailyTotals(totalsResponse);
        setError("");
      } catch (err: unknown) {
        if (isCancelled() || requestId !== requestIdRef.current) return;

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
        if (!isCancelled() && requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [filters, navigate, page],
  );

  const loadTransactions = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    setError("");

    await runTransactionRequest(requestId);
  }, [runTransactionRequest]);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;

    void runTransactionRequest(requestId, () => cancelled);

    return () => {
      cancelled = true;
    };
  }, [runTransactionRequest]);

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
    setIsLoading(true);
    setError("");
  }, []);

  return {
    transactions,
    dailyTotals,
    categories,
    categoryIcons,
    profile,
    activity,
    categoryId,
    search,
    dateFrom,
    dateTo,
    page,
    total,
    totalPages,
    isLoading,
    error,
    loadTransactions,
    clearFilters,
    debouncedSearch,
    setActivity: updateActivity,
    setCategoryId: updateCategoryId,
    setSearch: updateSearch,
    setDateFrom: updateDateFrom,
    setDateTo: updateDateTo,
    setPage: updatePage,
  };
}

export default useTransactions;
