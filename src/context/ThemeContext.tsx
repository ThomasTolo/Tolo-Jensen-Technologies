import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type ThemePreference = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const themeKey = "tjt.theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return (window.localStorage.getItem(themeKey) as ThemePreference | null) ?? "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", theme === "dark" || (theme === "system" && systemDark));
    window.localStorage.setItem(themeKey, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeState
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
