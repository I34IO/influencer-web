'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePreferencesStore } from '@/lib/stores/preferences';
import { getTranslations, type Translations } from '@/lib/i18n';

const I18nContext = createContext<Translations | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const language = usePreferencesStore((state) => state.language);
  const t = getTranslations(language);

  return <I18nContext.Provider value={t}>{children}</I18nContext.Provider>;
}

export function useTranslations() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslations must be used within I18nProvider');
  }
  return context;
}
