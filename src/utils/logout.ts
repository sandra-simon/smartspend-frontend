
import { applyTheme, type ThemePreference } from "./theme";

export function logout() {
  const currentTheme =
    document.documentElement.dataset.themePreference;

  if (
    currentTheme === "light" ||
    currentTheme === "dark" ||
    currentTheme === "system"
  ) {
    localStorage.setItem("theme_preference", currentTheme);
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  // Keep the selected theme while returning to the login page.
  applyTheme(
    (localStorage.getItem("theme_preference") as ThemePreference) ||
      "light",
  );

  window.location.href = "/login";
}
