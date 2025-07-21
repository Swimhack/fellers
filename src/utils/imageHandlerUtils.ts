
/**
 * Utility functions for handling image uploads and management
 */

// Convert File to base64 string
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => {
      console.error('Error converting file to base64:', error);
      reject(error);
    };
  });
};

// Load saved images from localStorage
export const loadSavedImagesFromStorage = () => {
  try {
    const savedImagesString = localStorage.getItem('uploadedBulkImages');
    if (savedImagesString) {
      return JSON.parse(savedImagesString);
    }
    return [];
  } catch (error) {
    console.error("Error parsing saved images:", error);
    return [];
  }
};

// Save images to localStorage with error handling
export const saveImagesToStorage = (images: any[]) => {
  try {
    localStorage.setItem('uploadedBulkImages', JSON.stringify(images));
  } catch (error) {
    console.error("Error saving images to storage:", error);
    throw new Error("Failed to save images - storage may be full");
  }
};

// Remove image from gallery images in localStorage
export const removeFromGallery = (id: number) => {
  try {
    const galleryImagesString = localStorage.getItem('galleryImages');
    if (galleryImagesString) {
      const galleryImages = JSON.parse(galleryImagesString);
      const updatedGallery = galleryImages.filter((img: any) => img.id !== id);
      localStorage.setItem('galleryImages', JSON.stringify(updatedGallery));
      
      // Trigger update event
      window.dispatchEvent(new CustomEvent('galleryImagesUpdated'));
    }
  } catch (error) {
    console.error("Error updating gallery images:", error);
  }
};

// Format date from ISO string to local date and time
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

// Create downloadable link for image
export const downloadImage = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate unique ID
const generateUniqueId = () => {
  return Date.now() + Math.floor(Math.random() * 10000);
};

// Simplified bulk upload process
export const processBulkUpload = async (files: File[]) => {
  console.log('Starting bulk upload process with', files.length, 'files');
  
  const processedImages = [];
  const failedImages = [];
  
  // Process each file individually
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`Processing file ${i + 1}/${files.length}:`, file.name);
    
    try {
      // Convert to base64
      const base64Data = await fileToBase64(file);
      
      // Create image data without File object (File objects cannot be serialized)
      const imageData = {
        id: generateUniqueId(),
        preview: base64Data,
        name: file.name,
        uploadDate: new Date().toISOString()
      };
      
      processedImages.push(imageData);
      console.log('Successfully processed:', file.name);
      
    } catch (error) {
      console.error('Failed to process:', file.name, error);
      failedImages.push(file.name);
    }
  }
  
  if (processedImages.length === 0) {
    throw new Error('No images were successfully processed');
  }
  
  try {
    // Get existing gallery images
    let galleryImages = [];
    const existingGallery = localStorage.getItem('galleryImages');
    if (existingGallery) {
      galleryImages = JSON.parse(existingGallery);
    }
    
    console.log('Existing gallery images:', galleryImages);
    
    // Create new gallery entries with proper structure
    const nextId = galleryImages.length > 0 
      ? Math.max(...galleryImages.map((img: any) => img.id || 0)) + 1 
      : 1;
    
    const newGalleryImages = processedImages.map((img, index) => ({
      id: nextId + index,
      url: img.preview, // Use the base64 data URL
      alt: img.name ? `${img.name.replace(/\.[^/.]+$/, '')}` : `Fellers Resources equipment ${nextId + index}`,
      order: galleryImages.length + index + 1
    }));
    
    console.log('New gallery images to add:', newGalleryImages);
    
    // Save to gallery
    const updatedGallery = [...galleryImages, ...newGalleryImages];
    localStorage.setItem('galleryImages', JSON.stringify(updatedGallery));
    console.log('Updated gallery saved to localStorage:', updatedGallery);
    
    // Save to bulk upload storage
    let savedImages = [];
    const existingSaved = localStorage.getItem('uploadedBulkImages');
    if (existingSaved) {
      savedImages = JSON.parse(existingSaved);
    }
    
    const updatedSaved = [...savedImages, ...processedImages];
    localStorage.setItem('uploadedBulkImages', JSON.stringify(updatedSaved));
    console.log('Updated bulk upload images saved to localStorage');
    
    // Trigger update event
    window.dispatchEvent(new CustomEvent('galleryImagesUpdated'));
    console.log('Gallery update event triggered');
    
  } catch (storageError) {
    console.error('Storage error:', storageError);
    throw new Error('Failed to save images to storage - storage may be full');
  }
  
  console.log(`Upload complete: ${processedImages.length} successful, ${failedImages.length} failed`);
  
  return {
    successful: processedImages.length,
    failed: failedImages.length,
    failedFiles: failedImages
  };
};

// Types - removed File from UploadedImage since it cannot be serialized
export interface UploadedImage {
  id: number;
  preview: string;
  name: string;
  uploadDate: string;
}
