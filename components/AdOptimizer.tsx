import React, { useState, useCallback, useRef } from 'react';
import { optimizeAd, AdOptimizationResult } from '../services/geminiService';
import { Spinner } from './Spinner';
import { PromptInput } from './PromptInput';
import { useTranslation } from '../i18n/LanguageContext';
import { ImagePreview } from './ImagePreview';

const FileUploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
)

type OriginalImage = {
    dataUrl: string;
    base64Data: string;
    mimeType: string;
};

const AdOptimizer: React.FC = () => {
    const { t } = useTranslation();

    const PLATFORMS = t('platforms');
    const TONES = t('tones');

    const [originalAd, setOriginalAd] = useState<string>('');
    const [targetAudience, setTargetAudience] = useState<string>('');
    const [platform, setPlatform] = useState<string>(PLATFORMS[0]);
    const [tone, setTone] = useState<string>(TONES[0]);
    const [originalImages, setOriginalImages] = useState<OriginalImage[]>([]);

    const [result, setResult] = useState<AdOptimizationResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState<string>('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isFormIncomplete = (!originalAd.trim() && originalImages.length === 0) || !targetAudience.trim();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        const imagePromises = files.map(file => {
            return new Promise<OriginalImage>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => {
                    const dataUrl = e.target?.result as string;
                    if (dataUrl) {
                        resolve({
                            dataUrl,
                            base64Data: dataUrl.split(',')[1],
                            mimeType: file.type
                        });
                    } else {
                        reject(new Error("Failed to read file"));
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });
        
        Promise.all(imagePromises).then(newImages => {
            setOriginalImages(prev => [...prev, ...newImages]);
        }).catch(err => {
            console.error(err);
            setError(t('errorUnknown'));
        });

        // Reset file input to allow re-uploading the same file
        event.target.value = '';
    };

    const triggerFileInput = () => {
        if (isLoading) return;
        fileInputRef.current?.click();
    };


    const handleOptimize = useCallback(async () => {
        if (isFormIncomplete || isLoading) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const optimizationResult = await optimizeAd(
                originalAd.trim() ? originalAd : null, 
                targetAudience, 
                platform, 
                tone, 
                originalImages.length > 0 ? originalImages.map(img => ({ base64Data: img.base64Data, mimeType: img.mimeType })) : null
            );
            setResult(optimizationResult);
        } catch (err: any) {
            setError(err.message || t('errorUnknown'));
        } finally {
            setIsLoading(false);
        }
    }, [originalAd, targetAudience, platform, tone, originalImages, isLoading, isFormIncomplete, t]);
    
    const handleCopy = () => {
        if (result?.optimizedAd) {
            navigator.clipboard.writeText(result.optimizedAd);
            setCopySuccess(t('copySuccess'));
            setTimeout(() => setCopySuccess(''), 2000);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">{t('optimizerTitle')}</h2>
                <p className="text-text-secondary">{t('optimizerDescription')}</p>
            </div>

            <div className="p-6 bg-base-200 rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="originalAd" className="block font-semibold text-text-secondary mb-2">{t('adContentLabel')}</label>
                            <PromptInput
                                prompt={originalAd}
                                setPrompt={setOriginalAd}
                                placeholder={t('adContentPlaceholder')}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold text-text-secondary mb-2">{t('adImageLabel')}</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            ref={fileInputRef}
                            disabled={isLoading}
                            multiple
                        />
                        <div 
                            onClick={triggerFileInput} 
                            className={`border-2 border-dashed border-base-300 rounded-lg p-4 h-full min-h-[170px] flex flex-col items-center justify-center text-center transition-colors ${isLoading ? 'bg-base-300/50 cursor-not-allowed' : 'cursor-pointer hover:border-brand-primary/50 hover:bg-base-100'}`}
                        >
                        {originalImages.length === 0 ? (
                            <>
                                <FileUploadIcon />
                                <p className="mt-2 text-text-secondary text-sm">{t('uploadPlaceholderMulti')}</p>
                            </>
                        ) : (
                            <div className="flex flex-wrap justify-center gap-2">
                                {originalImages.map((image, index) => (
                                    <div key={index} className="relative h-20 w-20">
                                        <img src={image.dataUrl} alt={`${t('originalImageAlt')} ${index + 1}`} className="h-full w-full object-cover rounded-md" />
                                    </div>
                                ))}
                            </div>
                        )}
                        </div>
                        {originalImages.length > 0 && (
                            <button onClick={() => setOriginalImages([])} className="text-sm text-brand-secondary hover:underline mt-2">
                                {t('clearImagesButton')}
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="targetAudience" className="block font-semibold text-text-secondary mb-2">{t('audienceLabel')}</label>
                    <input
                        id="targetAudience"
                        type="text"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder={t('audiencePlaceholder')}
                        disabled={isLoading}
                        className="w-full p-3 bg-base-100 border-2 border-base-300 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors disabled:opacity-50"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="platform" className="block font-semibold text-text-secondary mb-2">{t('platformLabel')}</label>
                        <select
                            id="platform"
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            disabled={isLoading}
                            className="w-full p-3 bg-base-100 border-2 border-base-300 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors disabled:opacity-50"
                        >
                            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="tone" className="block font-semibold text-text-secondary mb-2">{t('toneLabel')}</label>
                        <select
                            id="tone"
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            disabled={isLoading}
                            className="w-full p-3 bg-base-100 border-2 border-base-300 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors disabled:opacity-50"
                        >
                            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
            </div>

             <button
                onClick={handleOptimize}
                disabled={isLoading || isFormIncomplete}
                className="w-full bg-gradient-to-r from-brand-primary to-teal-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? <Spinner /> : t('optimizeButton')}
            </button>

            {error && (
                <div className="bg-red-900/50 text-red-200 p-4 rounded-lg border border-red-700 text-right">
                    <p className="font-semibold">{t('errorTitle')}:</p>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 bg-base-200 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">{t('optimizedAdTitle')}</h3>
                                <div className="relative">
                                    <button onClick={handleCopy} className="px-3 py-1 bg-base-300 text-sm rounded hover:bg-base-100 transition-colors">{t('copyButton')}</button>
                                    {copySuccess && <div className="absolute bottom-full mb-2 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">{copySuccess}</div>}
                                </div>
                            </div>
                            <p className="text-text-primary whitespace-pre-wrap font-sans text-lg leading-relaxed">{result.optimizedAd}</p>
                        </div>
                         <div className="space-y-4">
                            <h3 className="text-xl font-bold text-text-primary">{t('generatedAdImageTitle')}</h3>
                             <ImagePreview
                                imageUrl={result.generatedImage}
                                isLoading={false}
                                altText={t('generatedImageAlt')}
                                placeholderText={t('generatedImagePlaceholder')}
                            />
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { AdOptimizer };