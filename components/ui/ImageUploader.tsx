import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Label } from './Label';
import { useI18n } from '../../i18n';

interface ImageUploaderProps {
  label: string;
  currentImage?: string;
  onImageSelect: (base64Image: string) => void;
  aspectRatio?: '1/1' | '3/1';
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, currentImage, onImageSelect, aspectRatio = '1/1' }) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageSelect(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const aspectClass = aspectRatio === '1/1' ? 'aspect-square' : 'aspect-[3/1]';
  const sizeHint = aspectRatio === '1/1' ? '(e.g., 200x200px)' : '(e.g., 1200x400px)';

  return (
    <div className="space-y-2">
      <Label>{label} <span className="text-xs text-gray-500">{sizeHint}</span></Label>
      <div className={`relative w-full ${aspectClass} rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden`}>
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
               <Button type="button" onClick={handleButtonClick}>{t('profile.edit.upload.cta')}</Button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <UploadIcon />
            <p className="mt-2 text-sm text-gray-600">Drag & drop or click to upload</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
    </div>
  );
};