import {
  ArrowRight,
  ArrowLeftRight,
  BarChart3,
  ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#17184f]">
      {/* Navbar */}
      <header className="border-b border-[#e7e9f4] bg-white">
        <div className="mx-auto flex h-[74px] max-w-[1200px] items-center justify-between px-6 lg:px-0">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#181653]">
              <span className="text-lg text-white">◆</span>
            </div>

            <span className="text-xl font-bold">
              SmartSpend
            </span>
          </Link>

          <Link
            to="/get-started"
            className="rounded-xl bg-[#11104f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#201f68]"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex min-h-[450px] max-w-[1000px] flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-[750px] text-4xl font-bold leading-tight sm:text-5xl">
          Master your money with{' '}
          <span className="text-[#65659a]">SmartSpend</span>
        </h1>

        <p className="mt-6 max-w-[720px] text-base leading-7 text-[#555568] sm:text-lg">
          Effortlessly track daily expenses, visualize cash flow, and achieve
          your financial goals.
        </p>

        <Link
          to="/get-started"
          className="mt-9 flex items-center gap-3 rounded-xl bg-[#211e61] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#211e61]/20 transition hover:bg-[#15134d]"
        >
          Get Started
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1200px] px-6 pb-32 lg:px-0">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-md bg-[#edf2ff] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#666b9d]">
            Features
          </span>

          <h2 className="mt-3 text-2xl font-bold">
            Thoughtfully Designed Essentials
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Feature 1 */}
          <article className="relative overflow-hidden rounded-2xl border border-[#dce4ff] bg-white p-8 shadow-sm">
            <div className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-emerald-100/70 blur-3xl" />

            <div className="relative flex items-start justify-between">
              <ArrowLeftRight className="h-6 w-6 text-emerald-700" strokeWidth={2} />

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wider text-emerald-700">
                AUTOMATED
              </span>
            </div>

            <div className="relative mt-7">
              <h3 className="text-lg font-bold">
                Track Income & Expenses
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#5b5b68]">
                Log daily spending and deposits with automated categorization.
              </p>
            </div>
          </article>

          {/* Feature 2 */}
          <article className="relative overflow-hidden rounded-2xl border border-[#dce4ff] bg-white p-8 shadow-sm">
            <div className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-indigo-100/70 blur-3xl" />

            <div className="relative flex items-start justify-between">
              <BarChart3 className="h-6 w-6 text-indigo-700" strokeWidth={2} />

              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wider text-indigo-700">
                REAL-TIME
              </span>
            </div>

            <div className="relative mt-7">
              <h3 className="text-lg font-bold">
                Visual Analytics
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#5b5b68]">
                Understand cash flow and monthly spending patterns through
                intuitive charts.
              </p>
            </div>
          </article>

          {/* Feature 3 */}
          <article className="relative overflow-hidden rounded-2xl border border-[#dce4ff] bg-white p-8 shadow-sm">
            <div className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-blue-100/70 blur-3xl" />

            <div className="relative flex items-start justify-between">
              <ChevronRight
                className="h-6 w-6 text-blue-700"
                strokeWidth={2}
                />

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold tracking-wider text-blue-700">
                FLEXIBLE
              </span>
            </div>

            <div className="relative mt-7">
              <h3 className="text-lg font-bold">
                Custom Categories
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#5b5b68]">
                Organize transactions your way with flexible categories and
                customized budget limits.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e7e9f4] bg-white">
        <div className="mx-auto flex h-24 max-w-[1200px] items-center px-6 lg:px-0">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#181653]">
              <span className="text-sm text-white">◆</span>
            </div>

            <span className="text-lg font-bold">
              SmartSpend
            </span>
          </Link>
        </div>
      </footer>
    </main>
  )
}

export default LandingPage