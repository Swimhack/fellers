
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import { 
  UploadedImage, 
  loadSavedImagesFromStorage, 
  removeFromGallery,
  downloadImage,
  processBulkUpload
} from '@/utils/imageHandlerUtils';
import { filterGalleryImages, isValidGalleryImage } from '@/utils/galleryUtils';

export const useBulkImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [savedImages, setSavedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Load saved images from localStorage when component mounts
  useEffect(() => {
    loadSavedImages();
  }, []);

  // Load saved images from localStorage and filter to only show /lovable-uploads/ images
  const loadSavedImages = () => {
    const images = loadSavedImagesFromStorage();
    if (images) {
      // Filter to only show images from /lovable-uploads/ directory
      const filteredImages = images.filter((image: UploadedImage) => 
        isValidGalleryImage(image.preview)
      );
      setSavedImages(filteredImages);
      
      // Update localStorage if we filtered out any images
      if (filteredImages.length !== images.length) {
        localStorage.setItem('uploadedBulkImages', JSON.stringify(filteredImages));
      }
    } else {
      setSavedImages([]);
    }
  };

  const handleFileChange = (newFiles: File[]) => {
    console.log('Selected', newFiles.length, 'new files');
    
    // Filter only image files
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    console.log('Valid image files:', imageFiles.length);
    
    if (imageFiles.length !== newFiles.length) {
      toast.error(`${newFiles.length - imageFiles.length} non-image files were ignored`);
    }
    
    setSelectedFiles(prev => [...prev, ...imageFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveSavedImage = (id: number) => {
    setSavedImages(prev => {
      const filtered = prev.filter(image => image.id !== id);
      localStorage.setItem('uploadedBulkImages', JSON.stringify(filtered));
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

    try {
      const result = await processBulkUpload(selectedFiles);
      
      if (result.successful > 0) {
        toast.success(`Successfully uploaded ${result.successful} images to gallery`);
        setSelectedFiles([]); // Clear selected files
        
        // Reload saved images
        setTimeout(() => {
          loadSavedImages();
        }, 100);
      }
      
      if (result.failed > 0) {
        toast.error(`${result.failed} images failed to upload`);
      }
      
    } catch (error) {
      console.error("Error during bulk upload:", error);
      toast.error("Error uploading images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Convert files to preview objects for display
  const uploadedImages = selectedFiles.map((file, index) => ({
    id: Date.now() + index,
    file,
    preview: URL.createObjectURL(file),
    name: file.name,
    uploadDate: new Date().toISOString()
  }));

  return {
    uploadedImages,
    savedImages,
    isUploading,
    handleFileChange,
    handleRemoveImage: handleRemoveFile,
    handleRemoveSavedImage,
    handleDownloadImage,
    handleBulkUpload
  };
};
