import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { ActivePage } from '../App';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

const NavLink: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 text-sm md:text-base font-semibold rounded-md transition-colors duration-300 relative ${
      isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
    }`}
  >
    {label}
    {isActive && (
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-brand-primary rounded-full"></span>
    )}
  </button>
);


export const Header: React.FC<HeaderProps> = ({ activePage, setActivePage }) => {
  const { t, toggleLanguage, lang } = useTranslation();

  return (
    <header className="bg-base-200 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-teal-400">
          {t('appName')}
        </h1>
        
        <nav className="flex-grow flex justify-center items-center space-x-2 md:space-x-4">
            <NavLink 
                label={t('navHome')}
                isActive={activePage === 'home'}
                onClick={() => setActivePage('home')}
            />
            <NavLink 
                label={t('navStudio')}
                isActive={activePage === 'studio'}
                onClick={() => setActivePage('studio')}
            />
            <NavLink 
                label={t('navAbout')}
                isActive={activePage === 'about'}
                onClick={() => setActivePage('about')}
            />
        </nav>

        <button
          onClick={toggleLanguage}
          className="px-3 py-1.5 bg-base-300 text-sm font-semibold rounded-md hover:bg-base-100 transition-colors"
        >
          {lang === 'en' ? 'العربية' : 'English'}
        </button>
      </div>
    </header>
  );
};
