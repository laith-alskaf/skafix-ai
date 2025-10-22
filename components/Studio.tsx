import React, { useState } from 'react';
import { TabButton } from './TabButton';
import { ImageGenerator } from './ImageGenerator';
import { ImageEditor } from './ImageEditor';
import { AdOptimizer } from './AdOptimizer';
import { useTranslation } from '../i18n/LanguageContext';

type ActiveService = 'images' | 'ads';
type ActiveImageTab = 'generate' | 'edit';

export const Studio: React.FC = () => {
  const { t } = useTranslation();
  const [activeService, setActiveService] = useState<ActiveService>('images');
  const [activeImageTab, setActiveImageTab] = useState<ActiveImageTab>('generate');

  return (
    <main className="container mx-auto px-4 py-8 flex-grow">
      <div className="max-w-4xl mx-auto">
        {/* Main Service Tabs */}
        <div className="flex justify-center space-x-2 md:space-x-4 rtl:space-x-reverse bg-base-200 p-2 rounded-xl shadow-md mb-8">
          <TabButton 
            label={t('imageServicesTab')} 
            isActive={activeService === 'images'} 
            onClick={() => setActiveService('images')} 
          />
          <TabButton 
            label={t('optimizerTab')} 
            isActive={activeService === 'ads'} 
            onClick={() => setActiveService('ads')} 
          />
        </div>

        {activeService === 'images' && (
          <div className="animate-fade-in">
            {/* Sub-tabs for Image Services */}
            <div className="flex justify-center space-x-2 md:space-x-4 rtl:space-x-reverse bg-base-300/50 p-2 rounded-xl mb-8 max-w-sm mx-auto">
              <TabButton 
                label={t('generateTab')} 
                isActive={activeImageTab === 'generate'} 
                onClick={() => setActiveImageTab('generate')} 
              />
              <TabButton 
                label={t('editTab')} 
                isActive={activeImageTab === 'edit'} 
                onClick={() => setActiveImageTab('edit')} 
              />
            </div>
            {activeImageTab === 'generate' && <ImageGenerator />}
            {activeImageTab === 'edit' && <ImageEditor />}
          </div>
        )}

        {activeService === 'ads' && (
            <div className="animate-fade-in">
                <AdOptimizer />
            </div>
        )}
      </div>
    </main>
  );
};
