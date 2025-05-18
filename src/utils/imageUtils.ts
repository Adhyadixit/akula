/**
 * Utility functions for handling images
 */

/**
 * Converts a File object to a Base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Validates an image file
 * @returns An error message if invalid, null if valid
 */
export const validateImage = (file: File): string | null => {
  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    return 'Please select an image file (JPEG, PNG, etc.)';
  }
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return 'Image size should be less than 5MB';
  }
  
  return null;
};

/**
 * Resizes an image and returns it as a base64 string
 * @param file The image file to resize
 * @param maxWidth Maximum width in pixels (default: 1200)
 * @param maxHeight Maximum height in pixels (default: 1200)
 * @param quality JPEG quality (0-1) (default: 0.8)
 * @returns Promise resolving to a base64 string of the resized image
 */
export const resizeImage = async (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64
      const base64 = canvas.toDataURL(file.type, quality);
      resolve(base64);
      
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };
  });
};
