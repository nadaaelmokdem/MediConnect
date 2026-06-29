import { createContext, useState, useContext } from "react";

import type {
  LangContextType,
  LangProviderProps,
  Lang,
} from "../types/context";

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LangProvider = ({ children }: LangProviderProps) => {
  const [lang, setLang] = useState<Lang>(() => {
    // Check if we are in a browser environment to avoid SSR errors
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lang");
      return saved === "ar" || saved === "en" ? saved : "en";
    }
    return "en";
  });

  const toggleLang = () => {
    const nextLang = lang === "en" ? "ar" : "en";
    localStorage.setItem("lang", nextLang);
    setLang(nextLang);
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = (): LangContextType => {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error("useLang must be used within a LangProvider");
  }
  return context;
};
