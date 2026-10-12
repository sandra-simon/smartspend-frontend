import type { ReactNode } from 'react'
import AppHeader from '../components/organisms/AppHeader'

interface AppLayoutProps {
  children: ReactNode
  username?: string
  email?: string
  wide?: boolean
}

function AppLayout({
  children,
  username,
  email,
  wide = false,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      <AppHeader username={username} email={email} />

      <main
        className={`mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 ${wide ? 'max-w-[1400px]' : 'max-w-7xl'
          }`}
      >
        {children}
      </main>
    </div>
  )
}

export default AppLayout