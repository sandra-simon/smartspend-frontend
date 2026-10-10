
import { Wallet } from 'lucide-react'

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  className?: string
}

const iconSizes = {
  sm: 18,
  md: 22,
  lg: 28,
}

const textSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

function BrandLogo({
  size = 'md',
  showName = true,
  className = '',
}: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex shrink-0 items-center justify-center rounded-xl bg-brand p-2 text-white">
        <Wallet size={iconSizes[size]} strokeWidth={2} />
      </span>

      {showName && (
        <span className={`${textSizes[size]} font-bold tracking-tight text-brand`}>
          SmartSpend
        </span>
      )}
    </div>
  )
}

export default BrandLogo
