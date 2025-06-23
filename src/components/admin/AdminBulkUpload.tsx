
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useBulkImageUpload } from '@/hooks/useBulkImageUpload';
import ImageUploadArea from './image-upload/ImageUploadArea';
import ImagePreviewGrid from './image-upload/ImagePreviewGrid';
import SavedImagesGrid from './image-upload/SavedImagesGrid';

const AdminBulkUpload = () => {
  const {
    uploadedImages,
    savedImages,
    isUploading,
    handleFileChange,
    handleRemoveImage,
    handleRemoveSavedImage,
    handleDownloadImage,
    handleBulkUpload
  } = useBulkImageUpload();

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bulk Image Upload</h1>
        <p className="text-gray-300">Upload multiple images to the gallery at once</p>
      </div>

      <Card className="bg-fellers-darkBackground border border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl">Upload New Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUploadArea onFileChange={handleFileChange} />
          
          <Button 
            onClick={handleBulkUpload}
            disabled={uploadedImages.length === 0 || isUploading}
            className="w-full admin-btn-primary py-3 text-lg font-medium"
          >
            {isUploading ? 'Processing...' : `Upload ${uploadedImages.length} Images`}
          </Button>
          
          <ImagePreviewGrid 
            images={uploadedImages} 
            title="Selected Images" 
            onRemove={handleRemoveImage} 
          />
        </CardContent>
      </Card>
      
      {savedImages.length > 0 && (
        <Card className="bg-fellers-darkBackground border border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-xl">
              Saved Images ({savedImages.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <SavedImagesGrid 
              images={savedImages}
              onDownload={handleDownloadImage}
              onRemove={handleRemoveSavedImage}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminBulkUpload;
