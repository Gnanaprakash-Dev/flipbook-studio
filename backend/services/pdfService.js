import pdf from 'pdf-parse/lib/pdf-parse.js';
import fs from 'fs/promises';

/**
 * PDF Service (Simple Version)
 *
 * Uses pdf-parse to get page count.
 * Cloudinary handles the actual PDF → Image conversion!
 *
 * How it works:
 * 1. Upload PDF to Cloudinary
 * 2. Cloudinary can serve any page as an image via URL transformation
 *    Example: /pg_1/ in URL = page 1 as image
 */

/**
 * Get PDF page count
 *
 * @param {string} pdfPath - Path to PDF file
 * @returns {Promise<number>} - Number of pages
 */
export const getPdfPageCount = async (pdfPath) => {
  try {
    const dataBuffer = await fs.readFile(pdfPath);
    const data = await pdf(dataBuffer);
    return data.numpages;
  } catch (error) {
    console.error('Error getting PDF page count:', error);
    throw new Error('Failed to read PDF: ' + error.message);
  }
};

/**
 * Get PDF metadata
 *
 * @param {string} pdfPath - Path to PDF file
 * @returns {Promise<Object>} - PDF info
 */
export const getPdfInfo = async (pdfPath) => {
  try {
    const dataBuffer = await fs.readFile(pdfPath);
    const data = await pdf(dataBuffer);

    return {
      totalPages: data.numpages,
      info: data.info || {},
      metadata: data.metadata || {},
    };
  } catch (error) {
    console.error('Error getting PDF info:', error);
    throw new Error('Failed to read PDF: ' + error.message);
  }
};

/**
 * Generate Cloudinary page URLs
 *
 * Cloudinary can transform PDFs to images on-the-fly!
 * Just add transformation parameters to the URL.
 *
 * @param {string} pdfPublicId - Cloudinary public ID of the PDF
 * @param {string} cloudName - Cloudinary cloud name
 * @param {number} totalPages - Number of pages
 * @param {Object} options - Image options
 * @returns {Array} - Array of page objects with URLs
 */
export const generateCloudinaryPageUrls = (pdfPublicId, cloudName, totalPages, options = {}) => {
  const {
    width = 1200,
    height = 1600,
    quality = 'auto',
    format = 'jpg',
  } = options;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    // Cloudinary URL format for PDF pages:
    // https://res.cloudinary.com/{cloud}/image/upload/pg_{page},w_{width},h_{height},c_limit,q_{quality}/{public_id}.{format}
    const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/pg_${i},w_${width},h_${height},c_limit,q_${quality}/${pdfPublicId}.${format}`;

    pages.push({
      pageNumber: i,
      imageUrl: imageUrl,
      publicId: `${pdfPublicId}_page_${i}`, // Virtual ID for reference
      width: width,
      height: height,
    });
  }

  return pages;
};
