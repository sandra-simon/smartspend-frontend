import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../atoms/Button'

interface PaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
    disabled?: boolean
    className?: string
}

function Pagination({
    page,
    totalPages,
    onPageChange,
    disabled = false,
    className = '',
}: PaginationProps) {
    const canGoPrevious = page > 1
    const canGoNext = page < totalPages

    if (totalPages <= 1) {
        return null
    }

    return (
        <nav
            aria-label="Pagination"
            className={`flex flex-wrap items-center justify-between gap-3 ${className}`}
        >
            <p className="text-sm text-text-secondary" aria-live="polite">
                Page <span className="font-semibold text-text-primary">{page}</span>
                {' '}of{' '}
                <span className="font-semibold text-text-primary">
                    {totalPages}
                </span>
            </p>

            <div className="flex items-center gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={disabled || !canGoPrevious}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeft size={16} />
                    Previous
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    disabled={disabled || !canGoNext}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                    <ChevronRight size={16} />
                </Button>
            </div>
        </nav>
    )
}

export default Pagination