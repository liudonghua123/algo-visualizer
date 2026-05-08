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
      className="relative p-2 rounded-lg transition-all duration-200 ease-in-out group"
      style={{
        backgroundColor: 'var(--color-bg-hover)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-border)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
      }}
      aria-label={currentLang === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <Globe 
        className="w-5 h-5 transition-colors duration-200" 
        style={{ color: 'var(--color-text)' }}
      />
      <div 
        className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 text-white text-xs font-bold rounded-full shadow-md"
        style={{ backgroundColor: 'var(--color-accent-primary)' }}
      >
        {currentLang === 'zh' ? 'EN' : '中'}
      </div>
    </button>
  );
}
