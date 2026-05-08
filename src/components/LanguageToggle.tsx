import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative p-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200 ease-in-out group"
      aria-label={currentLang === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <Globe className="w-5 h-5 text-slate-700 dark:text-slate-200 transition-colors duration-200" />
      <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 bg-blue-500 text-white text-xs font-bold rounded-full shadow-md">
        {currentLang === 'zh' ? 'EN' : '中'}
      </div>
    </button>
  );
}
