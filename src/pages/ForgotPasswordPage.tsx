
import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import BrandLogo from '../components/atoms/BrandLogo'
import Button from '../components/atoms/Button'
import FormField from '../components/molecules/FormField'
import api from '../services/api'

function ForgotPasswordPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await api.post('/auth/forgot-password', {
                email: email.trim(),
            })

            navigate('/reset-link-sent', { replace: true })
        } catch {
            setError(
                'We could not process your request right now. Please try again.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout>
            <section className="relative isolate flex min-h-[calc(100vh-72px)] flex-col items-center justify-center overflow-hidden px-5 py-12 sm:py-16">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(91,103,173,0.10),transparent_48%),radial-gradient(ellipse_at_10%_55%,rgba(110,242,174,0.10),transparent_35%),radial-gradient(ellipse_at_95%_75%,rgba(157,183,255,0.10),transparent_38%)]"
                />

                <div className="flex w-full max-w-[480px] flex-col items-center">
                    {/* Branding */}
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="relative mb-4 rounded-2xl bg-brand p-4 text-white shadow-md shadow-brand/15">
                            <BrandLogo size="lg" showName={false} />
                            <span
                                aria-hidden="true"
                                className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-canvas bg-income-dark"
                            />
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-brand">
                            SmartSpend
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                            Reset your password and get back to managing your finances.
                        </p>
                    </div>

                    {/* Forgot password card */}
                    <div className="w-full rounded-2xl bg-surface p-6 shadow-[0_20px_45px_rgba(35,34,85,0.10)] sm:p-9">
                        <h2 className="text-2xl font-bold tracking-tight text-brand">
                            Forgot Password?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                            Enter the email address associated with your SmartSpend account.
                            We'll send you a secure link to reset your password.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                            <FormField
                                id="forgot-email"
                                name="email"
                                label="Email address"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="alex.chen@example.com"
                                autoComplete="email"
                                required
                                leadingIcon={<Mail size={19} />}
                            />

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
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                                {!isLoading && <ArrowRight size={19} />}
                            </Button>
                        </form>

                        <div className="mt-6 border-t border-border pt-6 text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm font-semibold !text-income-dark hover:underline"
                            >
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </AuthLayout>
    )
}

export default ForgotPasswordPage
