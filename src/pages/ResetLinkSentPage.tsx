import { Link } from 'react-router-dom'
import { ArrowLeft, MailCheck } from 'lucide-react'

function ResetLinkSentPage() {
  return (
    <main className="min-h-screen bg-[#f7f8ff] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl bg-white p-8 text-center shadow-[0_20px_60px_rgba(48,55,115,0.08)] sm:p-10">

          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eefbf4]">
            <MailCheck className="h-8 w-8 text-[#39a96b]" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-semibold tracking-tight text-[#20264d]">
            Check your email
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#747a96]">
            We’ve sent a password reset link to your email address.
            Please check your inbox and follow the link to reset your password.
          </p>

          {/* Email hint */}
          <div className="mt-6 rounded-xl bg-[#f7f8ff] px-4 py-3 text-sm text-[#555c7a]">
            The link will expire in 30 minutes.
          </div>

          {/* Back to login */}
          <Link
            to="/login"
            className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#20264d] transition hover:text-[#39a96b]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

        </div>
      </div>
    </main>
  )
}

export default ResetLinkSentPage