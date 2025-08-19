
/**
 * Storage management utilities for handling localStorage operations
 */

export class StorageError extends Error {
  constructor(message: string, public readonly type: 'QUOTA_EXCEEDED' | 'PARSE_ERROR' | 'GENERAL') {
    super(message);
    this.name = 'StorageError';
  }
}

export const safeLocalStorageSet = (key: string, value: any): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
        throw new StorageError(
          'Storage quota exceeded. Please clear some images or try uploading fewer images.',
          'QUOTA_EXCEEDED'
        );
      }
      throw new StorageError(`Failed to save to storage: ${error.message}`, 'GENERAL');
    }
    throw new StorageError('Unknown storage error', 'GENERAL');
  }
};

export const safeLocalStorageGet = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to parse localStorage item "${key}":`, error);
    return defaultValue;
  }
};

export const clearOldImages = (maxAge: number = 7 * 24 * 60 * 60 * 1000): void => {
  try {
    const cutoffDate = new Date(Date.now() - maxAge).toISOString();
    
    // Clean bulk images
    const bulkImages = safeLocalStorageGet('uploadedBulkImages', []);
    const filteredBulkImages = bulkImages.filter((img: any) => 
      img.uploadDate && img.uploadDate > cutoffDate
    );
    
    if (filteredBulkImages.length !== bulkImages.length) {
      safeLocalStorageSet('uploadedBulkImages', filteredBulkImages);
    }
  } catch (error) {
    console.warn('Failed to clear old images:', error);
  }
};

export const getAvailableStorage = (): number => {
  try {
    // Test available space by attempting to store data
    const testKey = '__storage_test__';
    const testData = 'x'.repeat(1024); // 1KB test
    let available = 0;
    
    for (let i = 0; i < 5000; i++) { // Test up to 5MB
      try {
        localStorage.setItem(testKey + i, testData);
        available += 1024;
      } catch {
        break;
      }
    }
    
    // Clean up test data
    for (let i = 0; i < 5000; i++) {
      localStorage.removeItem(testKey + i);
    }
    
    return available;
  } catch {
    return 0;
  }
};
