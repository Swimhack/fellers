
import { StorageManager } from './storageManager';

export const initializeGalleryWithUploadedImage = () => {
  // Check if gallery is empty and add the uploaded image
  const existingImages = StorageManager.getGalleryImages();
  
  if (existingImages.length === 0) {
    // Add the uploaded heavy towing equipment image
    const imageUrl = '/lovable-uploads/7354a6c7-a935-466b-bef6-491e72e39442.png';
    StorageManager.addImage(imageUrl, 'Fellers Resources heavy towing equipment in action');
    console.log('Added uploaded image to gallery');
  }
};
