import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
  variant?: 'default' | 'danger'
}

function IconButton({
  icon,
  label,
  variant = 'default',
  className = '',
  type = 'button',
  ...props
}: IconButtonProps) {
  const variantStyles = {
    default:
      'text-text-secondary hover:bg-surface-muted hover:text-text-primary',
    danger:
      'text-expense-dark hover:bg-expense/10',
  }

  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-control transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  )
}

export default IconButton
