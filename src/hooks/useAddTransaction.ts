
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
    createTransaction,
    fetchCategories,
} from '../services/transactionsService'

interface Category {
    category_id: number
    name: string
    type: string
    icon: string
}

export interface AddTransactionForm {
    type: 'expense' | 'income'
    amount: string
    categoryId: number | null
    title: string
    transactionAt: string
    merchant: string
    notes: string
}


const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

function toISTDateTimeValue(date: Date) {
    return new Date(date.getTime() + IST_OFFSET_MS)
        .toISOString()
        .slice(0, 16)
}

function istDateTimeToISOString(value: string) {
    // datetime-local has no timezone, so explicitly interpret it as IST.
    return new Date(`${value}:00+05:30`).toISOString()
}

function useAddTransaction() {
    const [form, setForm] = useState<AddTransactionForm>({
        type: 'expense',
        amount: '',
        categoryId: null,
        title: '',
        transactionAt: toISTDateTimeValue(new Date()),
        merchant: '',
        notes: '',
    })

    const [categories, setCategories] = useState<Category[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let isActive = true

        async function loadCategories() {
            setIsLoadingCategories(true)
            setError('')

            try {
                const response = await fetchCategories(form.type)

                if (isActive) {
                    setCategories(response.categories)
                }
            } catch {
                if (isActive) {
                    setError('Unable to load categories. Please try again.')
                }
            } finally {
                if (isActive) {
                    setIsLoadingCategories(false)
                }
            }
        }

        void loadCategories()

        return () => {
            isActive = false
        }
    }, [form.type])

    const updateField = <K extends keyof AddTransactionForm>(
        field: K,
        value: AddTransactionForm[K],
    ) => {
        setForm((current) => ({ ...current, [field]: value }))
        setError('')
    }

    const submit = async () => {
        setError('')

        const amount = Number(form.amount)

        if (!Number.isFinite(amount) || amount <= 0) {
            setError('Enter an amount greater than zero.')
            return false
        }

        if (!form.categoryId) {
            setError('Please select a category.')
            return false
        }

        if (!form.title.trim()) {
            setError('Please enter a transaction title.')
            return false
        }

        if (form.title.trim().length > 150) {
            setError('The title must be 150 characters or fewer.')
            return false
        }

        if (form.merchant.trim().length > 150) {
            setError('The merchant name must be 150 characters or fewer.')
            return false
        }

        const transactionTimestamp = Date.parse(
            `${form.transactionAt}:00+05:30`,
        )

        if (Number.isNaN(transactionTimestamp)) {
            setError('Please enter a valid transaction date and time.')
            return false
        }

        if (transactionTimestamp > Date.now()) {
            setError('Transaction date and time cannot be in the future.')
            return false
        }

        setIsSubmitting(true)

        try {
            await createTransaction({
                category_id: form.categoryId,
                amount,
                currency: 'INR',
                title: form.title.trim(),
                transaction_at: istDateTimeToISOString(form.transactionAt),
                merchant: form.merchant.trim() || null,
                notes: form.notes.trim() || null,
            })

            return true
        } catch (caughtError: unknown) {
            if (axios.isAxiosError(caughtError) && !caughtError.response) {
                setError('Unable to connect to the server. Please try again.')
            } else {
                const detail = axios.isAxiosError(caughtError)
                    ? caughtError.response?.data?.detail
                    : undefined

                setError(
                    typeof detail === 'string'
                        ? detail
                        : 'Unable to save the transaction. Please check your details and try again.',
                )
            }

            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        form,
        categories,
        isLoadingCategories,
        isSubmitting,
        error,
        updateField,
        submit,
    }
}

export default useAddTransaction
