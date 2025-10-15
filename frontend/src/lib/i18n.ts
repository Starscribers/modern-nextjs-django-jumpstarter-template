import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const initI18n = () => {
  return i18next
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng: 'en', // Default language
      fallbackLng: 'en', // Fallback language
      debug: process.env.NODE_ENV === 'development',

      interpolation: {
        escapeValue: false, // React already does escaping
      },

      backend: {
        // for all available options read the backend's repository readme file
        loadPath: '/i18n/locales/{{lng}}.json'
      },

      react: {
        useSuspense: false, // Avoid suspense issues in Next.js
      }
    });
};

// Initialize only once
if (!i18next.isInitialized) {
  initI18n();
}

export default i18next;
