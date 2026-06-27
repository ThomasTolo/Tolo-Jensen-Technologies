import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type Language = "en" | "no";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const languageKey = "tjt.language";

function defaultLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = window.localStorage.getItem(languageKey);

  if (stored === "en" || stored === "no") {
    return stored;
  }

  const languages = navigator.languages.length ? navigator.languages : [navigator.language];
  const norwegianLanguage = languages.some((language) => /^(nb|nn|no)(-|$)/i.test(language));
  const norwegianTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone === "Europe/Oslo";

  return norwegianLanguage || norwegianTimezone ? "no" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  const value = useMemo(
    () => ({
      language,
      setLanguage: (nextLanguage: Language) => {
        window.localStorage.setItem(languageKey, nextLanguage);
        setLanguageState(nextLanguage);
      },
      toggleLanguage: () => {
        const nextLanguage = language === "no" ? "en" : "no";
        window.localStorage.setItem(languageKey, nextLanguage);
        setLanguageState(nextLanguage);
      }
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
