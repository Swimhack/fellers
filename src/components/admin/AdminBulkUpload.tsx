
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
    <div className="space-y-8">
      <Card className="bg-fellers-darkBackground border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Bulk Image Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ImageUploadArea onFileChange={handleFileChange} />
            
            <Button 
              onClick={handleBulkUpload}
              disabled={uploadedImages.length === 0 || isUploading}
              className="w-full admin-btn-primary"
            >
              {isUploading ? 'Processing...' : `Upload ${uploadedImages.length} Images`}
            </Button>
          </div>
          
          <ImagePreviewGrid 
            images={uploadedImages} 
            title="Selected Images" 
            onRemove={handleRemoveImage} 
          />
        </CardContent>
      </Card>
      
      {savedImages.length > 0 && (
        <Card className="bg-fellers-darkBackground border border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Saved Images ({savedImages.length})</CardTitle>
          </CardHeader>
          <CardContent>
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
