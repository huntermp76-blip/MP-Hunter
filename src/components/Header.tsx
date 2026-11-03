import React from 'react';
import { Sparkles, DollarSign, Globe, Moon, Sun } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface HeaderProps {
  lang: Language;
  onLangChange: (l: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAdSettings: () => void;
  onScrollToSection: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLangChange,
  darkMode,
  onToggleDarkMode,
  onOpenAdSettings,
  onScrollToSection,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <span className="font-bold text-lg leading-none">IT</span>
          </div>
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Indore Tools
          </a>
        </div>

        {/* Zone 2: Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onScrollToSection('compressor-card')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {lang === 'hinglish' ? 'Compressor' : lang === 'hindi' ? 'कंप्रेसर' : 'Compressor'}
          </button>
          <button
            onClick={() => onScrollToSection('comparison-view')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {lang === 'hinglish' ? 'Before vs After' : lang === 'hindi' ? 'गुणवत्ता जाँच' : 'Quality Inspector'}
          </button>
          <button
            onClick={() => onScrollToSection('exam-guide-section')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {lang === 'hinglish' ? 'Exam Guide' : lang === 'hindi' ? 'परीक्षा निर्देश' : 'Exam Presets'}
          </button>
          <button
            onClick={() => onScrollToSection('privacy-guarantee')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {lang === 'hinglish' ? '100% Privacy' : lang === 'hindi' ? 'सुरक्षा' : 'Privacy'}
          </button>
        </nav>

        {/* Zone 3: 1 primary action zone with controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Switcher */}
          <div className="relative inline-flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200/60 dark:border-slate-700/60 text-xs">
            <button
              onClick={() => onLangChange('hinglish')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                lang === 'hinglish'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Hinglish"
            >
              Hinglish
            </button>
            <button
              onClick={() => onLangChange('hindi')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                lang === 'hindi'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="हिन्दी"
            >
              हिन्दी
            </button>
            <button
              onClick={() => onLangChange('english')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                lang === 'english'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* AdSense Placement / Monetization Modal Opener */}
          <button
            onClick={onOpenAdSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Google AdSense slots & monetization configuration"
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">{t.adSettings}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
