import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { ar } from './translations/ar';
import { en } from './translations/en';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  lang: Language;
  dir: Direction;
  t: (key: keyof typeof en, ...args: any[]) => any;
  toggleLanguage: () => void;
}

const translations = { en, ar };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar'); // Default to Arabic

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang((prevLang) => (prevLang === 'en' ? 'ar' : 'en'));
  }, []);

  const t = useCallback((key: keyof typeof en) => {
    return translations[lang][key] || translations['en'][key];
  }, [lang]);
  
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
