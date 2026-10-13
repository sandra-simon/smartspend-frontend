import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Button from "../components/atoms/Button";
import AuthBranding from "../components/molecules/AuthBranding";
import AlertMessage from "../components/molecules/AlertMessage";
import PasswordField from "../components/molecules/PasswordField";
import useAuth from "../hooks/useAuth";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading } = useAuth();
  const [validationError, setValidationError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setValidationError(
        "This reset link is invalid. Please request a new one.",
      );
      return;
    }

    if (password.length < 8) {
      setValidationError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    setValidationError("");

    const success = await resetPassword(token, password);

    if (success) {
      navigate("/login", {
        replace: true,
        state: {
          message: "Your password has been reset. Please log in.",
        },
      });
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
          <AuthBranding subtitle="Create a new password for your account." />

          <div className="w-full rounded-panel bg-surface p-6 shadow-elevated sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight text-brand">
              Reset Password
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Choose a strong password with at least 8 characters to keep your
              account secure.
            </p>

            {!token && (
              <AlertMessage
                message="This reset link is missing its token. Request a new reset link to continue."
                className="mt-5"
              />
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <PasswordField
                id="new-password"
                name="password"
                label="New password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your new password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required
                leadingIcon={<LockKeyhole size={19} />}
                className="border-transparent focus-visible:border-brand"
              />

              <PasswordField
                id="confirm-password"
                name="confirmPassword"
                label="Confirm new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your new password"
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required
                leadingIcon={<ShieldCheck size={19} />}
                className="border-transparent focus-visible:border-brand"
              />

              <AlertMessage message={validationError || error} />

              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={isLoading || !token}
              >
                {isLoading ? "Resetting password..." : "Reset Password"}
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

export default ResetPasswordPage;
