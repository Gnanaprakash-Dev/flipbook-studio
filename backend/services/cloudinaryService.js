import cloudinary from '../config/cloudinary.js';

/**
 * Cloudinary Service
 *
 * Handles file uploads to Cloudinary.
 * PDFs are uploaded as images so Cloudinary can transform pages to images!
 */

/**
 * Upload a PDF file to Cloudinary
 *
 * Important: Upload as 'image' resource_type (not 'raw')
 * This allows Cloudinary to process and transform the PDF.
 *
 * @param {string} filePath - Local path to the PDF file
 * @param {string} folder - Cloudinary folder name
 * @returns {Object} - { url, publicId }
 */
export const uploadPDF = async (filePath, folder = 'flipbook/pdfs') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'image', // 'image' allows PDF transformation!
      format: 'pdf',
      use_filename: true,
      unique_filename: true,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary PDF upload error:', error);
    throw new Error(`Failed to upload PDF: ${error.message}`);
  }
};

/**
 * Upload an image to Cloudinary
 *
 * @param {string} filePath - Local path to the image
 * @param {string} folder - Cloudinary folder
 * @param {Object} options - Upload options
 * @returns {Object} - { url, publicId, width, height }
 */
export const uploadImage = async (filePath, folder = 'flipbook/pages', options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'image',
      quality: 'auto:good',
      fetch_format: 'auto',
      ...options,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Cloudinary image upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Upload image from buffer
 *
 * @param {Buffer} buffer - Image buffer
 * @param {string} folder - Cloudinary folder
 * @param {Object} options - Upload options
 * @returns {Object} - { url, publicId, width, height }
 */
export const uploadImageBuffer = async (buffer, folder = 'flipbook/pages', options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        quality: 'auto:good',
        fetch_format: 'auto',
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Failed to upload: ${error.message}`));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
          });
        }
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Delete a file from Cloudinary
 *
 * @param {string} publicId - Cloudinary public_id
 * @param {string} resourceType - 'image' or 'raw'
 */
export const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

/**
 * Delete multiple files
 *
 * @param {string[]} publicIds - Array of public_ids
 * @param {string} resourceType - 'image' or 'raw'
 */
export const deleteMultipleFiles = async (publicIds, resourceType = 'image') => {
  try {
    if (publicIds.length === 0) return true;
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary bulk delete error:', error);
    return false;
  }
};

/**
 * Generate PDF page image URL
 *
 * Cloudinary can transform PDF pages to images on-the-fly!
 *
 * @param {string} publicId - PDF public_id in Cloudinary
 * @param {number} pageNumber - Page number (1-based)
 * @param {Object} options - Transformation options
 * @returns {string} - Image URL for that page
 */
export const getPdfPageUrl = (publicId, pageNumber, options = {}) => {
  const {
    width = 1200,
    height = 1600,
    quality = 'auto',
    format = 'jpg',
  } = options;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  // Cloudinary transformation: pg_N converts PDF page N to image
  return `https://res.cloudinary.com/${cloudName}/image/upload/pg_${pageNumber},w_${width},h_${height},c_limit,q_${quality}/${publicId}.${format}`;
};
