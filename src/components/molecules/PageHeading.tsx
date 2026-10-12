
import type { ReactNode } from 'react'

interface PageHeadingProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

function PageHeading({
  title,
  description,
  actions,
  className = '',
}: PageHeadingProps) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="min-w-0">
        <h1 className="text-section-title font-bold tracking-tight text-brand">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  )
}

export default PageHeading
