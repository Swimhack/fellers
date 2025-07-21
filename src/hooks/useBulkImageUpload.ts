
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { 
  UploadedImage, 
  loadSavedImagesFromStorage, 
  removeFromGallery,
  downloadImage,
  processBulkUpload
} from '@/utils/imageHandlerUtils';
import { getStorageStats } from '@/utils/imageCompressionUtils';
import { StorageError } from '@/utils/storageUtils';
import { isValidGalleryImage } from '@/utils/galleryUtils';

export const useBulkImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [savedImages, setSavedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load saved images from localStorage when component mounts
  useEffect(() => {
    loadSavedImages();
  }, []);

  // Load saved images from localStorage and filter to only show valid images
  const loadSavedImages = () => {
    const images = loadSavedImagesFromStorage();
    if (images) {
      // Filter to only show valid gallery images
      const filteredImages = images.filter((image: UploadedImage) => 
        isValidGalleryImage(image.preview)
      );
      setSavedImages(filteredImages);
      
      // Update localStorage if we filtered out any images
      if (filteredImages.length !== images.length) {
        try {
          localStorage.setItem('uploadedBulkImages', JSON.stringify(filteredImages));
        } catch (error) {
          console.warn('Failed to update filtered images in storage:', error);
        }
      }
    } else {
      setSavedImages([]);
    }
  };

  const handleFileChange = (newFiles: File[]) => {
    console.log('Selected', newFiles.length, 'new files');
    
    // Check storage before allowing more files
    const storageStats = getStorageStats();
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
    setSavedImages(prev => {
      const filtered = prev.filter(image => image.id !== id);
      try {
        localStorage.setItem('uploadedBulkImages', JSON.stringify(filtered));
      } catch (error) {
        console.warn('Failed to update storage after removing image:', error);
      }
      return filtered;
    });

    // Also update the gallery images if needed
    removeFromGallery(id);
    toast.success("Image removed successfully");
  };

  const handleDownloadImage = (image: UploadedImage) => {
    downloadImage(image.preview, image.name || `image-${image.id}.jpg`);
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
      // Show initial progress
      toast.info("Processing images...", {
        description: "Compressing and uploading images to gallery"
      });

      const result = await processBulkUpload(selectedFiles);
      
      if (result.successful > 0) {
        const compressionInfo = result.compressionStats ? 
          ` (${result.compressionStats.averageCompressionRatio}% compression)` : '';
        
        toast.success(`Successfully uploaded ${result.successful} images${compressionInfo}`, {
          description: "Images are now visible in the gallery"
        });
        
        setSelectedFiles([]); // Clear selected files
        
        // Reload saved images
        setTimeout(() => {
          loadSavedImages();
        }, 100);
      }
      
      if (result.failed > 0) {
        toast.error(`${result.failed} images failed to upload`, {
          description: "Please try uploading the failed images again"
        });
      }
      
    } catch (error) {
      console.error("Error during bulk upload:", error);
      
      if (error instanceof StorageError) {
        if (error.type === 'QUOTA_EXCEEDED') {
          toast.error("Storage quota exceeded", {
            description: "Please clear some existing images and try uploading fewer images at once."
          });
        } else {
          toast.error("Storage error", {
            description: error.message
          });
        }
      } else {
        toast.error("Upload failed", {
          description: error instanceof Error ? error.message : "Please try again with fewer images."
        });
      }
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
