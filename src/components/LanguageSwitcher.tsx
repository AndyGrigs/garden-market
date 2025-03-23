import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex space-x-2">
      {['en', 'ro', 'ru'].map((lang) => (
        <button
          key={lang}
          onClick={() => i18n.changeLanguage(lang)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            i18n.language === lang
              ? 'bg-emerald-700 text-white'
              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}