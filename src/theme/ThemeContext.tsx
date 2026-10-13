import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

export type ThemeColors = {
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  danger: string;
  dangerSoft: string;
};

export const appTheme: Record<"light" | "dark", ThemeColors> = {
  light: {
    background: "#FFFFFF",
    backgroundAlt: "#f4f4f5",
    surface: "#FFFFFF",
    surfaceAlt: "#e4e4e7",
    border: "#DADADA",
    text: "#000000",
    textMuted: "#71717a",
    accent: "#005C6E",
    accentSoft: "#67e8f9",
    danger: "#FF1717",
    dangerSoft: "#fef2f2",
  },
  dark: {
    background: "#0f172a",
    backgroundAlt: "#111827",
    surface: "#1f2937",
    surfaceAlt: "#374151",
    border: "#475569",
    text: "#f8fafc",
    textMuted: "#cbd5e1",
    accent: "#06b6d4",
    accentSoft: "#0f172a",
    danger: "#fca5a5",
    dangerSoft: "#3f0d0d",
  },
};

type ThemeContextValue = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [darkMode, setDarkModeState] = useState(systemScheme === "dark");

  useEffect(() => {
    if (systemScheme) {
      setDarkModeState(systemScheme === "dark");
    }
  }, [systemScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      darkMode,
      setDarkMode: setDarkModeState,
      toggleDarkMode: () => setDarkModeState((prev) => !prev),
      colors: darkMode ? appTheme.dark : appTheme.light,
    }),
    [darkMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }

  return context;
}
