
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import Input from '../atoms/Input'
import Label from '../atoms/Label'

interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
  labelAction?: ReactNode
}

function PasswordField({
  id,
  label,
  error,
  labelAction,
  required,
  className = '',
  ...inputProps
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-3">
        <Label htmlFor={id} className="mb-0">
          {label}
          {required && <span className="ml-1 text-expense">*</span>}
        </Label>

        {labelAction}
      </div>

      <div className="relative">
        <Input
          {...inputProps}
          id={id}
          type={visible ? 'text' : 'password'}
          required={required}
          invalid={Boolean(error)}
          className={`pl-12 pr-12 ${className}`}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary hover:text-text-primary"
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-expense">
          {error}
        </p>
      )}
    </div>
  )
}

export default PasswordField
