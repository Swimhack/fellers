
/**
 * Utility functions for handling image uploads and management
 */

import { compressImage, getStorageStats } from './imageCompressionUtils';
import { safeLocalStorageSet, safeLocalStorageGet, StorageError } from './storageUtils';
import { triggerGalleryUpdate } from './galleryUtils';

export interface UploadedImage {
  id: number;
  preview: string;
  name: string;
  uploadDate: string;
  compressedSize?: number;
  originalSize?: number;
  compressionRatio?: number;
}

export interface BulkUploadResult {
  successful: number;
  failed: number;
  failedFiles: string[];
  compressionStats?: {
    totalOriginalSize: number;
    totalCompressedSize: number;
    averageCompressionRatio: number;
  };
}

// Load saved images from localStorage
export const loadSavedImagesFromStorage = (): UploadedImage[] => {
  return safeLocalStorageGet('uploadedBulkImages', []);
};

// Remove image from gallery images in localStorage
export const removeFromGallery = (id: number): void => {
  try {
    const galleryImages = safeLocalStorageGet('galleryImages', []);
    const updatedGallery = galleryImages.filter((img: any) => img.id !== id);
    safeLocalStorageSet('galleryImages', updatedGallery);
    triggerGalleryUpdate();
  } catch (error) {
    console.error("Error updating gallery images:", error);
  }
};

// Format date from ISO string to local date and time
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

// Create downloadable link for image
export const downloadImage = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate unique ID with better collision avoidance
const generateUniqueId = (): number => {
  return Date.now() + Math.floor(Math.random() * 100000);
};

// Process files in batches to avoid memory issues
const processBatch = async (files: File[], batchSize: number = 5): Promise<UploadedImage[]> => {
  const processedImages: UploadedImage[] = [];
  
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const batchPromises = batch.map(async (file, index) => {
      try {
        console.log(`Processing file ${i + index + 1}/${files.length}:`, file.name);
        
        // Compress the image
        const compressionResult = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.8,
          format: 'image/jpeg'
        });
        
        const imageData: UploadedImage = {
          id: generateUniqueId(),
          preview: compressionResult.compressedDataUrl,
          name: file.name,
          uploadDate: new Date().toISOString(),
          originalSize: compressionResult.originalSize,
          compressedSize: compressionResult.compressedSize,
          compressionRatio: compressionResult.compressionRatio
        };
        
        console.log(`Compressed ${file.name}: ${compressionResult.compressionRatio}% reduction`);
        return imageData;
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
        throw error;
      }
    });
    
    const batchResults = await Promise.allSettled(batchPromises);
    const successfulResults = batchResults
      .filter((result): result is PromiseFulfilledResult<UploadedImage> => result.status === 'fulfilled')
      .map(result => result.value);
    
    processedImages.push(...successfulResults);
  }
  
  return processedImages;
};

// Simplified bulk upload process with compression and better error handling
export const processBulkUpload = async (files: File[]): Promise<BulkUploadResult> => {
  console.log('Starting bulk upload process with', files.length, 'files');
  
  // Check storage before processing
  const storageStats = getStorageStats();
  console.log('Current storage usage:', storageStats);
  
  if (storageStats.usagePercentage > 80) {
    console.warn('Storage usage is high:', storageStats.usagePercentage + '%');
  }
  
  try {
    // Process files in batches
    const processedImages = await processBatch(files);
    
    if (processedImages.length === 0) {
      throw new Error('No images were successfully processed');
    }
    
    // Calculate compression stats
    const totalOriginalSize = processedImages.reduce((sum, img) => sum + (img.originalSize || 0), 0);
    const totalCompressedSize = processedImages.reduce((sum, img) => sum + (img.compressedSize || 0), 0);
    const averageCompressionRatio = Math.round(
      processedImages.reduce((sum, img) => sum + (img.compressionRatio || 0), 0) / processedImages.length
    );
    
    // Get existing gallery images
    const galleryImages = safeLocalStorageGet('galleryImages', []);
    
    // Create new gallery entries
    const nextId = galleryImages.length > 0 
      ? Math.max(...galleryImages.map((img: any) => img.id || 0)) + 1 
      : 1;
    
    const newGalleryImages = processedImages.map((img, index) => ({
      id: nextId + index,
      url: img.preview,
      alt: img.name ? `${img.name.replace(/\.[^/.]+$/, '')}` : `Fellers Resources equipment ${nextId + index}`,
      order: galleryImages.length + index + 1
    }));
    
    // Save to gallery with error handling
    try {
      const updatedGallery = [...galleryImages, ...newGalleryImages];
      safeLocalStorageSet('galleryImages', updatedGallery);
      console.log('Gallery updated successfully');
    } catch (error) {
      if (error instanceof StorageError && error.type === 'QUOTA_EXCEEDED') {
        throw new Error('Storage quota exceeded. Please clear some existing images and try again with fewer images.');
      }
      throw error;
    }
    
    // Save to bulk upload storage
    try {
      const savedImages = safeLocalStorageGet('uploadedBulkImages', []);
      const updatedSaved = [...savedImages, ...processedImages];
      safeLocalStorageSet('uploadedBulkImages', updatedSaved);
      console.log('Bulk upload images saved successfully');
    } catch (error) {
      console.warn('Failed to save to bulk upload storage:', error);
      // Continue anyway since gallery was updated
    }
    
    // Trigger update event
    triggerGalleryUpdate();
    
    const result: BulkUploadResult = {
      successful: processedImages.length,
      failed: files.length - processedImages.length,
      failedFiles: files.slice(processedImages.length).map(f => f.name),
      compressionStats: {
        totalOriginalSize,
        totalCompressedSize,
        averageCompressionRatio
      }
    };
    
    console.log('Upload complete:', result);
    return result;
    
  } catch (error) {
    console.error('Bulk upload failed:', error);
    
    if (error instanceof StorageError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    throw new Error('Upload failed due to an unknown error');
  }
};
