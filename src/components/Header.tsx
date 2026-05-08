import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Code2 } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg group-hover:bg-white/30 transition-all duration-300">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
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
