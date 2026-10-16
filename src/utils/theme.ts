export type ThemePreference = "light" | "dark" | "system";

export function applyTheme(theme: ThemePreference): void {
    const resolvedTheme =
        theme === "system"
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
            : theme;

    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.themePreference = theme;
}

export function initializeTheme(): void {
  const savedTheme = localStorage.getItem("theme_preference");

  const theme: ThemePreference =
    savedTheme === "light" ||
    savedTheme === "dark" ||
    savedTheme === "system"
      ? savedTheme
      : "light";

  applyTheme(theme);
}