
import React, { useState, useEffect } from 'react';
import { GalleryImage } from '@/types/gallery';
import { useGalleryImages } from '@/hooks/useGalleryImages';
import { StorageManager } from '@/utils/storageManager';
import GalleryImageUpload from './gallery/GalleryImageUpload';
import GalleryImageTable from './gallery/GalleryImageTable';
import GalleryImageDialog from './gallery/GalleryImageDialog';
import StorageStatus from './StorageStatus';

const AdminGallery = () => {
  const [enlargedImage, setEnlargedImage] = useState<GalleryImage | null>(null);
  const [storageStats, setStorageStats] = useState(StorageManager.getStorageStats());
  const {
    galleryImages,
    imageLoadStates,
    addImage,
    removeImage,
    updateImageAlt,
    moveImage
  } = useGalleryImages();

  // Update storage stats when gallery changes
  useEffect(() => {
    setStorageStats(StorageManager.getStorageStats());
  }, [galleryImages]);

  const handleCleanupOldImages = () => {
    const removedCount = StorageManager.cleanupOldImages();
    setStorageStats(StorageManager.getStorageStats());
    console.log(`Cleaned up ${removedCount} old images`);
  };

  const handleImageClick = (image: GalleryImage) => {
    setEnlargedImage(image);
  };

  const handleMoveUp = (index: number) => {
    moveImage(index, 'up');
  };

  const handleMoveDown = (index: number) => {
    moveImage(index, 'down');
  };

  return (
    <div className="space-y-8 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GalleryImageUpload 
            galleryImages={galleryImages}
            onAddImage={addImage}
          />
        </div>
        <div className="lg:col-span-1">
          <StorageStatus 
            stats={storageStats}
            onCleanup={handleCleanupOldImages}
          />
        </div>
      </div>

      <GalleryImageTable
        galleryImages={galleryImages}
        imageLoadStates={imageLoadStates}
        onImageClick={handleImageClick}
        onUpdateAlt={updateImageAlt}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onRemoveImage={removeImage}
      />

      <GalleryImageDialog
        image={enlargedImage}
        onClose={() => setEnlargedImage(null)}
      />
    </div>
  );
};

export default AdminGallery;
