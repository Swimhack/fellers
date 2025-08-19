
import React from 'react';
import { GalleryImage, ImageLoadState } from '@/types/gallery';
import { Skeleton } from '@/components/ui/skeleton';

interface GalleryImageThumbnailProps {
  image: GalleryImage;
  loadState: ImageLoadState[number];
  onClick: (image: GalleryImage) => void;
}

const GalleryImageThumbnail = ({ image, loadState, onClick }: GalleryImageThumbnailProps) => {
  if (!loadState || (!loadState.loaded && !loadState.error)) {
    return <Skeleton className="w-16 h-16 rounded-md" />;
  }
  
  if (loadState.error) {
    return (
      <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
        Error
      </div>
    );
  }
  
  return (
    <div 
      className="w-16 h-16 relative cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => onClick(image)}
    >
      <img 
        src={image.url} 
        alt={image.alt} 
        className="object-cover w-full h-full rounded-md"
        loading="eager"
      />
    </div>
  );
};

export default GalleryImageThumbnail;
