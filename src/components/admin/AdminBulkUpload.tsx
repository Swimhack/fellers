
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useBulkImageUpload } from '@/hooks/useBulkImageUpload';
import { getStorageStats } from '@/utils/imageCompressionUtils';
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

  const storageStats = getStorageStats();

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bulk Image Upload</h1>
        <p className="text-gray-300">Upload multiple images to the gallery at once</p>
      </div>

      {/* Storage Usage Information */}
      <Card className="bg-fellers-darkBackground border border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl">Storage Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Usage:</span>
              <span className={`font-medium ${
                storageStats.usagePercentage > 80 ? 'text-red-400' : 
                storageStats.usagePercentage > 60 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {storageStats.usagePercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  storageStats.usagePercentage > 80 ? 'bg-red-500' :
                  storageStats.usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${storageStats.usagePercentage}%` }}
              />
            </div>
            <div className="text-sm text-gray-400">
              {Math.round(storageStats.totalSize / 1024 / 1024 * 100) / 100} MB used of ~5 MB limit
            </div>
            {storageStats.usagePercentage > 80 && (
              <div className="text-sm text-red-400">
                ⚠️ Storage nearly full. Consider clearing old images before uploading more.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-fellers-darkBackground border border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl">Upload New Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUploadArea onFileChange={handleFileChange} />
          
          {uploadedImages.length > 0 && (
            <div className="text-sm text-gray-400">
              📦 Images will be compressed to optimize storage usage
            </div>
          )}
          
          <Button 
            onClick={handleBulkUpload}
            disabled={uploadedImages.length === 0 || isUploading}
            className="w-full admin-btn-primary py-3 text-lg font-medium"
          >
            {isUploading ? 'Processing & Compressing...' : `Upload ${uploadedImages.length} Images`}
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
