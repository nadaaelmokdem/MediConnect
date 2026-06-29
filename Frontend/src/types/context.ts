import type { ReactNode } from "react";

export type Lang = "en" | "ar";

export interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
}

export interface LangProviderProps {
  children: ReactNode;
}
