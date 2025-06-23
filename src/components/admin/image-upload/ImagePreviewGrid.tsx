
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
    <div className="mt-8 space-y-4">
      <h3 className="text-xl font-semibold text-white">{title} ({images.length})</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <div className="aspect-video rounded-lg overflow-hidden border border-gray-600 bg-gray-800">
              <img 
                src={image.preview} 
                alt={`Preview ${image.name}`} 
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => onRemove(image.id)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-bold text-lg"
            >
              &times;
            </button>
            <div className="mt-2 px-1">
              <p className="text-sm text-gray-300 truncate font-medium">{image.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreviewGrid;
