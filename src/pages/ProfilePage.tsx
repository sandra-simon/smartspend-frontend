import { useEffect, useState } from "react";
import { CalendarDays, Check, LockKeyhole, Mail, UserRound } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import Card from "../components/atoms/Card";
import Button from "../components/atoms/Button";
import ChangePassword from "../components/organisms/ChangePassword";
import {
  fetchUserPreferences,
  updateUsername,
  type UserPreferences,
} from "../services/preferencesService";

function ProfilePage() {
  const [user, setUser] = useState<UserPreferences | null>(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const profile = await fetchUserPreferences();

        if (!active) return;

        setUser(profile);
        setUsername(profile.username);
      } catch {
        if (active) {
          setError("Unable to load your profile. Please try again.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  async function handleSave() {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Username cannot be empty.");
      return;
    }

    if (trimmedUsername === user?.username) {
      setError("");
      setNotice("No changes to save.");
      return;
    }

    setIsSaving(true);
    setError("");
    setNotice("");

    try {
      const updatedUser = await updateUsername(trimmedUsername);
      setUser(updatedUser);
      setUsername(updatedUser.username);
      setNotice("Account changes saved successfully.");
    } catch (caughtError: unknown) {
      const response = (
        caughtError as {
          response?: { data?: { detail?: unknown } };
        }
      )?.response?.data?.detail;

      const message =
        typeof response === "string"
          ? response
          : typeof response === "object" &&
              response !== null &&
              "error" in response &&
              typeof response.error === "object" &&
              response.error !== null &&
              "message" in response.error &&
              typeof response.error.message === "string"
            ? response.error.message
            : "Unable to save your changes. Please try again.";

      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  const initial = (username.trim() || user?.username || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <AppLayout wide>
      <div className="mx-auto max-w-5xl space-y-7">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Profile
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Manage your personal account credentials and security preferences.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-control bg-expense/10 p-3 text-sm text-expense-dark"
          >
            {error}
          </p>
        )}

        {notice && (
          <p
            role="status"
            className="rounded-control bg-success-soft p-3 text-sm text-income-dark"
          >
            {notice}
          </p>
        )}

        <Card padding="lg" className="space-y-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-brand">
                Account Information
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Your profile identity and account details.
              </p>
            </div>
            <span className="rounded-md bg-brand-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
              Credentials
            </span>
          </div>

          {isLoading ? (
            <p className="text-sm text-text-secondary">Loading profile...</p>
          ) : user ? (
            <>
              <div className="flex items-center gap-4">
                <div
                  aria-label={`Avatar for ${username}`}
                  className="flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-brand-soft bg-brand text-3xl font-bold text-white shadow-sm"
                >
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-text-primary">
                    {username || user.username}
                  </p>
                  <p className="truncate text-sm text-text-secondary">
                    {user.email}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-brand-soft px-2 py-1 text-xs text-text-secondary">
                    <CalendarDays size={13} />
                    Joined{" "}
                    {new Date(user.joined_at).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="profile-username"
                    className="block text-sm font-semibold text-text-primary"
                  >
                    Username
                  </label>
                  <div className="flex h-12 items-center gap-3 rounded-control border border-border bg-input px-4 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
                    <UserRound
                      size={18}
                      className="shrink-0 text-text-secondary"
                    />
                    <input
                      id="profile-username"
                      name="username"
                      value={username}
                      onChange={(event) => {
                        setUsername(event.target.value);
                        setError("");
                        setNotice("");
                      }}
                      maxLength={50}
                      autoComplete="username"
                      disabled={isSaving}
                      className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="profile-email"
                    className="block text-sm font-semibold text-text-primary"
                  >
                    Email Address
                  </label>
                  <div className="flex h-12 items-center gap-3 rounded-control border border-border bg-input px-4">
                    <Mail
                      size={18}
                      className="shrink-0 text-text-secondary"
                    />
                    <input
                      id="profile-email"
                      value={user.email}
                      readOnly
                      aria-readonly="true"
                      className="min-w-0 flex-1 cursor-not-allowed bg-transparent text-sm text-text-primary outline-none"
                    />
                    <span className="sr-only">Email cannot be edited.</span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Email address cannot be changed.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving || username.trim() === user.username}
                className="gap-2"
              >
                <Check size={17} />
                {isSaving ? "Saving..." : "Save Account Changes"}
              </Button>
            </>
          ) : (
            <p className="text-sm text-text-secondary">
              Profile information is unavailable.
            </p>
          )}
        </Card>

        <Card padding="lg" className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <LockKeyhole size={21} />
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-brand">
                Password Credentials
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Manage your login password and security credentials.
              </p>
            </div>
          </div>
          <ChangePassword />
        </Card>
      </div>
    </AppLayout>
  );
}

export default ProfilePage;