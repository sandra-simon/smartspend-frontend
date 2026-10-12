import { LoaderCircle } from 'lucide-react'

interface LoadingStateProps {
    message?: string
    className?: string
    minHeight?: string
}

function LoadingState({
    message = 'Loading...',
    className = '',
    minHeight = 'min-h-[180px]',
}: LoadingStateProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={`flex ${minHeight} flex-col items-center justify-center gap-3 rounded-card bg-surface px-4 py-8 text-center text-text-secondary ${className}`}
        >
            <LoaderCircle
                size={28}
                className="animate-spin text-brand"
                aria-hidden="true"
            />

            <p className="text-sm font-medium">{message}</p>
        </div>
    )
}

export default LoadingState