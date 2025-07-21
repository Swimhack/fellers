
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { StorageManager } from '@/utils/storageManager';
import { ImageProcessor } from '@/utils/imageProcessor';
import { isValidGalleryImage } from '@/utils/galleryUtils';

export interface UploadedImage {
  id: number;
  preview: string;
  name: string;
  uploadDate: string;
  size?: number;
}

export const useBulkImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [savedImages, setSavedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadSavedImages();
  }, []);

  const loadSavedImages = () => {
    const galleryImages = StorageManager.getGalleryImages();
    const uploadedImages = galleryImages.map(img => ({
      id: img.id,
      preview: img.url,
      name: img.alt,
      uploadDate: img.uploadDate,
      size: img.size
    }));
    setSavedImages(uploadedImages);
  };

  const handleFileChange = (newFiles: File[]) => {
    console.log('Selected', newFiles.length, 'new files');
    
    // Check storage before allowing more files
    const storageStats = StorageManager.getStorageStats();
    if (storageStats.usagePercentage > 90) {
      toast.error("Storage nearly full", {
        description: `Current usage: ${storageStats.usagePercentage}%. Please clear some images first.`
      });
      return;
    }
    
    // Filter only image files
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    console.log('Valid image files:', imageFiles.length);
    
    if (imageFiles.length !== newFiles.length) {
      toast.error(`${newFiles.length - imageFiles.length} non-image files were ignored`);
    }
    
    // Check file sizes
    const oversizedFiles = imageFiles.filter(file => file.size > 10 * 1024 * 1024); // 10MB limit
    if (oversizedFiles.length > 0) {
      toast.warning(`${oversizedFiles.length} files are very large and will be compressed significantly`);
    }
    
    setSelectedFiles(prev => [...prev, ...imageFiles]);
    
    // Show storage usage info
    if (imageFiles.length > 5) {
      toast.info("Large batch detected", {
        description: "Images will be compressed to optimize storage usage."
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveSavedImage = (id: number) => {
    try {
      StorageManager.removeImage(id);
      loadSavedImages();
      toast.success("Image removed successfully");
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error("Failed to remove image");
    }
  };

  const handleDownloadImage = (image: UploadedImage) => {
    const link = document.createElement('a');
    link.href = image.preview;
    link.download = `${image.name || 'image'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No images selected", {
        description: "Please select at least one image to upload.",
      });
      return;
    }

    console.log('Starting bulk upload of', selectedFiles.length, 'files');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const storageStats = StorageManager.getStorageStats();
      const availableSpace = storageStats.available;
      const estimatedSpacePerImage = availableSpace / selectedFiles.length;
      
      console.log('Available space:', availableSpace, 'bytes');
      console.log('Estimated space per image:', estimatedSpacePerImage, 'bytes');

      toast.info("Processing images...", {
        description: "Compressing and uploading images to gallery"
      });

      const processedImages = await ImageProcessor.processImageBatch(
        selectedFiles,
        {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.8,
          format: 'image/jpeg',
          targetSize: Math.min(estimatedSpacePerImage * 0.8, 500 * 1024) // Max 500KB per image
        },
        (processed, total) => {
          setUploadProgress(Math.round((processed / total) * 100));
        }
      );

      console.log('Images processed:', processedImages.length);

      let successful = 0;
      let failed = 0;

      for (const processed of processedImages) {
        try {
          const fileName = selectedFiles[processedImages.indexOf(processed)]?.name || 'Unknown';
          const altText = fileName.replace(/\.[^/.]+$/, ''); // Remove extension
          
          StorageManager.addImage(processed.dataUrl, altText);
          successful++;
        } catch (error) {
          console.error('Error saving image:', error);
          failed++;
          
          if (error instanceof Error && error.message.includes('quota')) {
            toast.error("Storage quota exceeded", {
              description: "Please clear some existing images and try uploading fewer images at once."
            });
            break;
          }
        }
      }

      if (successful > 0) {
        const avgCompression = Math.round(
          processedImages.reduce((sum, img) => sum + img.compressionRatio, 0) / processedImages.length
        );
        
        toast.success(`Successfully uploaded ${successful} images`, {
          description: `Average compression: ${avgCompression}%. Images are now visible in the gallery.`
        });
        
        setSelectedFiles([]);
        loadSavedImages();
      }
      
      if (failed > 0) {
        toast.error(`${failed} images failed to upload`, {
          description: "Please try uploading the failed images again or clear some storage space."
        });
      }
      
    } catch (error) {
      console.error("Error during bulk upload:", error);
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Please try again with fewer images."
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Convert files to preview objects for display
  const uploadedImages = selectedFiles.map((file, index) => ({
    id: Date.now() + index,
    preview: URL.createObjectURL(file),
    name: file.name,
    uploadDate: new Date().toISOString()
  }));

  return {
    uploadedImages,
    savedImages,
    isUploading,
    uploadProgress,
    handleFileChange,
    handleRemoveImage: handleRemoveFile,
    handleRemoveSavedImage,
    handleDownloadImage,
    handleBulkUpload
  };
};
