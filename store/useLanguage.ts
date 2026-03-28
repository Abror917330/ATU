import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Lang = 'KG' | 'UZ' | 'RU';

interface LanguageStore {
  lang: Lang;
  setLang: (newLang: Lang) => void;
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      lang: 'UZ', // Standart til
      setLang: (newLang) => set({ lang: newLang }),
    }),
    { name: 'atu-language' }
  )
);
