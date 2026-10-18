import { useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import PasswordField from "../molecules/PasswordField";
import { changePasswordRequest } from "../../services/authService";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    if (newPassword.length > 128) {
      setError("New password cannot exceed 128 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Your new password must differ from your current password.");
      return;
    }

    setIsSaving(true);

    try {
      await changePasswordRequest({
        current_password: currentPassword,
        new_password: newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Your password has been updated successfully.");
    } catch (caughtError: unknown) {
      const errorResponse = caughtError as {
        response?: {
          status?: number;
          data?: {
            detail?:
              | {
                  error?: {
                    code?: string;
                    message?: string;
                  };
                }
              | string;
          };
        };
        request?: unknown;
      };

      const status = errorResponse.response?.status;
      const detail = errorResponse.response?.data?.detail;

      const errorCode =
        typeof detail === "object" && detail !== null
          ? detail.error?.code
          : undefined;

      if (errorCode === "INVALID_CURRENT_PASSWORD") {
        setError("Your current password is incorrect.");
      } else if (errorCode === "AUTHENTICATION_REQUIRED" || status === 401) {
        setError("Your session may have expired. Please log in again.");
      } else if (errorCode === "USER_NOT_FOUND") {
        setError("Your account could not be found. Please log in again.");
      } else if (status === 422) {
        setError("Please check your password details and try again.");
      } else if (status !== undefined && status >= 500) {
        setError("Something went wrong on our end. Please try again later.");
      } else if (!errorResponse.response && errorResponse.request) {
        setError(
          "Unable to connect. Check your internet connection and try again.",
        );
      } else if (
        typeof detail === "object" &&
        detail !== null &&
        typeof detail.error?.message === "string"
      ) {
        setError(detail.error.message);
      } else {
        setError("Unable to update your password. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mt-5 border-t border-border pt-5">
      <p className="mb-5 text-sm text-text-secondary">
        Update your password to keep your account secure.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField
          id="current-password"
          label="Current password"
          placeholder="Enter your current password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          leadingIcon={<LockKeyhole size={18} />}
          required
          autoComplete="current-password"
          error={undefined}
        />

        <PasswordField
          id="new-password"
          label="New password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          leadingIcon={<LockKeyhole size={18} />}
          required
          autoComplete="new-password"
        />

        <PasswordField
          id="confirm-password"
          label="Confirm new password"
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          leadingIcon={<LockKeyhole size={18} />}
          required
          autoComplete="new-password"
        />

        {error && (
          <p role="alert" className="text-sm text-expense">
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="text-sm text-green-600 dark:text-green-400"
          >
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
