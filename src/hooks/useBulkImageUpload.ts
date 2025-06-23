
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
import { filterGalleryImages, isValidGalleryImage } from '@/utils/galleryUtils';

export const useBulkImageUpload = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
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

  const handleFileChange = async (newFiles: File[]) => {
    console.log('Processing', newFiles.length, 'new files');
    const newImages: UploadedImage[] = [];
    
    for (const file of newFiles) {
      // Only process image files
      if (!file.type.startsWith('image/')) {
        console.log('Skipping non-image file:', file.name);
        continue;
      }
      
      try {
        // Convert to base64 immediately for preview
        const base64Preview = await fileToBase64(file);
        const newImage: UploadedImage = {
          id: Date.now() + Math.random(),
          file,
          preview: base64Preview,
          name: file.name,
          uploadDate: new Date().toISOString()
        };
        newImages.push(newImage);
        console.log('Processed file:', file.name);
      } catch (error) {
        console.error("Error processing file:", file.name, error);
        toast.error(`Error processing ${file.name}`);
      }
    }

    console.log('Adding', newImages.length, 'new images to upload queue');
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

    console.log('Starting bulk upload of', uploadedImages.length, 'images');
    setIsUploading(true);

    try {
      const processedCount = await processBulkUpload(
        uploadedImages,
        savedImages,
        setSavedImages,
        setUploadedImages,
        setIsUploading
      );
      
      toast.success(`Successfully uploaded ${processedCount} images to gallery`);
      
      // Reload saved images to reflect changes
      setTimeout(() => {
        loadSavedImages();
      }, 100);
      
    } catch (error) {
      console.error("Error during bulk upload:", error);
      toast.error("Error uploading images. Please try again.");
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
