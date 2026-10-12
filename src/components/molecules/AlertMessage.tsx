
interface AlertMessageProps {
  message: string
  variant?: 'error' | 'success'
  className?: string
}

interface AlertStyle {
  container: string
  text: string
  role: 'alert' | 'status'
}

const alertStyles: Record<'error' | 'success', AlertStyle> = {
  error: {
    container: 'border-expense/20 bg-expense/10',
    text: 'text-expense-dark',
    role: 'alert',
  },
  success: {
    container: 'border-income/20 bg-income/10',
    text: 'text-income-dark',
    role: 'status',
  },
}

function AlertMessage({
  message,
  variant = 'error',
  className = '',
}: AlertMessageProps) {
  if (!message) return null

  const styles = alertStyles[variant]

  return (
    <p
      role={styles.role}
      className={`rounded-xl border px-3 py-2 text-sm ${styles.container} ${styles.text} ${className}`}
    >
      {message}
    </p>
  )
}

export default AlertMessage
