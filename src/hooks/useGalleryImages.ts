import { useState, useEffect } from 'react';
import { GalleryImage, ImageLoadState } from '@/types/gallery';
import { triggerGalleryUpdate, filterGalleryImages } from '@/utils/galleryUtils';

export const useGalleryImages = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [imageLoadStates, setImageLoadStates] = useState<ImageLoadState>({});

  const preloadImages = (images: GalleryImage[]) => {
    const newLoadStates: ImageLoadState = {};
    
    images.forEach((image) => {
      newLoadStates[image.id] = { loaded: false, error: false };
      
      const img = new Image();
      img.onload = () => {
        setImageLoadStates(prev => ({
          ...prev,
          [image.id]: { loaded: true, error: false }
        }));
      };
      img.onerror = () => {
        setImageLoadStates(prev => ({
          ...prev,
          [image.id]: { loaded: true, error: true }
        }));
      };
      img.src = image.url;
    });
    
    setImageLoadStates(newLoadStates);
  };

  useEffect(() => {
    const savedImages = localStorage.getItem('galleryImages');
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages);
        const filteredImages = filterGalleryImages(parsedImages);
        setGalleryImages(filteredImages);
        preloadImages(filteredImages);
        
        // Update localStorage with filtered images if any were removed
        if (filteredImages.length !== parsedImages.length) {
          localStorage.setItem('galleryImages', JSON.stringify(filteredImages));
        }
      } catch (error) {
        console.error('Error parsing gallery images:', error);
        setGalleryImages([]);
      }
    } else {
      setGalleryImages([]);
    }
  }, []);

  useEffect(() => {
    if (galleryImages.length > 0) {
      localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
      triggerGalleryUpdate();
    }
  }, [galleryImages]);

  const addImage = (image: GalleryImage) => {
    const updatedImages = [...galleryImages, image];
    setGalleryImages(updatedImages);
    preloadImages([image]);
  };

  const removeImage = (id: number) => {
    const updatedImages = galleryImages.filter(img => img.id !== id);
    const reorderedImages = updatedImages.map((img, index) => ({
      ...img,
      order: index + 1
    }));
    
    setGalleryImages(reorderedImages);
    
    setImageLoadStates(prev => {
      const newStates = { ...prev };
      delete newStates[id];
      return newStates;
    });
  };

  const updateImageAlt = (id: number, newAlt: string) => {
    const updatedImages = galleryImages.map(img => 
      img.id === id ? { ...img, alt: newAlt } : img
    );
    setGalleryImages(updatedImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === galleryImages.length - 1)) {
      return;
    }
    
    const newImages = [...galleryImages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    
    newImages.forEach((img, idx) => {
      img.order = idx + 1;
    });
    
    setGalleryImages(newImages);
  };

  return {
    galleryImages,
    imageLoadStates,
    addImage,
    removeImage,
    updateImageAlt,
    moveImage
  };
};
