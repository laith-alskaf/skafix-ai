import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

const InfoCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-base-200 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-teal-400">{title}</h2>
        {children}
    </div>
);

const WhatsAppIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
);

const TelegramIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.17.91-.494 1.208-.822 1.23-.696.047-1.226-.46-1.89- .902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.04-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.287-.788.058-.383.38-.744.961-1.077 4.76-2.614 7.636-4.226 8.568-4.66.932-.434 1.766-.643 2.495-.643Z"/>
    </svg>
);

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
    </svg>
);


export const AboutPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <main className="container mx-auto px-4 py-12 flex-grow">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
                
                <div className="md:col-span-3 space-y-8">
                    <InfoCard title={t('aboutTitle')}>
                        <p className="text-text-secondary leading-relaxed">{t('aboutText')}</p>
                    </InfoCard>

                    <InfoCard title={t('contactTitle')}>
                        <p className="text-text-secondary mb-6">{t('contactText')}</p>
                        <div className="flex items-center justify-center gap-6">
                            <a 
                                href="https://wa.me/+963982055788" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Contact on WhatsApp"
                                className="p-4 bg-base-100 rounded-full text-text-secondary hover:text-brand-primary hover:bg-base-300 transition-all duration-300"
                            >
                                <WhatsAppIcon />
                            </a>
                            <a 
                                href="https://t.me/laithAlskaf" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="Contact on Telegram"
                                className="p-4 bg-base-100 rounded-full text-text-secondary hover:text-brand-primary hover:bg-base-300 transition-all duration-300"
                            >
                                <TelegramIcon />
                            </a>
                            <a 
                                href="mailto:laithalskaf@gmail.com" 
                                aria-label="Send an Email"
                                className="p-4 bg-base-100 rounded-full text-text-secondary hover:text-brand-primary hover:bg-base-300 transition-all duration-300"
                            >
                                <EmailIcon />
                            </a>
                        </div>
                    </InfoCard>
                </div>
                
                <div className="md:col-span-2">
                    <div className="bg-base-200 p-4 rounded-xl shadow-lg sticky top-24">
                        <img 
                            src="/profile.png"
                            alt="Eng. Laith Al-Sakkaf"
                            className="rounded-lg w-full h-auto object-cover"
                        />
                        <div className="mt-4 text-center">
                            <h3 className="text-xl font-bold text-text-primary">المهندس ليث السكاف</h3>
                            <a href="mailto:laithalskaf@gmail.com" className="text-sm text-brand-primary hover:underline">
                                laithalskaf@gmail.com
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
};