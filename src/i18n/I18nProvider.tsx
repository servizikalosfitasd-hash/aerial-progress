import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dict, type Lang } from "./dictionary";

const STORAGE_KEY = "calis-track-lang";

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (typeof dict)[Lang];
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const detect = (): Lang => {
  if (typeof window === "undefined") return "it";
  const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (stored && stored in dict) return stored;
  const nav = navigator.language?.slice(0, 2).toLowerCase();
  if (nav === "en") return "en";
  if (nav === "es") return "es";
  return "it";
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>("it");

  useEffect(() => {
    setLangState(detect());
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<I18nContextValue>(() => ({ lang, setLang, t: dict[lang] }), [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
