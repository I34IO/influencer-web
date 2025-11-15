import { translations, type Language } from './translations';

export function getTranslations(lang: Language) {
  return translations[lang] || translations.en;
}

export function getNestedTranslation(
  obj: any,
  path: string
): string {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || path;
}

export * from './translations';
