
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [enlargedImage, setEnlargedImage] = useState<GalleryImage | null>(null);
  const { toast } = useToast();

  // Helper function to trigger gallery update events
  const triggerGalleryUpdate = () => {
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('galleryImagesUpdated'));
    console.log('Gallery update event triggered');
  };

  useEffect(() => {
    // Check if we have saved images in localStorage
    const savedImages = localStorage.getItem('galleryImages');
    if (savedImages) {
      setGalleryImages(JSON.parse(savedImages));
    } else {
      // Start with empty gallery - admin needs to upload images
      setGalleryImages([]);
    }
  }, []);

  // Save changes to localStorage whenever gallery images change
  useEffect(() => {
    localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
    triggerGalleryUpdate();
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
      description: "Image added successfully and updated on front-end",
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
        description: "Image removed successfully and updated on front-end",
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

    toast({
      title: "Success",
      description: "Image order updated on front-end",
    });
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

    toast({
      title: "Success",
      description: "Image order updated on front-end",
    });
  };

  const handleUpdateAlt = (id: number, newAlt: string) => {
    const updatedImages = galleryImages.map(img => 
      img.id === id ? { ...img, alt: newAlt } : img
    );
    setGalleryImages(updatedImages);
  };

  const handleImageClick = (image: GalleryImage) => {
    setEnlargedImage(image);
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
                  <TableRow key={image.id}>
                    <TableCell>
                      <div 
                        className="w-16 h-16 relative cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(image)}
                      >
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
          )}
        </CardContent>
      </Card>

      {/* Image Enlargement Dialog */}
      <Dialog open={enlargedImage !== null} onOpenChange={() => setEnlargedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{enlargedImage?.alt || 'Gallery Image'}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {enlargedImage && (
              <img 
                src={enlargedImage.url} 
                alt={enlargedImage.alt}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/400?text=Error+Loading+Image";
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

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

  function handleAddImage() {
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
      description: "Image added successfully and updated on front-end",
    });
  }

  function handleRemoveImage(id: number) {
    setImageToDelete(id);
  }

  function confirmDelete() {
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
        description: "Image removed successfully and updated on front-end",
      });
    }
  }

  function handleMoveUp(index: number) {
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

    toast({
      title: "Success",
      description: "Image order updated on front-end",
    });
  }

  function handleMoveDown(index: number) {
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

    toast({
      title: "Success",
      description: "Image order updated on front-end",
    });
  }

  function handleUpdateAlt(id: number, newAlt: string) {
    const updatedImages = galleryImages.map(img => 
      img.id === id ? { ...img, alt: newAlt } : img
    );
    setGalleryImages(updatedImages);
  }

  function handleImageClick(image: GalleryImage) {
    setEnlargedImage(image);
  }
};

export default AdminGallery;
