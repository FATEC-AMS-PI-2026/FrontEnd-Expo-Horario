import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserProfile = "aluno" | "professor";

const USER_PROFILE_KEY = "gini:perfilUsuario";

export function isUserProfile(value: unknown): value is UserProfile {
    return value === "aluno" || value === "professor";
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(USER_PROFILE_KEY, profile);
}

export async function loadUserProfile(): Promise<UserProfile | null> {
    const profile = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return isUserProfile(profile) ? profile : null;
}

export async function clearUserProfile(): Promise<void> {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
}
