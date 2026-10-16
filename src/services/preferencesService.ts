import api from "./api";
import type { ThemePreference } from "../utils/theme";
export type { ThemePreference } from "../utils/theme";

export interface UserPreferences {
    user_id: number;
    username: string;
    email: string;
    joined_at: string;
    theme: ThemePreference;
}

export async function fetchUserPreferences(): Promise<UserPreferences> {
    const response = await api.get<UserPreferences>("/users/me");
    return response.data;
}

export async function updateThemePreference(
    theme: ThemePreference,
): Promise<UserPreferences> {
    const response = await api.patch<UserPreferences>("/users/me", { theme });
    return response.data;
}