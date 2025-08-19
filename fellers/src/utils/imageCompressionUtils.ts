
/**
 * Image compression utilities for optimizing storage usage
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
}

export interface CompressionResult {
  compressedDataUrl: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  format: 'image/jpeg'
};

export const compressImage = (file: File, options: CompressionOptions = {}): Promise<CompressionResult> => {
  return new Promise((resolve, reject) => {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > opts.maxWidth! || height > opts.maxHeight!) {
          const ratio = Math.min(opts.maxWidth! / width, opts.maxHeight! / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL(opts.format!, opts.quality!);
        
        // Calculate compression stats
        const originalSize = file.size;
        const compressedSize = Math.round((compressedDataUrl.length * 3) / 4); // Approximate base64 size
        const compressionRatio = Math.round((1 - compressedSize / originalSize) * 100);

        resolve({
          compressedDataUrl,
          originalSize,
          compressedSize,
          compressionRatio
        });
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const estimateStorageUsage = (dataUrl: string): number => {
  return Math.round((dataUrl.length * 3) / 4); // Base64 to bytes approximation
};

export const getStorageStats = () => {
  try {
    const galleryImages = localStorage.getItem('galleryImages');
    const bulkImages = localStorage.getItem('uploadedBulkImages');
    
    const gallerySize = galleryImages ? estimateStorageUsage(galleryImages) : 0;
    const bulkSize = bulkImages ? estimateStorageUsage(bulkImages) : 0;
    
    return {
      gallerySize,
      bulkSize,
      totalSize: gallerySize + bulkSize,
      // Approximate localStorage limit (varies by browser)
      estimatedLimit: 5 * 1024 * 1024, // 5MB
      usagePercentage: Math.round(((gallerySize + bulkSize) / (5 * 1024 * 1024)) * 100)
    };
  } catch (error) {
    console.error('Error calculating storage stats:', error);
    return {
      gallerySize: 0,
      bulkSize: 0,
      totalSize: 0,
      estimatedLimit: 5 * 1024 * 1024,
      usagePercentage: 0
    };
  }
};
