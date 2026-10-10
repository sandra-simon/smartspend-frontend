import { useState } from 'react'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

function ForgotPasswordPage() {
    const [email, setEmail] = useState('')

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

            {/* Content */}
            <section className="mx-auto flex min-h-[calc(100vh-74px)] max-w-[1240px] flex-col items-center px-5 py-16">
                {/* Logo */}
                <div className="flex flex-col items-center text-center">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0d0b50] shadow-md">
                        <span className="text-2xl text-white">◆</span>

                        <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#159447]" />
                    </div>

                    <h1 className="mt-4 text-3xl font-bold">SmartSpend</h1>

                    <p className="mt-1 text-sm text-[#777786]">
                        Reset your password and get back to managing your finances.
                    </p>
                </div>

                {/* Card */}
                <div className="mt-8 w-full max-w-[480px] rounded-2xl bg-white p-8 shadow-[0_20px_45px_rgba(35,34,85,0.10)] sm:p-9">
                    <h2 className="text-2xl font-bold">Forgot Password?</h2>

                    <p className="mt-2 text-sm leading-6 text-[#777786]">
                        Enter the email address associated with your SmartSpend account.
                        We'll send you a secure link to reset your password.
                    </p>

                    <form
                        className="mt-7 space-y-5"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <div>
                            <label
                                htmlFor="forgot-email"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Email address
                            </label>

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5f606d]" />

                                <input
                                    id="forgot-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="alex.chen@example.com"
                                    className="h-12 w-full rounded-xl border border-[#f0f0f3] bg-white pl-12 pr-4 text-sm outline-none placeholder:text-[#858692] focus:border-[#cdd3f8] focus:ring-2 focus:ring-[#e5e8ff]"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#211e61] text-sm font-bold text-white shadow-md shadow-[#211e61]/20 transition hover:bg-[#17164f]"
                        >
                            Send Reset Link
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </form>

                    <div className="mt-6 border-t border-[#e3e5ee] pt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#087b3d] hover:underline"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ForgotPasswordPage