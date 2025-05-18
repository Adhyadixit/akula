import React, { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { fileToBase64, validateImage, resizeImage } from "@/utils/imageUtils";
import { Button } from "@/components/ui/button";

interface BasicImageUploadProps {
  onChange: (base64: string | null) => void;
  value?: string | null;
  className?: string;
}

export function BasicImageUpload({
  onChange,
  value,
  className = ""
}: BasicImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous error
    setError(null);
    setLoading(true);

    try {
      // Validate file
      const validationError = validateImage(file);
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      // Resize image and get base64 string
      const base64Data = await resizeImage(file);
      setPreview(base64Data);
      onChange(base64Data);
    } catch (err) {
      console.error("Failed to process image:", err);
      setError("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setError(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {preview ? (
        <div className="relative h-52 w-full overflow-hidden rounded-md border border-gray-300">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-2 rounded-full bg-gray-800 p-1 text-white opacity-80 hover:opacity-100"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          className="flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
        >
          {loading ? (
            <div className="text-center">
              <div className="mb-2 animate-spin">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Processing...</p>
            </div>
          ) : (
            <>
              <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500">Click to upload an image</p>
              <p className="mt-1 text-xs text-gray-400">Max size: 5MB</p>
            </>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      
      <div className="mt-2 flex space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileInput}
          disabled={loading}
          size="sm"
        >
          <Upload className="mr-2 h-4 w-4" />
          {preview ? "Change Image" : "Upload Image"}
        </Button>
        
        {preview && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={loading}
            size="sm"
          >
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
