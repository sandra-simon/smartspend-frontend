
import BrandLogo from '../atoms/BrandLogo'

interface AuthBrandingProps {
  subtitle: string
  className?: string
}

function AuthBranding({
  subtitle,
  className = '',
}: AuthBrandingProps) {
  return (
    <div className={`mb-8 flex flex-col items-center text-center ${className}`}>
      <div className="relative mb-4 rounded-2xl bg-brand p-4 text-white shadow-md shadow-brand/15">
        <BrandLogo size="lg" showName={false} />

        <span
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-canvas bg-income-dark"
        />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-brand">
        SmartSpend
      </h1>

      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {subtitle}
      </p>
    </div>
  )
}

export default AuthBranding
