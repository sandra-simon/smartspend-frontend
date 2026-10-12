import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Button from '../components/atoms/Button'
import FormField from '../components/molecules/FormField'
import PasswordField from '../components/molecules/PasswordField'
import AuthBranding from '../components/molecules/AuthBranding'
import AlertMessage from '../components/molecules/AlertMessage'
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
          <AuthBranding subtitle="Welcome back. Access your financial control center." />

          {/* Login card */}
          <div className="w-full rounded-panel bg-surface p-6 shadow-elevated sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              Log In
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Enter your credentials to continue
            </p>

            {registeredState?.message && (
              <div className="mt-4">
                <AlertMessage
                  message={registeredState.message}
                  variant="success"
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {/* Email */}
              <FormField
                id="login-email"
                name="email"
                label="Email address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="alex.chen@example.com"
                autoComplete="username"
                required
                leadingIcon={<Mail size={19} />}
              />

              {/* Password */}
              <PasswordField
                id="login-password"
                label="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                name="password"
                required
                leadingIcon={<LockKeyhole size={19} />}
                className="border-transparent focus-visible:border-brand"
                labelAction={
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold !text-income-dark hover:underline"
                  >
                    Forgot password?
                  </Link>
                }
              />

              {error && (
                <AlertMessage message={error} variant="error" />
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
