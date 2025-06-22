
import React from 'react';
import { UploadedImage } from "@/utils/imageHandlerUtils";

interface ImagePreviewGridProps {
  images: UploadedImage[];
  title: string;
  onRemove: (id: number) => void;
}

const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({ images, title, onRemove }) => {
  if (images.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3 text-white">{title} ({images.length})</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <div className="aspect-video rounded-md overflow-hidden border border-gray-600">
              <img 
                src={image.preview} 
                alt={`Preview ${image.name}`} 
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => onRemove(image.id)}
              className="absolute top-1 right-1 bg-fellers-darkBackground/80 hover:bg-fellers-darkBackground text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="sr-only">Remove</span>
              &times;
            </button>
            <p className="text-xs text-gray-300 truncate mt-1">{image.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreviewGrid;
