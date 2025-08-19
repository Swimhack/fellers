
/**
 * Memory-efficient image processing with proper cleanup
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/webp' | 'image/png';
  targetSize?: number; // Target size in bytes
}

export interface ProcessedImage {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
}

export class ImageProcessor {
  private static readonly DEFAULT_OPTIONS: CompressionOptions = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    format: 'image/jpeg'
  };

  static async processImage(file: File, options: CompressionOptions = {}): Promise<ProcessedImage> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      let objectUrl = '';
      
      img.onload = () => {
        try {
          const result = this.compressImage(img, opts);
          URL.revokeObjectURL(objectUrl); // Clean up blob URL
          resolve(result);
        } catch (error) {
          URL.revokeObjectURL(objectUrl);
          reject(error);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image'));
      };
      
      objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
    });
  }

  private static compressImage(img: HTMLImageElement, options: CompressionOptions): ProcessedImage {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    // Calculate dimensions
    let { width, height } = this.calculateDimensions(
      img.naturalWidth,
      img.naturalHeight,
      options.maxWidth!,
      options.maxHeight!
    );

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Draw image
    ctx.drawImage(img, 0, 0, width, height);

    // Try progressive compression if target size is specified
    let quality = options.quality!;
    let dataUrl = canvas.toDataURL(options.format!, quality);
    
    if (options.targetSize) {
      const attempts = 5;
      for (let i = 0; i < attempts && this.getDataUrlSize(dataUrl) > options.targetSize; i++) {
        quality = Math.max(0.1, quality - 0.15);
        dataUrl = canvas.toDataURL(options.format!, quality);
      }
    }

    // Clean up canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.remove();

    const originalSize = this.estimateFileSize(img.naturalWidth, img.naturalHeight);
    const compressedSize = this.getDataUrlSize(dataUrl);

    return {
      dataUrl,
      originalSize,
      compressedSize,
      compressionRatio: Math.round((1 - compressedSize / originalSize) * 100),
      width,
      height
    };
  }

  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
      return { width: originalWidth, height: originalHeight };
    }

    const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
    return {
      width: Math.round(originalWidth * ratio),
      height: Math.round(originalHeight * ratio)
    };
  }

  private static getDataUrlSize(dataUrl: string): number {
    // Base64 encoding: 4 characters per 3 bytes, plus data URL prefix
    return Math.round((dataUrl.length * 3) / 4);
  }

  private static estimateFileSize(width: number, height: number): number {
    // Rough estimate: 3 bytes per pixel for RGB
    return width * height * 3;
  }

  static async processImageBatch(
    files: File[],
    options: CompressionOptions = {},
    onProgress?: (processed: number, total: number) => void
  ): Promise<ProcessedImage[]> {
    const results: ProcessedImage[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const processed = await this.processImage(files[i], options);
        results.push(processed);
        
        if (onProgress) {
          onProgress(i + 1, files.length);
        }
      } catch (error) {
        console.error(`Failed to process ${files[i].name}:`, error);
        // Continue with other files
      }
    }
    
    return results;
  }
}
