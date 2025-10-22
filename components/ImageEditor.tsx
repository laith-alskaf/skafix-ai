import React, { useState, useCallback, useRef } from 'react';
import { editImage, enhancePrompt } from '../services/geminiService';
import { Spinner } from './Spinner';
import { ImagePreview } from './ImagePreview';
import { PromptInput } from './PromptInput';
import { useTranslation } from '../i18n/LanguageContext';

interface OriginalImage {
  dataUrl: string;
  mimeType: string;
}

const FileUploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);


export const ImageEditor: React.FC = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState<string>(t('editDefaultPrompt'));
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage({
          dataUrl: e.target?.result as string,
          mimeType: file.type,
        });
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = useCallback(async () => {
    if (!prompt.trim() || !originalImage || isLoading || isEnhancing) return;

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const base64Data = originalImage.dataUrl.split(',')[1];
      const imageUrl = await editImage(base64Data, originalImage.mimeType, prompt);
      setEditedImage(imageUrl);
    } catch (err: any) {
      setError(err.message || t('errorUnknown'));
    } finally {
      setIsLoading(false);
    }
  }, [prompt, originalImage, isLoading, isEnhancing, t]);
  
  const handleEnhancePrompt = useCallback(async () => {
    if (!prompt.trim() || isEnhancing || isLoading || !originalImage) return;
    
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
  }, [prompt, isEnhancing, isLoading, originalImage, t]);


  const triggerFileInput = () => {
    if (isLoading || isEnhancing) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-secondary">{t('uploadTitle')}</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
          disabled={isLoading || isEnhancing}
        />
        <div 
            onClick={triggerFileInput} 
            className={`border-2 border-dashed border-base-300 rounded-lg p-4 h-64 flex flex-col items-center justify-center text-center transition-colors ${(isLoading || isEnhancing) ? 'bg-base-300/50 cursor-not-allowed' : 'cursor-pointer hover:border-brand-primary/50 hover:bg-base-200'}`}
        >
          {originalImage ? (
            <img src={originalImage.dataUrl} alt={t('originalImageAlt')} className="max-h-full max-w-full object-contain rounded-md" />
          ) : (
            <>
              <FileUploadIcon />
              <p className="mt-2 text-text-secondary">{t('uploadPlaceholder')}</p>
            </>
          )}
        </div>

        <h2 className="text-xl font-semibold text-text-secondary pt-4">{t('describeEditTitle')}</h2>
        <div className="space-y-3">
            <PromptInput
                prompt={prompt}
                setPrompt={setPrompt}
                placeholder={t('editPromptPlaceholder')}
                disabled={isLoading || isEnhancing || !originalImage}
            />
             <button
                onClick={handleEnhancePrompt}
                disabled={isEnhancing || isLoading || !originalImage || !prompt.trim()}
                className="w-full sm:w-auto px-4 py-2 bg-base-300 text-text-primary font-semibold rounded-lg shadow-sm hover:bg-base-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isEnhancing ? <Spinner /> : <span>{t('enhancePromptButton')} <span className="text-brand-secondary">✨</span></span>}
            </button>
        </div>
        
        <button
          onClick={handleEdit}
          disabled={isLoading || isEnhancing || !prompt.trim() || !originalImage}
          className="w-full bg-gradient-to-r from-brand-primary to-teal-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Spinner /> : t('editButton')}
        </button>

        {error && (
            <div className="bg-red-900/50 text-red-200 p-4 rounded-lg border border-red-700 text-right">
                <p className="font-semibold">{t('errorTitle')}:</p>
                <p>{error}</p>
            </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-secondary">{t('resultTitle')}</h2>
        <ImagePreview
          imageUrl={editedImage}
          isLoading={isLoading}
          altText={t('editedImageAlt')}
          placeholderText={t('editedImagePlaceholder')}
        />
      </div>
    </div>
  );
};