import { Search, X } from 'lucide-react'
import type { ChangeEvent } from 'react'
import IconButton from '../atoms/IconButton'

interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    ariaLabel?: string
    className?: string
    disabled?: boolean
}

function SearchInput({
    value,
    onChange,
    placeholder = 'Search...',
    ariaLabel = 'Search',
    className = '',
    disabled = false,
}: SearchInputProps) {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value)
    }

    return (
        <div className={`relative w-full ${className}`}>
            <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />

            <input
                type="search"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                aria-label={ariaLabel}
                disabled={disabled}
                className="h-11 w-full rounded-control border border-border bg-surface py-2 pl-10 pr-11 text-sm text-text-primary outline-none transition placeholder:text-text-secondary focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {value && (
                <IconButton
                    icon={<X size={16} />}
                    label="Clear search"
                    onClick={() => onChange('')}
                    disabled={disabled}
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                />
            )}
        </div>
    )
}

export default SearchInput