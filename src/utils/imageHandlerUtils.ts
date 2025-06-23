
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
  const savedImagesString = localStorage.getItem('uploadedBulkImages');
  if (savedImagesString) {
    try {
      return JSON.parse(savedImagesString);
    } catch (error) {
      console.error("Error parsing saved images:", error);
      return [];
    }
  }
  return [];
};

// Save images to localStorage
export const saveImagesToStorage = (images: any[]) => {
  localStorage.setItem('uploadedBulkImages', JSON.stringify(images));
};

// Remove image from gallery images in localStorage
export const removeFromGallery = (id: number) => {
  const galleryImagesString = localStorage.getItem('galleryImages');
  if (galleryImagesString) {
    try {
      const galleryImages = JSON.parse(galleryImagesString);
      const updatedGallery = galleryImages.filter((img: any) => img.id !== id);
      localStorage.setItem('galleryImages', JSON.stringify(updatedGallery));
    } catch (error) {
      console.error("Error updating gallery images:", error);
    }
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

// Simplified bulk upload process
export const processBulkUpload = async (files: File[]) => {
  console.log('Starting simplified bulk upload with', files.length, 'files');
  
  const processedImages = [];
  const failedImages = [];
  
  // Process each file individually
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`Processing file ${i + 1}/${files.length}:`, file.name);
    
    try {
      // Convert to base64
      const base64Data = await fileToBase64(file);
      
      const imageData = {
        id: Date.now() + Math.random(),
        file: file,
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
  
  // Get existing gallery images
  let galleryImages = [];
  try {
    const existingGallery = localStorage.getItem('galleryImages');
    if (existingGallery) {
      galleryImages = JSON.parse(existingGallery);
    }
  } catch (error) {
    console.error('Error loading existing gallery:', error);
    galleryImages = [];
  }
  
  // Create new gallery entries
  const nextId = galleryImages.length > 0 
    ? Math.max(...galleryImages.map((img: any) => img.id || 0)) + 1 
    : 1;
  
  const newGalleryImages = processedImages.map((img, index) => ({
    id: nextId + index,
    url: img.preview,
    alt: `${img.name}` || `Fellers Resources equipment ${nextId + index}`,
    order: galleryImages.length + index + 1
  }));
  
  // Save to gallery
  const updatedGallery = [...galleryImages, ...newGalleryImages];
  localStorage.setItem('galleryImages', JSON.stringify(updatedGallery));
  
  // Save to bulk upload storage
  let savedImages = [];
  try {
    const existingSaved = localStorage.getItem('uploadedBulkImages');
    if (existingSaved) {
      savedImages = JSON.parse(existingSaved);
    }
  } catch (error) {
    console.error('Error loading saved images:', error);
    savedImages = [];
  }
  
  const updatedSaved = [...savedImages, ...processedImages];
  localStorage.setItem('uploadedBulkImages', JSON.stringify(updatedSaved));
  
  // Trigger update event
  window.dispatchEvent(new CustomEvent('galleryImagesUpdated'));
  
  console.log(`Upload complete: ${processedImages.length} successful, ${failedImages.length} failed`);
  
  return {
    successful: processedImages.length,
    failed: failedImages.length,
    failedFiles: failedImages
  };
};

// Types
export interface UploadedImage {
  id: number;
  file: File;
  preview: string;
  name: string;
  uploadDate: string;
}
