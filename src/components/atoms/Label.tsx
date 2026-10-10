
import type { LabelHTMLAttributes, ReactNode } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
}

function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`mb-1.5 block text-sm font-medium text-text-primary ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}

export default Label
