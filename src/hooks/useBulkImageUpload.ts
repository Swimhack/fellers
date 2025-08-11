
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { StorageManager } from '@/utils/storageManager';
import { ImageProcessor } from '@/utils/imageProcessor';
import { isValidGalleryImage } from '@/utils/galleryUtils';
import { uploadImageBlob } from '@/utils/supabaseGallery';

export interface UploadedImage {
  id: number;
  file?: File;
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
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length !== newFiles.length) {
      toast.error(`${newFiles.length - imageFiles.length} non-image files were ignored`);
    }
    const oversizedFiles = imageFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.warning(`${oversizedFiles.length} files are very large and will be compressed significantly`);
    }
    setSelectedFiles(prev => [...prev, ...imageFiles]);
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

  const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
    const res = await fetch(dataUrl);
    return await res.blob();
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
          targetSize: 500 * 1024
        },
        (processed, total) => {
          setUploadProgress(Math.round((processed / total) * 100));
        }
      );

      console.log('Images processed:', processedImages.length);

      let successful = 0;
      let failed = 0;

      for (let i = 0; i < processedImages.length; i++) {
        const processed = processedImages[i];
        const originalFile = selectedFiles[i];
        try {
          const blob = await dataUrlToBlob(processed.dataUrl);
          const { publicUrl } = await uploadImageBlob(blob, originalFile?.name || `image_${i + 1}.jpg`);

          // Save public URL to local gallery as well for caching/fallback
          const altText = (originalFile?.name || `Uploaded image ${i + 1}`).replace(/\.[^/.]+$/, '');
          StorageManager.addImage(publicUrl, altText, { source: 'admin', fileName: originalFile?.name });
          successful++;
        } catch (error) {
          console.error('Error uploading/saving image:', error);
          failed++;
        }
      }

      if (successful > 0) {
        toast.success(`Successfully uploaded ${successful} images`, {
          description: `Images are now visible in the gallery.`
        });
        setSelectedFiles([]);
        loadSavedImages();
        window.dispatchEvent(new CustomEvent('galleryImagesUpdated'));
      }

      if (failed > 0) {
        toast.error(`${failed} images failed to upload`, {
          description: "Please try again."
        });
      }

    } catch (error) {
      console.error("Error during bulk upload:", error);
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Please try again."
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

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
