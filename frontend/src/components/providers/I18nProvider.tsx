'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize i18n with client-side language preference
    const initializeI18n = async () => {
      if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem('language') || 'en';
        await i18n.changeLanguage(savedLanguage);
      }
      setIsInitialized(true);
    };

    initializeI18n();
  }, []);

  // Prevent hydration mismatch by not rendering until i18n is initialized
  if (!isInitialized) {
    return <>{children}</>;
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
