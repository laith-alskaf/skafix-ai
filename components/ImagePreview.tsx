import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

interface ImagePreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
  altText: string;
  placeholderText: string;
}

const PlaceholderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, isLoading, altText, placeholderText }) => {
  const { t } = useTranslation();

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    
    // Extract mime type and set extension
    const mimeType = imageUrl.split(';')[0].split(':')[1];
    const extension = mimeType.split('/')[1] || 'jpeg';
    link.download = `skafix-ai-image.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="w-full aspect-square bg-base-200 rounded-lg flex items-center justify-center p-4 border border-base-300 shadow-inner relative group">
      {isLoading ? (
        <div className="flex flex-col items-center text-text-secondary">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-4"></div>
          <p>{t('processing')}</p>
        </div>
      ) : imageUrl ? (
        <>
            <img src={imageUrl} alt={altText} className="max-h-full max-w-full object-contain rounded-md" />
            <button
                onClick={handleDownload}
                className="absolute top-3 right-3 bg-black/60 text-white font-semibold py-2 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center"
                aria-label={t('downloadButton')}
            >
                <DownloadIcon />
                {t('downloadButton')}
            </button>
        </>
      ) : (
        <div className="text-center text-text-secondary">
            <PlaceholderIcon/>
            <p className="mt-2">{placeholderText}</p>
        </div>
      )}
    </div>
  );
};