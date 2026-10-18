import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  fetchDashboardProfile,
  fetchDashboardSummary,
  fetchExpenseSplit,
  fetchRecentTransactions,
  type DashboardPeriod,
  type DashboardSummary,
  type DashboardTransaction,
  type DashboardUserProfile,
  type ExpenseSplit,
} from '../services/dashboardService'
import { logout } from '../utils/logout'

interface UseDashboardResult {
  summary: DashboardSummary | null
  expenseSplit: ExpenseSplit | null
  transactions: DashboardTransaction[]
  profile: DashboardUserProfile | null
  isLoading: boolean
  error: string
  loadDashboard: () => Promise<void>
}

function isUnauthorizedError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return false
  }

  const response = error.response

  return (
    typeof response === 'object' &&
    response !== null &&
    'status' in response &&
    response.status === 401
  )
}

export default function useDashboard(period: DashboardPeriod): UseDashboardResult {
  const navigate = useNavigate()

  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [expenseSplit, setExpenseSplit] = useState<ExpenseSplit | null>(null)
  const [transactions, setTransactions] = useState<DashboardTransaction[]>([])
  const [profile, setProfile] = useState<DashboardUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const [
        summaryData,
        expenseSplitData,
        transactionData,
        profileData,
      ] = await Promise.all([
        fetchDashboardSummary(period),
        fetchExpenseSplit(period),
        fetchRecentTransactions(),
        fetchDashboardProfile(),
      ])

      setSummary(summaryData)
      setExpenseSplit(expenseSplitData)
      setTransactions(transactionData.items)
      setProfile(profileData)
    } catch (err: unknown) {
      if (isUnauthorizedError(err)) {
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
    const timeoutId = setTimeout(() => {
      void loadDashboard()
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [loadDashboard])

  return {
    summary,
    expenseSplit,
    transactions,
    profile,
    isLoading,
    error,
    loadDashboard,
  }
}