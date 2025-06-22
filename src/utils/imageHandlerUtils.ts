
/**
 * Utility functions for handling image uploads and management
 */

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
export const processBulkUpload = (
  uploadedImages: UploadedImage[], 
  savedImages: UploadedImage[],
  setSavedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>,
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>,
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
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

      // Get the next ID
      const nextId = galleryImages.length > 0 
        ? Math.max(...galleryImages.map((img: any) => img.id)) + 1 
        : 1;
      
      // Create object URLs for the uploaded images
      // In a real app, you would upload these to a server and use the returned URLs
      const newGalleryImages = uploadedImages.map((img, index) => ({
        id: nextId + index,
        url: img.preview,
        alt: `Uploaded image ${nextId + index}`,
        order: galleryImages.length + index + 1
      }));
      
      // Add new images to gallery
      const updatedGallery = [...galleryImages, ...newGalleryImages];
      localStorage.setItem('galleryImages', JSON.stringify(updatedGallery));
      
      // Save to our separate bulk upload storage
      const updatedSavedImages = [...savedImages, ...uploadedImages];
      setSavedImages(updatedSavedImages);
      localStorage.setItem('uploadedBulkImages', JSON.stringify(updatedSavedImages));
      
      setIsUploading(false);
      setUploadedImages([]);
      resolve();
    }, 1500);
  });
};

// Types
export interface UploadedImage {
  id: number;
  file: File;
  preview: string;
  name: string;
  uploadDate: string;
}
