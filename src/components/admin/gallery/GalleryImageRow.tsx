
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { GalleryImage, ImageLoadState } from '@/types/gallery';
import GalleryImageThumbnail from './GalleryImageThumbnail';

interface GalleryImageRowProps {
  image: GalleryImage;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  loadState: ImageLoadState[number];
  onImageClick: (image: GalleryImage) => void;
  onUpdateAlt: (id: number, newAlt: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (id: number) => void;
}

const GalleryImageRow = ({
  image,
  index,
  isFirst,
  isLast,
  loadState,
  onImageClick,
  onUpdateAlt,
  onMoveUp,
  onMoveDown,
  onRemove
}: GalleryImageRowProps) => {
  return (
    <TableRow key={image.id}>
      <TableCell>
        <GalleryImageThumbnail 
          image={image} 
          loadState={loadState} 
          onClick={onImageClick} 
        />
      </TableCell>
      <TableCell className="max-w-[200px] truncate">
        {image.url}
      </TableCell>
      <TableCell>
        <Input 
          value={image.alt} 
          onChange={(e) => onUpdateAlt(image.id, e.target.value)}
        />
      </TableCell>
      <TableCell>{image.order}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onMoveUp(index)}
            disabled={isFirst}
          >
            ↑
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onMoveDown(index)}
            disabled={isLast}
          >
            ↓
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onRemove(image.id)}
          >
            Remove
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default GalleryImageRow;
