import { useEffect, useState } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import Card from "../atoms/Card";
import {
  fetchUserPreferences,
  updateThemePreference,
} from "../../services/preferencesService";
import type { ThemePreference } from "../../utils/theme";
import { applyTheme } from "../../utils/theme";

const themeOptions: {
  value: ThemePreference;
  label: string;
  description: string;
  Icon: typeof Sun;
}[] = [
  {
    value: "light",
    label: "Light",
    description: "Use the light appearance.",
    Icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Use the dark appearance.",
    Icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Follow your device's appearance setting.",
    Icon: Monitor,
  },
];

function Preferences() {
  const [theme, setTheme] = useState<ThemePreference>("light");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPreferences() {
      try {
        const preferences = await fetchUserPreferences();

        if (!active) return;

        const savedTheme: ThemePreference =
          preferences.theme === "dark" || preferences.theme === "system"
            ? preferences.theme
            : "light";

        setTheme(savedTheme);
        localStorage.setItem("theme_preference", savedTheme);
        applyTheme(savedTheme);
      } catch {
        if (active) {
          setError("Unable to load your preferences. Please try again.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadPreferences();

    return () => {
      active = false;
    };
  }, []);

  async function handleThemeChange(nextTheme: ThemePreference) {
    if (nextTheme === theme || isSaving) return;

    const previousTheme = theme;

    setTheme(nextTheme);
    setError("");
    setNotice("");
    setIsSaving(true);
    applyTheme(nextTheme);

    try {
      await updateThemePreference(nextTheme);
      localStorage.setItem("theme_preference", nextTheme);
      setNotice("Appearance preference saved.");
    } catch {
      setTheme(previousTheme);
      applyTheme(previousTheme);
      setError(
        "Unable to save your theme. Your previous setting was restored.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card padding="lg" className="space-y-5">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-brand">
          Preferences
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Customize the appearance of SmartSpend.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary">
          Appearance Mode
        </h3>
        <p className="mt-1 text-xs text-text-secondary">
          Choose how SmartSpend looks on this device.
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

      {isLoading ? (
        <p className="text-sm text-text-secondary">Loading preferences...</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {themeOptions.map(({ value, label, description, Icon }) => {
            const selected = theme === value;

            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                disabled={isSaving}
                onClick={() => void handleThemeChange(value)}
                className={`rounded-card border p-4 text-left transition ${
                  selected
                    ? "border-brand bg-brand-soft ring-2 ring-brand/20"
                    : "border-border bg-surface hover:bg-surface-muted"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Icon size={21} className="text-brand" />
                  {selected && <Check size={18} className="text-brand" />}
                </div>

                <p className="mt-3 text-sm font-semibold text-text-primary">
                  {label}
                </p>
                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  {description}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {isSaving && (
        <p role="status" className="text-xs text-text-secondary">
          Saving your preference...
        </p>
      )}
    </Card>
  );
}

export default Preferences;
