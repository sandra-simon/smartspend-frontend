import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

interface MonthSelectorProps {
    year: number
    month: number
    onChange: (year: number, month: number) => void
    monthsBack?: number
    className?: string
}

function MonthSelector({
    year,
    month,
    onChange,
    monthsBack = 35,
    className = '',
}: MonthSelectorProps) {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    const isCurrentMonth =
        year === currentYear && month === currentMonth

    const changeMonth = (offset: number) => {
        const nextDate = new Date(year, month - 1 + offset, 1)

        onChange(nextDate.getFullYear(), nextDate.getMonth() + 1)
    }

    const availableMonths = Array.from(
        { length: monthsBack + 1 },
        (_, index) => {
            const date = new Date(
                currentYear,
                currentDate.getMonth() - index,
                1,
            )

            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                value: `${date.getFullYear()}-${date.getMonth() + 1}`,
                label: date.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                }),
            }
        },
    )

    return (
        <div
            className={`flex h-11 items-center gap-1 rounded-control border border-border bg-surface px-2 shadow-sm ${className}`}
        >
            <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="rounded-lg p-2 text-text-secondary transition hover:bg-surface-muted"
                aria-label="Previous month"
            >
                <ChevronLeft size={17} />
            </button>

            <CalendarDays
                size={16}
                className="shrink-0 text-text-secondary"
                aria-hidden="true"
            />

            <select
                value={`${year}-${month}`}
                onChange={(event) => {
                    const [nextYear, nextMonth] = event.target.value
                        .split('-')
                        .map(Number)

                    onChange(nextYear, nextMonth)
                }}
                className="max-w-[155px] cursor-pointer appearance-none bg-transparent px-1 text-sm font-semibold text-text-primary outline-none"
                aria-label="Select month"
            >
                {availableMonths.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <button
                type="button"
                onClick={() => changeMonth(1)}
                disabled={isCurrentMonth}
                className="rounded-lg p-2 text-text-secondary transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next month"
            >
                <ChevronRight size={17} />
            </button>
        </div>
    )
}

export default MonthSelector