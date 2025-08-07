
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GalleryImage } from '@/types/gallery';
import { validateImageUrl, isValidGalleryImage } from '@/utils/galleryUtils';

interface GalleryImageUploadProps {
  galleryImages: GalleryImage[];
  onAddImage: (image: GalleryImage) => void;
}

const GalleryImageUpload = ({ galleryImages, onAddImage }: GalleryImageUploadProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const { toast } = useToast();

  const handleAddImage = async () => {
    if (!newImageUrl) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      });
      return;
    }

    if (!isValidGalleryImage(newImageUrl)) {
      toast({
        title: "Error",
        description: "Only images from /lovable-uploads/ directory are allowed",
        variant: "destructive",
      });
      return;
    }

    const isValidImage = await validateImageUrl(newImageUrl);
    if (!isValidImage) {
      toast({
        title: "Error",
        description: "Invalid image URL or image cannot be loaded",
        variant: "destructive",
      });
      return;
    }

    try {
      const newImage: GalleryImage = {
        id: galleryImages.length > 0 ? Math.max(...galleryImages.map(img => img.id)) + 1 : 1,
        url: newImageUrl,
        alt: newImageAlt || `Fellers Resources heavy towing equipment ${galleryImages.length + 1}`,
        order: galleryImages.length + 1,
        uploadDate: new Date().toISOString(),
        metadata: {
          source: 'admin',
          fileName: newImageUrl.split('/').pop()
        }
      };

      onAddImage(newImage);
      setNewImageUrl("");
      setNewImageAlt("");

      toast({
        title: "Success",
        description: "Image added successfully and will appear in the gallery carousel",
      });
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add image. Storage may be full.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Enter image URL (/lovable-uploads/ only)"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
          </div>
          <div className="md:col-span-1">
            <Input
              type="text"
              placeholder="Alt text (optional)"
              value={newImageAlt}
              onChange={(e) => setNewImageAlt(e.target.value)}
            />
          </div>
        </div>
        <Button 
          className="mt-4 bg-fellers-green hover:bg-fellers-green/90"
          onClick={handleAddImage}
        >
          Add Image
        </Button>
      </CardContent>
    </Card>
  );
};

export default GalleryImageUpload;
