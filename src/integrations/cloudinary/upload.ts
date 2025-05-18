import { cloudinaryConfig } from './config';

/**
 * Uploads an image file to Cloudinary
 * @param file The image file to upload
 * @returns Promise with the upload result containing the image URL
 */
export const uploadImage = async (file: File): Promise<{ url: string; publicId: string }> => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('cloud_name', cloudinaryConfig.cloudName);
    
    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

/**
 * Deletes an image from Cloudinary
 * @param publicId The public ID of the image to delete
 * @returns Promise with the deletion result
 */
export const deleteImage = async (publicId: string): Promise<boolean> => {
  try {
    // In a real production app, you would typically call your backend API
    // to handle deletion with proper authentication
    // This is a simplified example
    console.log(`Image with public ID ${publicId} would be deleted in production`);
    return true;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};
