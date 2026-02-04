import { nanoid } from 'nanoid';

/**
 * Helper Utilities
 *
 * Small, reusable functions used throughout the app.
 * Keep these pure (no side effects) when possible.
 */

/**
 * Generate a short unique ID for share links
 *
 * Using nanoid instead of MongoDB ObjectId because:
 * 1. Shorter (10 chars vs 24)
 * 2. URL-safe characters
 * 3. Still collision-resistant
 *
 * @param {number} length - ID length (default: 10)
 * @returns {string} - Unique ID like "V1StGXR8_Z"
 */
export const generateShareId = (length = 10) => {
  return nanoid(length);
};

/**
 * Format file size for display
 *
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted string like "2.5 MB"
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Sanitize filename
 *
 * Remove special characters that might cause issues.
 *
 * @param {string} filename - Original filename
 * @returns {string} - Sanitized filename
 */
export const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_') // Replace special chars with underscore
    .replace(/_+/g, '_') // Collapse multiple underscores
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .toLowerCase();
};

/**
 * Extract name from filename
 *
 * "my-document.pdf" → "my-document"
 *
 * @param {string} filename - Full filename with extension
 * @returns {string} - Name without extension
 */
export const getNameFromFilename = (filename) => {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return filename;
  return filename.substring(0, lastDot);
};

/**
 * Create async handler wrapper
 *
 * Wraps async route handlers to automatically catch errors
 * and pass them to Express error handler.
 *
 * Without this, you'd need try/catch in every async handler.
 *
 * Usage:
 * router.get('/', asyncHandler(async (req, res) => { ... }))
 *
 * @param {Function} fn - Async function
 * @returns {Function} - Wrapped function
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Sleep/delay utility
 *
 * Useful for rate limiting or testing.
 *
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Validate MongoDB ObjectId format
 *
 * @param {string} id - String to validate
 * @returns {boolean}
 */
export const isValidObjectId = (id) => {
  return /^[a-fA-F0-9]{24}$/.test(id);
};
