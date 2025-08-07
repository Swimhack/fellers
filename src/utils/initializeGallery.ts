
import { StorageManager } from './storageManager';

export const initializeGalleryWithUploadedImage = () => {
  // Get existing images to preserve admin uploads
  const existingImages = StorageManager.getGalleryImages();
  
  // Check if we have admin-uploaded images (images not in our default pool)
  const defaultImageUrls = [
    '/lovable-uploads/046e5f95-7772-4564-888a-5026ab430faf.png',
    '/lovable-uploads/4c53b51a-0ccb-439e-b5b8-e1c8fbb9bf7a.png',
    '/lovable-uploads/7354a6c7-a935-466b-bef6-491e72e39442.png',
    '/lovable-uploads/87ba276a-1d9f-4e50-b096-524af87702c9.png',
    '/lovable-uploads/e54e7c62-7a2b-4780-8e6a-c9159febe2f5.png',
    '/lovable-uploads/eec8e3aa-b1ac-4cfb-9933-01465e9373e9.png'
  ];

  const hasAdminImages = existingImages.some(img => !defaultImageUrls.includes(img.url));
  
  // Only initialize with default images if:
  // 1. Gallery is completely empty, OR
  // 2. Gallery only has old default images and no admin uploads
  if (existingImages.length === 0 || !hasAdminImages) {
    // Clear only if we're replacing with fresh defaults
    if (!hasAdminImages) {
      StorageManager.clearAllImages();
    }
    
    // Available default images pool
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
    console.log('Added random default image to gallery:', selectedImage.url);
  } else {
    console.log('Preserving existing gallery with admin uploads:', existingImages.length, 'images');
  }
};
