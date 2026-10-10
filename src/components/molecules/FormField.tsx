
import type { InputHTMLAttributes } from 'react'
import Input from '../atoms/Input'
import Label from '../atoms/Label'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

function FormField({
  id,
  label,
  error,
  hint,
  required,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className="w-full">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-expense">*</span>}
      </Label>

      <Input
        id={id}
        required={required}
        invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        {...inputProps}
      />

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
