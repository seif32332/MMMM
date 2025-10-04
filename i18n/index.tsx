
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { en } from './en';
import { ar } from './ar';
import { TranslationKey } from '../types';

type Locale = 'en' | 'ar';
type Translations = typeof en;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations = { en, ar };

// Function to safely get the initial locale from localStorage
const getInitialLocale = (): Locale => {
  try {
    const storedLocale = localStorage.getItem('majlis-pro-locale');
    if (storedLocale === 'en' || storedLocale === 'ar') {
      return storedLocale;
    }
  } catch (error) {
    console.error("Could not read locale from localStorage", error);
  }
  return 'ar'; // Default to Arabic as per prompt
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.body.className = locale === 'ar' ? 'font-cairo' : 'font-sans';
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('majlis-pro-locale', newLocale);
    } catch (error) {
      console.error("Could not save locale to localStorage", error);
    }
  }, []);

  const t = useCallback((key: TranslationKey, replacements?: Record<string, string | number>): string => {
    let translation = translations[locale][key] || translations['en'][key] || String(key);

    if (replacements) {
      Object.keys(replacements).forEach((rKey) => {
        const regex = new RegExp(`\\{${rKey}\\}`, 'g');
        translation = translation.replace(regex, String(replacements[rKey]));
      });
    }

    return translation;
  }, [locale]);


  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};