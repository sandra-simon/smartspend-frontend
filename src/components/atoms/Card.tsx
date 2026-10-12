import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
    padding?: 'none' | 'sm' | 'md' | 'lg'
}

function Card({
    children,
    padding = 'md',
    className = '',
    ...props
}: CardProps) {
    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-5 sm:p-6',
        lg: 'p-6 sm:p-7',
    }

    return (
        <div
            className={`rounded-card border border-border bg-surface shadow-card ${paddingStyles[padding]} ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}

export default Card