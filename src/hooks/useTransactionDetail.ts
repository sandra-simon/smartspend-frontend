
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import {
  deleteTransaction,
  fetchTransactionDetail,
  type TransactionDetail,
} from '../services/transactionsService'

function useTransactionDetail() {
  const { transactionId } = useParams<{ transactionId: string }>()
  const navigate = useNavigate()

  const [transaction, setTransaction] = useState<TransactionDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const loadTransaction = useCallback(async () => {
    if (!transactionId || !/^\d+$/.test(transactionId)) {
      setError('Invalid transaction ID.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await fetchTransactionDetail(Number(transactionId))
      setTransaction(result)
    } catch (caughtError: unknown) {
      if (axios.isAxiosError(caughtError) && caughtError.response?.status === 401) {
        navigate('/login', { replace: true })
        return
      }

      if (axios.isAxiosError(caughtError) && caughtError.response?.status === 404) {
        setError('This transaction could not be found.')
      } else {
        setError('Unable to load transaction details. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [transactionId, navigate])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadTransaction()
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [loadTransaction])

  const removeTransaction = async () => {
    if (!transactionId) return false

    setIsDeleting(true)
    setDeleteError('')

    try {
      await deleteTransaction(Number(transactionId))
      navigate('/transactions', { replace: true })
      return true
    } catch (caughtError: unknown) {
      if (axios.isAxiosError(caughtError) && caughtError.response?.status === 401) {
        navigate('/login', { replace: true })
      } else {
        setDeleteError('Unable to delete this transaction. Please try again.')
      }
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    transaction,
    isLoading,
    isDeleting,
    error,
    deleteError,
    loadTransaction,
    removeTransaction,
  }
}

export default useTransactionDetail
