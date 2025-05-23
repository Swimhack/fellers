import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload, Image } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface UploadedImage {
  id: number;
  file: File;
  preview: string;
}

const AdminBulkUpload = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    const newImages: UploadedImage[] = [];
    
    newFiles.forEach(file => {
      // Only process image files
      if (!file.type.startsWith('image/')) return;
      
      const preview = URL.createObjectURL(file);
      newImages.push({
        id: Date.now() + Math.random(),
        file,
        preview
      });
    });

    setUploadedImages(prev => [...prev, ...newImages]);
    // Reset the input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (id: number) => {
    setUploadedImages(prev => {
      const filtered = prev.filter(image => image.id !== id);
      // Revoke object URL to avoid memory leaks
      const imageToRemove = prev.find(image => image.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return filtered;
    });
  };

  const handleBulkUpload = () => {
    if (uploadedImages.length === 0) {
      toast.error("No images to upload", {
        description: "Please select at least one image to upload.",
      });
      return;
    }

    setIsUploading(true);

    // In a real application, you would upload the files to your server or cloud storage
    // For now, we'll simulate the upload and store in localStorage
    setTimeout(() => {
      // Get existing gallery images from localStorage
      const savedImagesString = localStorage.getItem('galleryImages');
      let galleryImages = [];
      
      if (savedImagesString) {
        try {
          galleryImages = JSON.parse(savedImagesString);
        } catch (error) {
          console.error("Error parsing gallery images:", error);
        }
      }

      // Get the next ID
      const nextId = galleryImages.length > 0 
        ? Math.max(...galleryImages.map((img: any) => img.id)) + 1 
        : 1;
      
      // Create object URLs for the uploaded images
      // In a real app, you would upload these to a server and use the returned URLs
      const newGalleryImages = uploadedImages.map((img, index) => ({
        id: nextId + index,
        url: img.preview,
        alt: `Uploaded image ${nextId + index}`,
        order: galleryImages.length + index + 1
      }));
      
      // Add new images to gallery
      const updatedGallery = [...galleryImages, ...newGalleryImages];
      localStorage.setItem('galleryImages', JSON.stringify(updatedGallery));
      
      setIsUploading(false);
      toast.success(`Successfully processed ${uploadedImages.length} images`);
      
      // Clear uploaded images but don't revoke URLs since we're using them
      setUploadedImages([]);
    }, 1500);
  };

  return (
    <div className="space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Image Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label 
                htmlFor="image-upload" 
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="w-12 h-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Click to select images or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, GIF</p>
              </label>
            </div>
            
            <Button 
              onClick={handleBulkUpload}
              disabled={uploadedImages.length === 0 || isUploading}
              className="w-full bg-fellers-green hover:bg-fellers-green/90"
            >
              {isUploading ? 'Processing...' : `Upload ${uploadedImages.length} Images`}
            </Button>
          </div>
          
          {uploadedImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Selected Images ({uploadedImages.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-video rounded-md overflow-hidden border border-gray-200">
                      <img 
                        src={image.preview} 
                        alt={`Preview ${image.file.name}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveImage(image.id)}
                      className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="sr-only">Remove</span>
                      &times;
                    </button>
                    <p className="text-xs text-gray-500 truncate mt-1">{image.file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBulkUpload;
