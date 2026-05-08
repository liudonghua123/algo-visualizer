import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Code2 } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header 
      className="shadow-lg"
      style={{ 
        background: 'linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%)',
        borderBottom: '1px solid var(--color-border)'
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div 
              className="p-2 rounded-lg transition-all duration-300"
              style={{ 
                background: 'rgba(99, 102, 241, 0.2)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <Code2 
                className="w-6 h-6" 
                style={{ color: 'var(--color-text)' }}
              />
            </div>
            <h1 
              className="text-xl md:text-2xl font-bold tracking-tight"
              style={{ 
                color: 'var(--color-text)',
                background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {t('common.title')}
            </h1>
          </Link>

          <div className="flex items-center space-x-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
