
import { StorageManager } from './storageManager';

export const initializeGalleryWithUploadedImage = () => {
  // Clear existing gallery storage to remove any currently stored images
  StorageManager.clearAllImages();
  
  // Available images pool (excluding the image to be removed)
  const availableImages = [
    {
      url: '/lovable-uploads/046e5f95-7772-4564-888a-5026ab430faf.png',
      alt: 'Fellers Resources towing equipment'
    },
    {
      url: '/lovable-uploads/4c53b51a-0ccb-439e-b5b8-e1c8fbb9bf7a.png',
      alt: 'Professional towing services'
    },
    {
      url: '/lovable-uploads/7354a6c7-a935-466b-bef6-491e72e39442.png',
      alt: 'Heavy duty towing equipment'
    },
    {
      url: '/lovable-uploads/87ba276a-1d9f-4e50-b096-524af87702c9.png',
      alt: 'Towing and recovery services'
    },
    {
      url: '/lovable-uploads/e54e7c62-7a2b-4780-8e6a-c9159febe2f5.png',
      alt: 'Emergency towing response'
    },
    {
      url: '/lovable-uploads/eec8e3aa-b1ac-4cfb-9933-01465e9373e9.png',
      alt: 'Commercial towing solutions'
    }
  ];
  
  // Randomly select one image from the available pool
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  const selectedImage = availableImages[randomIndex];
  
  // Add the randomly selected image to gallery
  StorageManager.addImage(selectedImage.url, selectedImage.alt);
  console.log('Added random image to gallery:', selectedImage.url);
};
