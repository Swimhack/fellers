
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, AlertTriangle } from 'lucide-react';
import { useBulkImageUpload } from '@/hooks/useBulkImageUpload';
import { StorageManager } from '@/utils/storageManager';
import { toast } from 'sonner';
import ImageUploadArea from './image-upload/ImageUploadArea';
import ImagePreviewGrid from './image-upload/ImagePreviewGrid';
import SavedImagesGrid from './image-upload/SavedImagesGrid';

const AdminBulkUpload = () => {
  const {
    uploadedImages,
    savedImages,
    isUploading,
    uploadProgress,
    handleFileChange,
    handleRemoveImage,
    handleRemoveSavedImage,
    handleDownloadImage,
    handleBulkUpload
  } = useBulkImageUpload();

  const storageStats = StorageManager.getStorageStats();

  const handleClearAllImages = () => {
    if (window.confirm('Are you sure you want to clear all images? This action cannot be undone.')) {
      StorageManager.clearAllImages();
      toast.success('All images cleared successfully');
      window.location.reload();
    }
  };

  const handleCleanupOldImages = () => {
    const removedCount = StorageManager.cleanupOldImages();
    if (removedCount > 0) {
      toast.success(`Cleaned up ${removedCount} old images`);
      window.location.reload();
    } else {
      toast.info('No old images to clean up');
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bulk Image Upload</h1>
        <p className="text-gray-300">Upload multiple images to the gallery at once</p>
      </div>

      {/* Storage Usage Information */}
      <Card className="bg-fellers-darkBackground border border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl flex items-center gap-2">
            Storage Usage
            {storageStats.usagePercentage > 80 && (
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
              {Math.round(storageStats.used / 1024 / 1024 * 100) / 100} MB used of {Math.round(storageStats.total / 1024 / 1024 * 100) / 100} MB
            </div>
            {storageStats.usagePercentage > 80 && (
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCleanupOldImages}
                  className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cleanup Old Images
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAllImages}
                  className="text-red-400 border-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Images
                </Button>
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
            {isUploading ? (
              <span className="flex items-center gap-2">
                Processing... {uploadProgress > 0 && `${uploadProgress}%`}
              </span>
            ) : (
              `Upload ${uploadedImages.length} Images`
            )}
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
