
import { useState } from 'react'
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function RegisterPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const passwordStrength = (() => {
    if (!password) return 0

    let score = 0

    if (password.length >= 8) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    return score
  })()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()

    if (!trimmedUsername) {
      setError('Please enter a username.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Your password must contain at least 8 characters.')
      return
    }

    setIsLoading(true)

    try {
      await api.post('/auth/register', {
        username: trimmedUsername,
        email: trimmedEmail,
        password,
      })

      navigate('/login', {
        state: {
          message: 'Your account was created successfully. Please log in.',
          email: trimmedEmail,
        },
      })
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
          response.status === 409
        ) {
          setError('An account with this email already exists.')
        } else if (
          typeof response === 'object' &&
          response !== null &&
          'data' in response
        ) {
          const data = response.data

          if (
            typeof data === 'object' &&
            data !== null &&
            'detail' in data &&
            Array.isArray(data.detail)
          ) {
            setError(
              data.detail
                .map((item: { msg?: string }) => item.msg ?? 'Invalid input.')
                .join(' ')
            )
          } else {
            setError('Registration failed. Please check your details and try again.')
          }
        } else {
          setError('Unable to connect to the server. Please try again.')
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

            <span className="text-xl font-bold">
              SmartSpend
            </span>
          </Link>
        </div>
      </header>
      {/* Logo and heading */}
      <section className="mx-auto flex min-h-[calc(100vh-74px)] max-w-[1240px] flex-col items-center px-5 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0d0b50] shadow-md">
            <span className="text-2xl text-white">◆</span>

            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#159447]" />
          </div>

          <h1 className="mt-5 text-3xl font-bold">
            SmartSpend
          </h1>

          <p className="mt-2 text-sm text-[#777786]">
            Begin your journey. Take control of your financial future.
          </p>
        </div>



        {/* Registration card */}
        <div className="mt-8 w-full max-w-[480px] rounded-2xl bg-white p-8 shadow-[0_20px_45px_rgba(35,34,85,0.10)] sm:p-9">
          <div>
            <h2 className="text-2xl font-bold">Create Profile</h2>

            <p className="mt-1 text-sm text-[#777786]">
              Enter your details to create your secure account
            </p>
          </div>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold"
              >
                Username
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b8b98]" />

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="e.g. alexchen"
                  autoComplete="username"
                  maxLength={100}
                  required
                  className="h-12 w-full rounded-xl bg-[#f1f4fc] pl-12 pr-4 text-sm outline-none placeholder:text-[#a8a9b5] focus:ring-2 focus:ring-[#d9ddff]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email ID
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b8b98]" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="alex.chen@example.com"
                  autoComplete="email"
                  required
                  className="h-12 w-full rounded-xl bg-[#f1f4fc] pl-12 pr-4 text-sm outline-none placeholder:text-[#a8a9b5] focus:ring-2 focus:ring-[#d9ddff]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold"
                >
                  Create a Password
                </label>

                <span className="text-xs font-bold tracking-wide text-[#858592]">
                  8+ CHARS REQUIRED
                </span>
              </div>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b8b98]" />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  className="h-12 w-full rounded-xl bg-[#f1f4fc] px-12 text-sm outline-none placeholder:text-[#a8a9b5] focus:ring-2 focus:ring-[#d9ddff]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#858592]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password strength */}
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((segment) => (
                  <div
                    key={segment}
                    className={`h-1 rounded-full ${passwordStrength >= segment
                      ? 'bg-[#159447]'
                      : 'bg-[#d8e4ff]'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-semibold"
              >
                Confirm Password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b8b98]" />

                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  className="h-12 w-full rounded-xl bg-[#f1f4fc] px-12 text-sm outline-none placeholder:text-[#a8a9b5] focus:ring-2 focus:ring-[#d9ddff]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#858592]"
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#211e61] text-sm font-bold text-white shadow-md shadow-[#211e61]/15 transition hover:bg-[#17164f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Creating Profile...' : 'Create Profile'}
              {!isLoading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 border-t border-[#e3e5ee] pt-6 text-center text-sm text-[#858592]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#087b3d] hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage
