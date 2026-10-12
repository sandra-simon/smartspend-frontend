import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, UserRound } from 'lucide-react'
import BrandLogo from '../atoms/BrandLogo'
import Button from '../atoms/Button'
import { logout } from '../../utils/logout'

interface AppHeaderProps {
  username?: string
  email?: string
}

const navigationItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Transactions', to: '/transactions' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Settings', to: '/settings' },
]

function AppHeader({
  username = 'My Account',
  email = '',
}: AppHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex min-h-[72px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <Link to="/" aria-label="SmartSpend dashboard" className="shrink-0">
            <BrandLogo size="md" />
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
            {navigationItems.map(({ label, to }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `inline-flex items-center rounded-control px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand text-white' : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                }`
              }>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="relative shrink-0">
          <Button variant="ghost" className="gap-2 px-2" aria-expanded={isMenuOpen} aria-haspopup="menu" onClick={() => setIsMenuOpen((open) => !open)}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <UserRound size={18} />
            </span>
            <span className="hidden max-w-36 text-left sm:block">
              <span className="block truncate text-sm font-semibold text-text-primary">{username}</span>
              {email && <span className="block truncate text-xs text-text-secondary">{email}</span>}
            </span>
            <ChevronDown size={16} />
          </Button>
          {isMenuOpen && (
            <div role="menu" className="absolute right-0 top-full mt-2 w-52 rounded-card border border-border bg-surface p-2 shadow-elevated">
              <button type="button" role="menuitem" onClick={() => { setIsMenuOpen(false); navigate('/profile') }} className="flex w-full items-center gap-2 rounded-control px-3 py-2 text-sm text-text-primary hover:bg-surface-muted">
                <UserRound size={16} /> View Profile
              </button>
              <button type="button" role="menuitem" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-control px-3 py-2 text-sm text-expense-dark hover:bg-expense/10">
                <LogOut size={16} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      <nav aria-label="Mobile navigation" className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2 md:hidden">
        {navigationItems.map(({ label, to }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `inline-flex shrink-0 items-center rounded-control px-3 py-2 text-xs font-medium ${
              isActive ? 'bg-brand text-white' : 'text-text-secondary hover:bg-surface-muted'
            }`
          }>
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default AppHeader
