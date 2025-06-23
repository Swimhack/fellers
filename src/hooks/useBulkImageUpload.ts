
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import { 
  UploadedImage, 
  loadSavedImagesFromStorage, 
  removeFromGallery,
  downloadImage,
  processBulkUpload,
  fileToBase64
} from '@/utils/imageHandlerUtils';

export const useBulkImageUpload = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [savedImages, setSavedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Load saved images from localStorage when component mounts
  useEffect(() => {
    loadSavedImages();
  }, []);

  // Load saved images from localStorage
  const loadSavedImages = () => {
    const images = loadSavedImagesFromStorage();
    if (images) {
      setSavedImages(images);
    } else {
      toast.error("Error loading saved images");
    }
  };

  const handleFileChange = async (newFiles: File[]) => {
    const newImages: UploadedImage[] = [];
    
    for (const file of newFiles) {
      // Only process image files
      if (!file.type.startsWith('image/')) continue;
      
      try {
        // Convert to base64 immediately for better reliability
        const base64Preview = await fileToBase64(file);
        newImages.push({
          id: Date.now() + Math.random(),
          file,
          preview: base64Preview,
          name: file.name,
          uploadDate: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error processing file:", file.name, error);
        toast.error(`Error processing ${file.name}`);
      }
    }

    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id: number) => {
    setUploadedImages(prev => prev.filter(image => image.id !== id));
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
    if (uploadedImages.length === 0) {
      toast.error("No images to upload", {
        description: "Please select at least one image to upload.",
      });
      return;
    }

    setIsUploading(true);

    try {
      await processBulkUpload(
        uploadedImages,
        savedImages,
        setSavedImages,
        setUploadedImages,
        setIsUploading
      );
      toast.success(`Successfully processed ${uploadedImages.length} images`);
    } catch (error) {
      console.error("Error processing upload:", error);
      toast.error("Error uploading images");
      setIsUploading(false);
    }
  };

  return {
    uploadedImages,
    savedImages,
    isUploading,
    handleFileChange,
    handleRemoveImage,
    handleRemoveSavedImage,
    handleDownloadImage,
    handleBulkUpload
  };
};
