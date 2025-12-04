import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend) // Lazy load translations
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    supportedLngs: ['ro', 'ru', 'en'],
    debug: false, // Disable debug in production

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // Cache translations for better performance
      requestOptions: {
        cache: 'default',
      },
    },

    react: {
      useSuspense: true, // Use Suspense for loading translations
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added',
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    // Preload fallback language
    preload: ['ru'],

    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],

    // Detection options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;