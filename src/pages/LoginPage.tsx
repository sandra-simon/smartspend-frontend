
import { useState } from 'react'
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err
      ) {
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
    <main className="min-h-screen bg-[#f7f8ff] text-[#11104f]">
      {/* Top navigation */}
      <header className="border-b border-[#e7e9f4] bg-white">
        <div className="mx-auto flex h-[74px] max-w-[1240px] items-center px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#181653]">
              <span className="text-lg text-white">◆</span>
            </div>

            <span className="text-xl font-bold">SmartSpend</span>
          </Link>
        </div>
      </header>

      {/* Login content */}
      <section className="mx-auto flex min-h-[calc(100vh-74px)] max-w-[1240px] flex-col items-center px-5 py-16">
        {/* Logo and heading */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0d0b50] shadow-md">
            <span className="text-2xl text-white">◆</span>
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#159447]" />
          </div>

          <h1 className="mt-4 text-3xl font-bold">SmartSpend</h1>

          <p className="mt-1 text-sm text-[#777786]">
            Welcome back. Access your financial control center.
          </p>
        </div>

        {/* Login card */}
        <div className="mt-8 w-full max-w-[480px] rounded-2xl bg-white p-8 shadow-[0_20px_45px_rgba(35,34,85,0.10)] sm:p-9">
          <h2 className="text-2xl font-bold">Log In</h2>

          <p className="mt-2 text-sm text-[#777786]">
            Enter your authorized credentials to continue
          </p>

          {registeredState?.message && (
            <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              {registeredState.message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-semibold"
              >
                Email address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5f606d]" />

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="alex.chen@example.com"
                  autoComplete="email"
                  required
                  className="h-12 w-full rounded-xl border border-[#f0f0f3] bg-white pl-12 pr-4 text-sm outline-none placeholder:text-[#858692] focus:border-[#cdd3f8] focus:ring-2 focus:ring-[#e5e8ff]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-[#087b3d] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5f606d]" />

                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="h-12 w-full rounded-xl border border-[#f0f0f3] bg-white px-12 text-sm outline-none placeholder:text-[#858692] focus:border-[#cdd3f8] focus:ring-2 focus:ring-[#e5e8ff]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5f606d]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#211e61] text-sm font-bold text-white shadow-md shadow-[#211e61]/20 transition hover:bg-[#17164f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
              {!isLoading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-5 border-t border-[#e3e5ee] pt-6 text-center text-sm text-[#777786]">
            New user?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#087b3d] hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
