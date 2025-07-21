
import React, { useState, useEffect } from 'react';
import { StorageManager } from '@/utils/storageManager';
import { isValidGalleryImage } from '@/utils/galleryUtils';

interface DynamicGalleryImageProps {
  fallbackSrc: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onImageChange?: (newSrc: string) => void;
}

const DynamicGalleryImage = ({ 
  fallbackSrc, 
  alt, 
  className = '',
  loading = 'lazy',
  onImageChange
}: DynamicGalleryImageProps) => {
  const [currentSrc, setCurrentSrc] = useState<string>(fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const selectRandomImage = () => {
    try {
      const galleryImages = StorageManager.getGalleryImages();
      const validImages = galleryImages.filter(img => isValidGalleryImage(img.url));
      
      if (validImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * validImages.length);
        const selectedImage = validImages[randomIndex];
        setCurrentSrc(selectedImage.url);
        onImageChange?.(selectedImage.url);
        console.log('Selected random gallery image:', selectedImage.id);
      } else {
        setCurrentSrc(fallbackSrc);
        onImageChange?.(fallbackSrc);
        console.log('No valid gallery images found, using fallback');
      }
    } catch (error) {
      console.error('Error selecting random image:', error);
      setCurrentSrc(fallbackSrc);
      onImageChange?.(fallbackSrc);
    }
  };

  useEffect(() => {
    selectRandomImage();

    // Listen for gallery updates
    const handleGalleryUpdate = () => {
      console.log('Gallery updated, selecting new random image');
      selectRandomImage();
    };

    window.addEventListener('galleryImagesUpdated', handleGalleryUpdate);

    return () => {
      window.removeEventListener('galleryImagesUpdated', handleGalleryUpdate);
    };
  }, [fallbackSrc]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    if (currentSrc !== fallbackSrc) {
      console.log('Error loading random image, falling back to static image');
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`${className} ${isLoading ? 'opacity-75' : 'opacity-100'} transition-opacity duration-300`}
      loading={loading}
      onLoad={handleImageLoad}
      onError={handleImageError}
    />
  );
};

export default DynamicGalleryImage;
