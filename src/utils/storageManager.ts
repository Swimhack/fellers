
/**
 * Centralized storage management for gallery images
 * Eliminates duplicate storage and provides proper cleanup
 */

export interface StorageStats {
  used: number;
  available: number;
  total: number;
  usagePercentage: number;
}

export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  order: number;
  uploadDate: string;
  size?: number;
}

export class StorageManager {
  private static readonly GALLERY_KEY = 'galleryImages';
  private static readonly MAX_STORAGE_SIZE = 4.5 * 1024 * 1024; // 4.5MB to leave buffer

  static getStorageStats(): StorageStats {
    let used = 0;
    let available = 0;
    
    try {
      // Calculate actual usage
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length * 2; // UTF-16 encoding
        }
      }
      
      // Test available space
      const testKey = '__test_storage__';
      const testSize = 1024; // 1KB chunks
      let testUsed = 0;
      
      try {
        for (let i = 0; i < 1000; i++) {
          localStorage.setItem(testKey + i, 'x'.repeat(testSize));
          testUsed += testSize * 2;
        }
      } catch (e) {
        // Hit the limit
      } finally {
        // Clean up test data
        for (let i = 0; i < 1000; i++) {
          localStorage.removeItem(testKey + i);
        }
      }
      
      available = Math.max(0, this.MAX_STORAGE_SIZE - used);
      
      return {
        used,
        available,
        total: this.MAX_STORAGE_SIZE,
        usagePercentage: Math.round((used / this.MAX_STORAGE_SIZE) * 100)
      };
    } catch (error) {
      console.error('Error calculating storage stats:', error);
      return {
        used: 0,
        available: this.MAX_STORAGE_SIZE,
        total: this.MAX_STORAGE_SIZE,
        usagePercentage: 0
      };
    }
  }

  static getGalleryImages(): GalleryImage[] {
    try {
      const stored = localStorage.getItem(this.GALLERY_KEY);
      if (!stored) return [];
      
      const images = JSON.parse(stored);
      return Array.isArray(images) ? images : [];
    } catch (error) {
      console.error('Error loading gallery images:', error);
      return [];
    }
  }

  static saveGalleryImages(images: GalleryImage[]): void {
    try {
      const serialized = JSON.stringify(images);
      localStorage.setItem(this.GALLERY_KEY, serialized);
      
      // Trigger update event
      window.dispatchEvent(new CustomEvent('galleryImagesUpdated'));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please clear some images first.');
      }
      throw error;
    }
  }

  static addImage(imageData: string, alt: string): number {
    const images = this.getGalleryImages();
    const newId = images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : 1;
    
    const newImage: GalleryImage = {
      id: newId,
      url: imageData,
      alt,
      order: images.length + 1,
      uploadDate: new Date().toISOString(),
      size: imageData.length * 2 // Approximate UTF-16 size
    };
    
    const updatedImages = [...images, newImage];
    this.saveGalleryImages(updatedImages);
    
    return newId;
  }

  static removeImage(id: number): void {
    const images = this.getGalleryImages();
    const filteredImages = images.filter(img => img.id !== id);
    
    // Reorder remaining images
    const reorderedImages = filteredImages.map((img, index) => ({
      ...img,
      order: index + 1
    }));
    
    this.saveGalleryImages(reorderedImages);
  }

  static cleanupOldImages(maxAge: number = 7 * 24 * 60 * 60 * 1000): number {
    const images = this.getGalleryImages();
    const cutoffDate = new Date(Date.now() - maxAge);
    
    const filteredImages = images.filter(img => {
      const uploadDate = new Date(img.uploadDate);
      return uploadDate > cutoffDate;
    });
    
    const removedCount = images.length - filteredImages.length;
    
    if (removedCount > 0) {
      this.saveGalleryImages(filteredImages);
    }
    
    return removedCount;
  }

  static clearAllImages(): void {
    localStorage.removeItem(this.GALLERY_KEY);
    window.dispatchEvent(new CustomEvent('galleryImagesUpdated'));
  }
}
