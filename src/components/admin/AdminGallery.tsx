
import React, { useState } from 'react';
import { GalleryImage } from '@/types/gallery';
import { useGalleryImages } from '@/hooks/useGalleryImages';
import GalleryImageUpload from './gallery/GalleryImageUpload';
import GalleryImageTable from './gallery/GalleryImageTable';
import GalleryImageDialog from './gallery/GalleryImageDialog';

const AdminGallery = () => {
  const [enlargedImage, setEnlargedImage] = useState<GalleryImage | null>(null);
  const {
    galleryImages,
    imageLoadStates,
    addImage,
    removeImage,
    updateImageAlt,
    moveImage
  } = useGalleryImages();

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
      <GalleryImageUpload 
        galleryImages={galleryImages}
        onAddImage={addImage}
      />

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
