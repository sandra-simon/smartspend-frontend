interface DateInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  min?: string
  max?: string
  className?: string
}

function DateInput({ label, value, onChange, min, max, className = '' }: DateInputProps) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-1 block text-xs font-medium text-text-secondary">{label}</span>
      <input
        type="date"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full min-w-0 rounded-control border border-border bg-input px-3 text-sm text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
      />
    </label>
  )
}

export default DateInput
