
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GalleryImage } from '@/types/gallery';

interface GalleryImageDialogProps {
  image: GalleryImage | null;
  onClose: () => void;
}

const GalleryImageDialog = ({ image, onClose }: GalleryImageDialogProps) => {
  return (
    <Dialog open={image !== null} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{image?.alt || 'Gallery Image'}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          {image && (
            <img 
              src={image.url} 
              alt={image.alt}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
              loading="eager"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryImageDialog;
