
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

function Input({
  invalid = false,
  className = '',
  type = 'text',
  ...props
}: InputProps) {
  const baseStyles =
    'w-full min-w-0 rounded-xl border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60'

  const stateStyles = invalid
    ? 'border-expense focus-visible:ring-expense'
    : 'border-border focus-visible:border-brand'

  return (
    <input
      type={type}
      aria-invalid={invalid || undefined}
      className={`${baseStyles} ${stateStyles} ${className}`}
      {...props}
    />
  )
}

export default Input
