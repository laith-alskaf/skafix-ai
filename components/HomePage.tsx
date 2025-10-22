import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { ActivePage } from '../App';

interface HomePageProps {
    setActivePage: (page: ActivePage) => void;
}

const ServiceCard: React.FC<{icon: string, title: string, description: string}> = ({ icon, title, description }) => (
    <div className="bg-base-200 p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
        <div className="text-5xl mb-4 text-brand-primary">{icon}</div>
        <h3 className="text-2xl font-bold mb-3 text-text-primary">{title}</h3>
        <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
);


export const HomePage: React.FC<HomePageProps> = ({ setActivePage }) => {
    const { t } = useTranslation();

    return (
        <main className="flex-grow">
            {/* Hero Section */}
            <section className="text-center py-20 md:py-32 bg-base-100">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-teal-300 mb-4 animate-fade-in-down">
                        {t('homeHeroTitle')}
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-text-secondary mb-8 animate-fade-in-up">
                        {t('homeHeroSubtitle')}
                    </p>
                    <button
                        onClick={() => setActivePage('studio')}
                        className="bg-gradient-to-r from-brand-primary to-teal-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg hover:scale-105 transform transition-transform duration-300"
                    >
                        {t('homeCTA')}
                    </button>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-text-primary">
                        {t('homeServicesTitle')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                       <ServiceCard 
                            icon="🎨"
                            title={t('imageServiceTitle')}
                            description={t('imageServiceDesc')}
                       />
                       <ServiceCard 
                            icon="🚀"
                            title={t('adServiceTitle')}
                            description={t('adServiceDesc')}
                       />
                    </div>
                </div>
            </section>
        </main>
    );
};
