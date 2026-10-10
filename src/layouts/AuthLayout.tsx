
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../components/atoms/BrandLogo'

interface AuthLayoutProps {
  children: ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-canvas text-text-primary">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-5 sm:px-8">
          <Link to="/" aria-label="SmartSpend home">
            <BrandLogo size="md" />
          </Link>
        </div>
      </header>

      {children}
    </main>
  )
}

export default AuthLayout
