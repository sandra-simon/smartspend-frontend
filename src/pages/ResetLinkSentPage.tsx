import { Link } from 'react-router-dom'
import { ArrowLeft, MailCheck } from 'lucide-react'
import AuthLayout from '../layouts/AuthLayout'
import AuthBranding from '../components/molecules/AuthBranding'

function ResetLinkSentPage() {
  return (
    <AuthLayout>
      <section className="relative isolate flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-5 py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(91,103,173,0.10),transparent_48%),radial-gradient(ellipse_at_10%_55%,rgba(110,242,174,0.10),transparent_35%),radial-gradient(ellipse_at_95%_75%,rgba(157,183,255,0.10),transparent_38%)]"
        />

        <div className="w-full max-w-[480px]">
          <AuthBranding subtitle="One step closer to managing your finances." />

          <div className="w-full rounded-panel bg-surface p-6 text-center shadow-elevated sm:p-9">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-income/10">
              <MailCheck size={32} className="text-income-dark" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-brand">
              Check your email
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-text-secondary">
              If an account exists with that email address, we’ve sent a
              password reset link. Please check your inbox and follow the
              instructions to reset your password.
            </p>

            <div className="mt-6 rounded-xl bg-input px-4 py-3 text-sm leading-6 text-text-secondary">
              The reset link expires in 30 minutes.
            </div>

            <Link
              to="/login"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold !text-income-dark hover:underline"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </section>
    </AuthLayout>
  )
}

export default ResetLinkSentPage