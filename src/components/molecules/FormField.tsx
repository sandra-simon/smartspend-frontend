
import type { InputHTMLAttributes, ReactNode } from 'react'
import Input from '../atoms/Input'
import Label from '../atoms/Label'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  leadingIcon?: ReactNode
}

function FormField({
  id,
  label,
  error,
  hint,
  leadingIcon,
  required,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className="w-full">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-expense">*</span>}
      </Label>

      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-text-secondary">
            {leadingIcon}
          </span>
        )}

        <Input
          {...inputProps}
          id={id}
          required={required}
          invalid={Boolean(error)}
          hasLeadingIcon={Boolean(leadingIcon)}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-expense">
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-text-secondary">
          {hint}
        </p>
      )}
    </div>
  )
}

export default FormField
