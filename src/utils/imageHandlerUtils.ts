
/**
 * Utility functions for handling image uploads and management
 */

// Convert File to base64 string
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
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

// Process bulk upload and save to localStorage
export const processBulkUpload = async (
  uploadedImages: UploadedImage[], 
  savedImages: UploadedImage[],
  setSavedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>,
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>,
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  console.log('Starting bulk upload process with', uploadedImages.length, 'images');
  
  try {
    // Convert uploaded images to base64 for better persistence if they aren't already
    const processedImages = await Promise.all(
      uploadedImages.map(async (img) => {
        let base64Url = img.preview;
        
        // If preview is not base64, convert the file
        if (!base64Url.startsWith('data:')) {
          base64Url = await fileToBase64(img.file);
        }
        
        return {
          ...img,
          preview: base64Url,
          id: Date.now() + Math.random() // Ensure unique ID
        };
      })
    );

    console.log('Processed images:', processedImages.length);

    // Get existing gallery images from localStorage
    const savedImagesString = localStorage.getItem('galleryImages');
    let galleryImages = [];
    
    if (savedImagesString) {
      try {
        galleryImages = JSON.parse(savedImagesString);
      } catch (error) {
        console.error("Error parsing gallery images:", error);
      }
    }

    // Get the next ID for gallery
    const nextId = galleryImages.length > 0 
      ? Math.max(...galleryImages.map((img: any) => img.id)) + 1 
      : 1;
    
    // Create gallery images with base64 URLs
    const newGalleryImages = processedImages.map((img, index) => ({
      id: nextId + index,
      url: img.preview,
      alt: img.name ? `${img.name}` : `Fellers Resources heavy towing equipment ${nextId + index}`,
      order: galleryImages.length + index + 1
    }));
    
    console.log('Creating gallery images:', newGalleryImages.length);
    
    // Add new images to gallery
    const updatedGallery = [...galleryImages, ...newGalleryImages];
    localStorage.setItem('galleryImages', JSON.stringify(updatedGallery));
    
    // Save to our separate bulk upload storage
    const updatedSavedImages = [...savedImages, ...processedImages];
    setSavedImages(updatedSavedImages);
    localStorage.setItem('uploadedBulkImages', JSON.stringify(updatedSavedImages));
    
    console.log('Bulk upload completed successfully');
    
    // Clear the uploaded images and stop loading
    setUploadedImages([]);
    setIsUploading(false);
    
    // Trigger gallery update event
    window.dispatchEvent(new CustomEvent('galleryImagesUpdated'));
    
  } catch (error) {
    console.error("Error processing bulk upload:", error);
    setIsUploading(false);
    throw error;
  }
};

// Types
export interface UploadedImage {
  id: number;
  file: File;
  preview: string;
  name: string;
  uploadDate: string;
}
