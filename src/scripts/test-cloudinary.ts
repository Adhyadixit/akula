import { cloudinaryConfig } from '../integrations/cloudinary/config';

/**
 * Test function to verify Cloudinary upload functionality
 * This can be run with ts-node or similar tools
 */
async function testCloudinaryUpload() {
  console.log('Testing Cloudinary upload with the following config:');
  console.log('Cloud Name:', cloudinaryConfig.cloudName);
  console.log('Upload Preset:', cloudinaryConfig.uploadPreset);
  
  try {
    // Create a FormData instance with a test image URL
    // In a real scenario, you would use a File object from an input
    const testImageUrl = 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?q=80&w=500&auto=format&fit=crop';
    
    // Fetch the image as a blob
    console.log('Fetching test image...');
    const imageResponse = await fetch(testImageUrl);
    const imageBlob = await imageResponse.blob();
    
    // Create form data
    const formData = new FormData();
    formData.append('file', imageBlob, 'test-image.jpg');
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('cloud_name', cloudinaryConfig.cloudName);
    
    // Upload to Cloudinary
    console.log('Uploading to Cloudinary...');
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed with status: ${response.status}, ${errorText}`);
    }
    
    const data = await response.json();
    
    console.log('Upload successful!');
    console.log('Image URL:', data.secure_url);
    console.log('Public ID:', data.public_id);
    console.log('Full response:', JSON.stringify(data, null, 2));
    
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id
    };
  } catch (error) {
    console.error('Error during Cloudinary test upload:', error);
    return {
      success: false,
      error
    };
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testCloudinaryUpload()
    .then(result => {
      if (result.success) {
        console.log('✅ Cloudinary upload test passed!');
        process.exit(0);
      } else {
        console.log('❌ Cloudinary upload test failed!');
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Unexpected error:', err);
      process.exit(1);
    });
}

export { testCloudinaryUpload };
