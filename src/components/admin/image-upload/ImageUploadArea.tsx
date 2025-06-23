
import React, { useRef } from 'react';
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    <div className="border-2 border-dashed border-gray-500 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
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
        className="flex flex-col items-center justify-center cursor-pointer space-y-4"
      >
        <Upload className="w-16 h-16 text-gray-300" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-300">Click to select images or drag and drop</p>
          <p className="text-sm text-gray-400">Supports: JPG, PNG, GIF</p>
        </div>
      </label>
    </div>
  );
};

export default ImageUploadArea;
