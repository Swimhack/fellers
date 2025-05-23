
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Import the same gallery images array used in Gallery component
const initialGalleryImages = [
  "/lovable-uploads/87ba276a-1d9f-4e50-b096-524af87702c9.png",
  "/lovable-uploads/eec8e3aa-b1ac-4cfb-9933-01465e9373e9.png",
  "/lovable-uploads/4c53b51a-0ccb-439e-b5b8-e1c8fbb9bf7a.png",
  "https://images.unsplash.com/photo-1626964737076-ecb6b6a72d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1598488035139-bd3eecb95fca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1607461042421-b47f193fe8e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
];

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  order: number;
}

const AdminGallery = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize gallery images from the array
    const formattedImages = initialGalleryImages.map((url, index) => ({
      id: index + 1,
      url: url,
      alt: `Fellers Resources heavy towing equipment ${index + 1}`,
      order: index + 1
    }));
    
    // Check if we have saved images in localStorage
    const savedImages = localStorage.getItem('galleryImages');
    if (savedImages) {
      setGalleryImages(JSON.parse(savedImages));
    } else {
      setGalleryImages(formattedImages);
    }
  }, []);

  // Save changes to localStorage whenever gallery images change
  useEffect(() => {
    if (galleryImages.length > 0) {
      localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
    }
  }, [galleryImages]);

  const handleAddImage = () => {
    if (!newImageUrl) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      });
      return;
    }

    const newImage: GalleryImage = {
      id: galleryImages.length > 0 ? Math.max(...galleryImages.map(img => img.id)) + 1 : 1,
      url: newImageUrl,
      alt: newImageAlt || `Fellers Resources heavy towing equipment ${galleryImages.length + 1}`,
      order: galleryImages.length + 1
    };

    setGalleryImages([...galleryImages, newImage]);
    setNewImageUrl("");
    setNewImageAlt("");

    toast({
      title: "Success",
      description: "Image added successfully",
    });
  };

  const handleRemoveImage = (id: number) => {
    setImageToDelete(id);
  };

  const confirmDelete = () => {
    if (imageToDelete !== null) {
      const updatedImages = galleryImages.filter(img => img.id !== imageToDelete);
      
      // Update order values
      const reorderedImages = updatedImages.map((img, index) => ({
        ...img,
        order: index + 1
      }));
      
      setGalleryImages(reorderedImages);
      setImageToDelete(null);

      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const newImages = [...galleryImages];
    const temp = newImages[index];
    newImages[index] = newImages[index - 1];
    newImages[index - 1] = temp;
    
    // Update order values
    newImages.forEach((img, idx) => {
      img.order = idx + 1;
    });
    
    setGalleryImages(newImages);
  };

  const handleMoveDown = (index: number) => {
    if (index === galleryImages.length - 1) return;
    
    const newImages = [...galleryImages];
    const temp = newImages[index];
    newImages[index] = newImages[index + 1];
    newImages[index + 1] = temp;
    
    // Update order values
    newImages.forEach((img, idx) => {
      img.order = idx + 1;
    });
    
    setGalleryImages(newImages);
  };

  const handleUpdateAlt = (id: number, newAlt: string) => {
    const updatedImages = galleryImages.map(img => 
      img.id === id ? { ...img, alt: newAlt } : img
    );
    setGalleryImages(updatedImages);
  };

  return (
    <div className="space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Enter image URL"
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

      <Card>
        <CardHeader>
          <CardTitle>Manage Gallery Images ({galleryImages.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
                <TableRow key={image.id}>
                  <TableCell>
                    <div className="w-16 h-16 relative">
                      <img 
                        src={image.url} 
                        alt={image.alt} 
                        className="object-cover w-full h-full rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Error";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {image.url}
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={image.alt} 
                      onChange={(e) => handleUpdateAlt(image.id, e.target.value)}
                    />
                  </TableCell>
                  <TableCell>{image.order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleMoveDown(index)}
                        disabled={index === galleryImages.length - 1}
                      >
                        ↓
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleRemoveImage(image.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
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
    </div>
  );
};

export default AdminGallery;
