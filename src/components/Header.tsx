import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Code2, Sun, Moon, Globe } from 'lucide-react';
import { useThemeContext } from '@/contexts/ThemeContext';
import './Header.css';

export default function Header() {
  const { t } = useTranslation();
  const { isDark, toggleTheme } = useThemeContext();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <div className="logo-icon">
            <Code2 size={24} />
          </div>
          <h1 className="logo-text">{t('common.title')}</h1>
        </Link>

        <div className="header-actions">
          <div className="toggle-group">
            <button
              className="toggle-btn lang-toggle"
              onClick={toggleLanguage}
              aria-label={currentLang === 'zh' ? 'Switch to English' : '切换到中文'}
            >
              <Globe size={18} className="toggle-icon" />
              <span className="toggle-label">{currentLang === 'zh' ? 'EN' : '中'}</span>
            </button>

            <button
              className="toggle-btn theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : '切换到暗色主题'}
            >
              <div className="theme-switch">
                <div className={`theme-icons ${isDark ? 'dark' : 'light'}`}>
                  <Sun size={16} className="sun-icon" />
                  <Moon size={16} className="moon-icon" />
                </div>
                <div className="toggle-knob"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
