
import {
  ArrowLeftRight,
  ArrowRight,
  BarChart3,
  ChevronRight,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '../components/atoms/BrandLogo'
import Button from '../components/atoms/Button'
import FeatureCard from '../components/molecules/FeatureCard'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-canvas text-text-primary">
      {/* Navbar */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" aria-label="SmartSpend home">
            <BrandLogo size="md" />
          </Link>

          <Button size="md" onClick={() => navigate('/get-started')}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate flex min-h-[420px] flex-col items-center justify-center overflow-hidden px-5 py-16 text-center sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_25%,rgba(110,242,174,0.12),transparent_36%),radial-gradient(ellipse_at_50%_75%,rgba(157,183,255,0.12),transparent_42%)]"
        />

        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-brand sm:text-[42px] lg:text-page-title">
          Master your money with{' '}
          <span className="text-brand-muted">SmartSpend</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
          Effortlessly track daily expenses, visualize cash flow, and achieve
          your financial goals.
        </p>

        <Button
          size="lg"
          className="mt-9"
          onClick={() => navigate('/get-started')}
        >
          Get Started
          <ArrowRight size={19} />
        </Button>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-5 sm:px-8 sm:pb-28">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-md bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-muted">
            Features
          </span>

          <h2 className="mt-3 text-section-title font-bold text-brand">
            Thoughtfully Designed Essentials
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          <FeatureCard
            icon={<ArrowLeftRight size={25} strokeWidth={2} />}
            title="Track Income & Expenses"
            description="Record income and expenses in one place and keep track of your spending."
            badge="Manual tracking"
            iconColor="text-income-dark"
            iconBackground="bg-success-soft"
            badgeColor="bg-success-soft text-income-dark"
            glowColor="bg-income/10"
          />

          <FeatureCard
            icon={<BarChart3 size={25} strokeWidth={2} />}
            title="Visual Analytics"
            description="Understand cash flow and monthly spending patterns through intuitive charts."
            badge="Insights"
            iconColor="text-indigo-600"
            iconBackground="bg-violet-soft"
            badgeColor="bg-violet-soft text-indigo-700"
            glowColor="bg-indigo-100/70"
          />

          <FeatureCard
            icon={<ChevronRight size={25} strokeWidth={2} />}
            title="Custom Categories"
            description="Organize transactions with custom categories and monthly budget limits."
            badge="Flexible"
            iconColor="text-blue-700"
            iconBackground="bg-info-soft"
            badgeColor="bg-info-soft text-blue-700"
            glowColor="bg-blue-100/70"
          />
        </div>
      </section>
    </main>
  )
}

export default LandingPage
