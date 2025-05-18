import React, { useState, useRef } from "react";
import { Button } from "./button";
import { uploadImage } from "@/integrations/cloudinary/upload";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  defaultImage?: string;
  className?: string;
}

export function ImageUpload({ 
  onImageUploaded, 
  defaultImage = "", 
  className = "" 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(defaultImage);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create a local preview
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Upload to Cloudinary
      const result = await uploadImage(file);
      
      // Update with the actual Cloudinary URL
      setPreviewUrl(result.url);
      onImageUploaded(result.url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload image. Please try again.');
      setPreviewUrl(defaultImage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    onImageUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative aspect-video rounded-md overflow-hidden border">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center aspect-video bg-gray-50 hover:bg-gray-100 cursor-pointer"
          onClick={handleButtonClick}
        >
          <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Click to upload an image</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant={previewUrl ? "outline" : "default"}
          onClick={handleButtonClick}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {previewUrl ? "Change Image" : "Upload Image"}
            </>
          )}
        </Button>
        
        {previewUrl && (
          <Button
            type="button"
            variant="outline"
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="text-red-500"
          >
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
