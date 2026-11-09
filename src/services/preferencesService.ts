import api from "./api";
import { fetchCurrentUser } from "./transactionsService";
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
    // Share the same cached/in-flight /users/me request used by the app header.
    return (await fetchCurrentUser()) as UserPreferences;
}

export async function updateThemePreference(
    theme: ThemePreference,
): Promise<UserPreferences> {
    const response = await api.patch<UserPreferences>("/users/me", { theme });
    return response.data;
}


export async function updateUsername(
    username: string,
): Promise<UserPreferences> {
    const response = await api.patch<UserPreferences>("/users/me", {
        username: username.trim(),
    });
    return response.data;
}