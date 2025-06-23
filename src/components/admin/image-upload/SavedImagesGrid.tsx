
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
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 bg-green-600 hover:bg-green-700 border-green-600 text-white"
              onClick={() => onDownload(image)}
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 bg-red-600 hover:bg-red-700 border-red-600 text-white"
              onClick={() => onRemove(image.id)}
            >
              <span className="text-sm font-bold">&times;</span>
              <span className="sr-only">Remove</span>
            </Button>
          </div>
          <div className="mt-3 px-1 space-y-1">
            <p className="text-sm text-gray-300 truncate font-medium">{image.name}</p>
            <p className="text-xs text-gray-400">{formatDate(image.uploadDate)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedImagesGrid;
