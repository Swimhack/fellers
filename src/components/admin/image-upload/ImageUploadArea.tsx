
import React, { useRef } from 'react';
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UploadedImage } from "@/utils/imageHandlerUtils";

interface ImageUploadAreaProps {
  onFileChange: (files: File[]) => void;
}

const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({ onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    onFileChange(newFiles);
    
    // Reset the input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center">
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
        <Upload className="w-12 h-12 text-gray-300" />
        <p className="mt-2 text-sm text-gray-300">Click to select images or drag and drop</p>
        <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, GIF</p>
      </label>
    </div>
  );
};

export default ImageUploadArea;
