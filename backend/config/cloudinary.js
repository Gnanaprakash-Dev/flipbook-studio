import { v2 as cloudinary } from 'cloudinary';

/**
 * Configure Cloudinary SDK
 * Called after dotenv loads environment variables
 */
export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

/**
 * Test Cloudinary connection
 */
export const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    if (result.status === 'ok') {
      console.log('✅ Cloudinary Connected');
      return true;
    }
  } catch (error) {
    console.error('❌ Cloudinary Connection Error:', error.message);
    return false;
  }
};

export default cloudinary;
