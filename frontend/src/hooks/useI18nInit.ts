'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useI18nInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Wait for i18n to be ready
        const waitForI18n = () => {
          return new Promise<void>((resolve) => {
            if (i18n.isInitialized && typeof i18n.changeLanguage === 'function') {
              resolve();
            } else {
              const onInitialized = () => {
                i18n.off('initialized', onInitialized);
                resolve();
              };
              i18n.on('initialized', onInitialized);
            }
          });
        };

        await waitForI18n();

        if (typeof window !== 'undefined') {
          const savedLanguage = localStorage.getItem('language');
          if (savedLanguage && savedLanguage !== i18n.language) {
            await i18n.changeLanguage(savedLanguage);
          }
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing i18n:', error);
        setIsInitialized(true); // Continue even if there's an error
      }
    };

    initializeLanguage();
  }, [i18n]);

  return isInitialized;
}
