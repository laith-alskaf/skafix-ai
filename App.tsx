import React, { useState } from 'react';
import { Header } from './components/Header';
import { Studio } from './components/Studio';
import { AboutPage } from './components/AboutPage';
import { useTranslation } from './i18n/LanguageContext';
import { HomePage } from './components/HomePage';

export type ActivePage = 'home' | 'studio' | 'about';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const { t, dir } = useTranslation();

  return (
    <div className="min-h-screen bg-base-100 font-sans flex flex-col" dir={dir}>
      <Header activePage={activePage} setActivePage={setActivePage} />
      
      {activePage === 'home' && <HomePage setActivePage={setActivePage} />}
      {activePage === 'studio' && <Studio />}
      {activePage === 'about' && <AboutPage />}

      <footer className="py-4 text-center text-sm text-text-secondary">
        <p>{t('footer')}</p>
      </footer>
    </div>
  );
};

export default App;
