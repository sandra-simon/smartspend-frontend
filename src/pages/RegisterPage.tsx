
import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import AuthLayout from '../layouts/AuthLayout'
import Button from '../components/atoms/Button'
import FormField from '../components/molecules/FormField'
import PasswordField from '../components/molecules/PasswordField'
import AuthBranding from '../components/molecules/AuthBranding'
import AlertMessage from '../components/molecules/AlertMessage'
import useAuth from '../hooks/useAuth'

function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading, error, setError } = useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const passwordStrength = (() => {
    if (!password) return 0

    let score = 0

    if (password.length >= 8) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    return score
  })()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    const success = await register(
      trimmedUsername,
      trimmedEmail,
      password,
    )

    if (success) {
      navigate('/login', {
        state: {
          message: 'Your account was created successfully. Please log in.',
          email: trimmedEmail,
        },
      })
    }
  }

  return (
    <AuthLayout>
      <section className="relative isolate flex min-h-[calc(100vh-72px)] items-start justify-center overflow-hidden px-5 py-10 sm:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(91,103,173,0.10),transparent_48%),radial-gradient(ellipse_at_10%_55%,rgba(110,242,174,0.10),transparent_35%),radial-gradient(ellipse_at_95%_75%,rgba(157,183,255,0.10),transparent_38%)]"
        />

        <div className="flex w-full max-w-[480px] flex-col items-center">
          <AuthBranding
            subtitle="Begin your journey. Take control of your financial future."
          />

          <div className="w-full rounded-panel bg-surface p-6 shadow-elevated sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight text-brand">
              Create Profile
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Enter your details to create your secure account
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <FormField
                id="username"
                name="username"
                label="Username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="e.g. alexchen"
                autoComplete="nickname"
                maxLength={100}
                required
                leadingIcon={<User size={19} />}
              />

              <FormField
                id="email"
                name="email"
                label="Email ID"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="alex.chen@example.com"
                autoComplete="username"
                required
                leadingIcon={<Mail size={19} />}
              />

              <div>
                <PasswordField
                  id="password"
                  label="Create a Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter at least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  leadingIcon={<LockKeyhole size={19} />}
                  className="border-transparent focus-visible:border-brand"
                  labelAction={
                    <span className="text-xs font-bold tracking-wide text-text-secondary">
                      8+ CHARS REQUIRED
                    </span>
                  }
                />

                <div
                  className="mt-3 grid grid-cols-4 gap-2"
                  aria-label={`Password strength: ${passwordStrength} of 4`}
                >
                  {[1, 2, 3, 4].map((segment) => (
                    <div
                      key={segment}
                      className={`h-1 rounded-full ${
                        passwordStrength >= segment
                          ? 'bg-income'
                          : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <PasswordField
                id="confirm-password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required
                leadingIcon={<ShieldCheck size={19} />}
                className="border-transparent focus-visible:border-brand"
              />

              {error && <AlertMessage message={error} variant="error" />}

              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Creating Profile...' : 'Create Profile'}
                {!isLoading && <ArrowRight size={19} />}
              </Button>
            </form>

            <div className="mt-6 border-t border-border pt-6 text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold !text-income-dark hover:underline"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AuthLayout>
  )
}

export default RegisterPage
