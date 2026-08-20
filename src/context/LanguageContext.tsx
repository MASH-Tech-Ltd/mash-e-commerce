'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Language, translations, TranslationKeys } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  initialLanguage = 'en' 
}: { 
  children: ReactNode; 
  initialLanguage?: string;
}) {
  const language = (initialLanguage === 'bn' ? 'bn' : 'en') as Language;

  const t = (key: TranslationKeys): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
