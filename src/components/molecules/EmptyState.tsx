import type { ReactNode } from 'react'

interface EmptyStateProps {
    icon: ReactNode
    title: string
    description?: string
    action?: ReactNode
    className?: string
}

function EmptyState({
    icon,
    title,
    description,
    action,
    className = '',
}: EmptyStateProps) {
    return (
        <div
            className={`flex min-h-[180px] flex-col items-center justify-center px-4 py-8 text-center ${className}`}
        >
            <div
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-muted"
            >
                {icon}
            </div>

            <h3 className="mt-3 text-sm font-semibold text-text-primary">
                {title}
            </h3>

            {description && (
                <p className="mt-1 max-w-sm text-xs leading-5 text-text-secondary">
                    {description}
                </p>
            )}

            {action && <div className="mt-4">{action}</div>}
        </div>
    )
}

export default EmptyState