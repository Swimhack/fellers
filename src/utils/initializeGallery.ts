
import { StorageManager } from './storageManager';

export const initializeGalleryWithUploadedImage = () => {
  // Check if gallery is empty and add the uploaded image
  const existingImages = StorageManager.getGalleryImages();
  
  if (existingImages.length === 0) {
    // Add the uploaded heavy towing equipment image
    const imageUrl = '/lovable-uploads/d24fd00f-773f-4d28-a79a-da0acf59d9f6.png';
    StorageManager.addImage(imageUrl, 'Fellers Resources heavy towing equipment in action');
    console.log('Added uploaded image to gallery');
  }
};
