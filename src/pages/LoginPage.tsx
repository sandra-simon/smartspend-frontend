
import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import BrandLogo from '../components/atoms/BrandLogo'
import Button from '../components/atoms/Button'
import FormField from '../components/molecules/FormField'
import PasswordField from '../components/molecules/PasswordField'
import api from '../services/api'

interface LoginLocationState {
  email?: string
  message?: string
}

function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const registeredState = location.state as LoginLocationState | null

  const [email, setEmail] = useState(registeredState?.email ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      })

      const { access_token, refresh_token } = response.data

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = err.response

        if (
          typeof response === 'object' &&
          response !== null &&
          'status' in response &&
          response.status === 401
        ) {
          setError('Invalid email or password.')
        } else {
          setError('Login failed. Please try again.')
        }
      } else {
        setError('Unable to connect to the server. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <section className="relative isolate flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-5 py-12 sm:py-16">
        {/* Soft background glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(91,103,173,0.16),transparent_43%),radial-gradient(ellipse_at_12%_78%,rgba(110,242,174,0.22),transparent_30%),radial-gradient(ellipse_at_95%_75%,rgba(157,183,255,0.17),transparent_35%)]"
        />

        <div className="flex w-full max-w-[480px] flex-col items-center">
          {/* Page branding */}
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="relative mb-4 rounded-2xl bg-brand p-4 text-white shadow-lg shadow-brand/15">
              <BrandLogo size="lg" showName={false} />
              <span
                aria-hidden="true"
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-canvas bg-income-dark"
              />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-brand">
              SmartSpend
            </h1>

            <p className="mt-2 text-sm text-text-secondary sm:text-base">
              Welcome back. Access your financial control center.
            </p>
          </div>

          {/* Login card */}
          <div className="w-full rounded-2xl bg-surface p-6 shadow-[0_20px_45px_rgba(35,34,85,0.10)] sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              Log In
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Enter your authorized credentials to continue
            </p>

            {registeredState?.message && (
              <p
                role="status"
                className="mt-4 rounded-xl border border-income/20 bg-income/10 px-3 py-2 text-sm text-income-dark"
              >
                {registeredState.message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {/* Email */}
              <div className="relative">
                <FormField
                  id="login-email"
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="alex.chen@example.com"
                  autoComplete="email"
                  required
                  className="pl-12"
                />

                <Mail
                  aria-hidden="true"
                  size={19}
                  className="pointer-events-none absolute bottom-3.5 left-4 text-text-secondary"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <PasswordField
                  id="login-password"
                  label="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  labelAction={
                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold !text-income-dark hover:underline"
                    >
                      Forgot password?
                    </Link>
                  }
                />

                <LockKeyhole
                  aria-hidden="true"
                  size={19}
                  className="pointer-events-none absolute bottom-3.5 left-4 text-text-secondary"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-expense/20 bg-expense/10 px-3 py-2 text-sm text-expense-dark"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={isLoading}
                className="shadow-lg shadow-brand/20"
              >
                {isLoading ? 'Logging in...' : 'Log In'}
                {!isLoading && <ArrowRight size={19} />}
              </Button>
            </form>

            <div className="mt-5 border-t border-border pt-6 text-center text-sm text-text-secondary">
              New user?{' '}
              <Link
                to="/register"
                className="font-semibold !text-income-dark hover:underline"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AuthLayout>
  )
}

export default LoginPage
