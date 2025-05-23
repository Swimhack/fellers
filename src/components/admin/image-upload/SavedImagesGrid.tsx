
import React from 'react';
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadedImage, formatDate } from "@/utils/imageHandlerUtils";

interface SavedImagesGridProps {
  images: UploadedImage[];
  onDownload: (image: UploadedImage) => void;
  onRemove: (id: number) => void;
}

const SavedImagesGrid: React.FC<SavedImagesGridProps> = ({ 
  images, 
  onDownload, 
  onRemove 
}) => {
  if (images.length === 0) return null;

  return (
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
          <div className="absolute top-1 right-1 flex gap-1">
            <Button
              size="icon"
              variant="outline"
              className="size-8 bg-fellers-darkBackground hover:bg-fellers-inputBackground opacity-0 group-hover:opacity-100 transition-opacity border-gray-600"
              onClick={() => onDownload(image)}
            >
              <Download className="size-4 text-fellers-green" />
              <span className="sr-only">Download</span>
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="size-8 bg-fellers-darkBackground hover:bg-fellers-inputBackground text-red-500 opacity-0 group-hover:opacity-100 transition-opacity border-gray-600"
              onClick={() => onRemove(image.id)}
            >
              <span className="sr-only">Remove</span>
              &times;
            </Button>
          </div>
          <div className="mt-1 space-y-1">
            <p className="text-xs text-gray-300 truncate">{image.name}</p>
            <p className="text-xs text-gray-400">{formatDate(image.uploadDate)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedImagesGrid;
