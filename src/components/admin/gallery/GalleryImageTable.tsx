
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { GalleryImage, ImageLoadState } from '@/types/gallery';
import GalleryImageRow from './GalleryImageRow';

interface GalleryImageTableProps {
  galleryImages: GalleryImage[];
  imageLoadStates: ImageLoadState;
  onImageClick: (image: GalleryImage) => void;
  onUpdateAlt: (id: number, newAlt: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemoveImage: (id: number) => void;
}

const GalleryImageTable = ({
  galleryImages,
  imageLoadStates,
  onImageClick,
  onUpdateAlt,
  onMoveUp,
  onMoveDown,
  onRemoveImage
}: GalleryImageTableProps) => {
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const handleRemoveImage = (id: number) => {
    setImageToDelete(id);
  };

  const confirmDelete = () => {
    if (imageToDelete !== null) {
      onRemoveImage(imageToDelete);
      setImageToDelete(null);

      toast({
        title: "Success",
        description: "Image removed successfully and updated on front-end",
      });
    }
  };

  const handleMoveUp = (index: number) => {
    onMoveUp(index);
    toast({
      title: "Success",
      description: "Image order updated on front-end",
    });
  };

  const handleMoveDown = (index: number) => {
    onMoveDown(index);
    toast({
      title: "Success",
      description: "Image order updated on front-end",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage Gallery Images ({galleryImages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {galleryImages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No images in gallery yet. Add some images to get started!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Preview</TableHead>
                  <TableHead>Image URL</TableHead>
                  <TableHead>Alt Text</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {galleryImages.map((image, index) => (
                  <GalleryImageRow
                    key={image.id}
                    image={image}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === galleryImages.length - 1}
                    loadState={imageLoadStates[image.id]}
                    onImageClick={onImageClick}
                    onUpdateAlt={onUpdateAlt}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onRemove={handleRemoveImage}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={imageToDelete !== null} onOpenChange={() => setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this image from your gallery. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GalleryImageTable;
