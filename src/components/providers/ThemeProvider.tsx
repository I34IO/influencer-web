'use client';

import { useEffect } from 'react';
import { usePreferencesStore, getEffectiveTheme } from '@/lib/stores/preferences';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = usePreferencesStore((state) => state.theme);

  useEffect(() => {
    // Hydrate the store on mount
    usePreferencesStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const effectiveTheme = getEffectiveTheme(theme);
    const root = document.documentElement;

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Listen for system theme changes when theme is set to 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return <>{children}</>;
}
