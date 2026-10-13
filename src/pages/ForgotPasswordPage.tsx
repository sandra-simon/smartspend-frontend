import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Button from "../components/atoms/Button";
import FormField from "../components/molecules/FormField";
import AuthBranding from "../components/molecules/AuthBranding";
import AlertMessage from "../components/molecules/AlertMessage";
import useAuth from "../hooks/useAuth";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { forgotPassword, error, isLoading } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const success = await forgotPassword(email);

    if (success) {
      navigate("/reset-link-sent", { replace: true });
    }
  };

  return (
    <AuthLayout>
      <section className="relative isolate flex min-h-[calc(100vh-72px)] flex-col items-center justify-center overflow-hidden px-5 py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(91,103,173,0.10),transparent_48%),radial-gradient(ellipse_at_10%_55%,rgba(110,242,174,0.10),transparent_35%),radial-gradient(ellipse_at_95%_75%,rgba(157,183,255,0.10),transparent_38%)]"
        />

        <div className="flex w-full max-w-[480px] flex-col items-center">
          {/* Branding */}
          <AuthBranding subtitle="Reset your password and get back to managing your finances." />

          {/* Forgot password card */}
          <div className="w-full rounded-panel bg-surface p-6 shadow-elevated sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight text-brand">
              Forgot Password?
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Enter the email address associated with your SmartSpend account.
              If an account exists with that email, we'll send a secure password
              reset link.
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

              {error && <AlertMessage message={error} variant="error" />}

              <Button type="submit" size="lg" fullWidth disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
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
  );
}

export default ForgotPasswordPage;
