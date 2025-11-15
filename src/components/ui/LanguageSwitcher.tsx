'use client';

import { usePreferencesStore, type Language } from '@/lib/stores/preferences';
import { useTranslations } from '@/components/providers';

export function LanguageSwitcher() {
  const { language, setLanguage } = usePreferencesStore();
  const t = useTranslations();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: t.language.english, flag: '🇬🇧' },
    { code: 'fr', label: t.language.french, flag: '🇫🇷' },
  ];

  return (
    <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`
            p-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5
            ${
              language === lang.code
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
          aria-label={`Switch to ${lang.label}`}
          title={lang.label}
        >
          <span className="text-base leading-none">{lang.flag}</span>
        </button>
      ))}
    </div>
  );
}
