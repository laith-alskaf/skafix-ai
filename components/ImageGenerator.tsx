import React, { useState, useCallback } from 'react';
import { generateImage, enhancePrompt } from '../services/geminiService';
import { Spinner } from './Spinner';
import { ImagePreview } from './ImagePreview';
import { PromptInput } from './PromptInput';
import { useTranslation } from '../i18n/LanguageContext';

const DEFAULT_PROMPT_EN = "Digital painting of a man in a noir style, black and white, dramatic lighting, mysterious and classic.";
const DEFAULT_PROMPT_AR = "لوحة رقمية لرجل بأسلوب النوير، أبيض وأسود، إضاءة درامية، غامض وكلاسيكي.";
const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"];

interface AspectRatioButtonProps {
    ratio: string;
    isActive: boolean;
    onClick: (ratio: string) => void;
}

const AspectRatioButton: React.FC<AspectRatioButtonProps> = ({ ratio, isActive, onClick }) => (
    <button
        onClick={() => onClick(ratio)}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-primary ${
            isActive
                ? 'bg-brand-primary text-white'
                : 'bg-base-200 text-text-secondary hover:bg-base-300'
        }`}
    >
        {ratio}
    </button>
);


export const ImageGenerator: React.FC = () => {
  const { t, lang } = useTranslation();
  const [prompt, setPrompt] = useState<string>(lang === 'ar' ? DEFAULT_PROMPT_AR : DEFAULT_PROMPT_EN);
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage(prompt, aspectRatio);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      setError(err.message || t('errorUnknown'));
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio, isLoading, t]);

  const handleEnhancePrompt = useCallback(async () => {
    if (!prompt.trim() || isEnhancing) return;
    
    setIsEnhancing(true);
    setError(null);
    try {
        const enhanced = await enhancePrompt(prompt);
        setPrompt(enhanced);
    } catch (err: any) {
        setError(err.message || t('errorEnhancePrompt'));
    } finally {
        setIsEnhancing(false);
    }
  }, [prompt, isEnhancing, t]);

  return (
    <div className="space-y-6">
       <div className="space-y-3">
            <label className="block font-semibold text-text-secondary">{t('aspectRatio')}</label>
            <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map(ratio => (
                    <AspectRatioButton 
                        key={ratio}
                        ratio={ratio}
                        isActive={aspectRatio === ratio}
                        onClick={setAspectRatio}
                    />
                ))}
            </div>
       </div>

      <div className="space-y-3">
        <label className="block font-semibold text-text-secondary">{t('promptLabel')}</label>
        <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            placeholder={t('generatePromptPlaceholder')}
            disabled={isLoading || isEnhancing}
        />
        <button
            onClick={handleEnhancePrompt}
            disabled={isEnhancing || isLoading || !prompt.trim()}
            className="w-full sm:w-auto px-4 py-2 bg-base-300 text-text-primary font-semibold rounded-lg shadow-sm hover:bg-base-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
            {isEnhancing ? <Spinner /> : <span>{t('enhancePromptButton')} <span className="text-brand-secondary">✨</span></span>}
        </button>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || isEnhancing || !prompt.trim()}
        className="w-full bg-gradient-to-r from-brand-primary to-teal-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? <Spinner /> : t('generateButton')}
      </button>

      {error && (
        <div className="bg-red-900/50 text-red-200 p-4 rounded-lg border border-red-700 text-right">
          <p className="font-semibold">{t('errorTitle')}:</p>
          <p>{error}</p>
        </div>
      )}

      <ImagePreview
        imageUrl={generatedImage}
        isLoading={isLoading}
        altText={t('generatedImageAlt')}
        placeholderText={t('generatedImagePlaceholder')}
      />
    </div>
  );
};