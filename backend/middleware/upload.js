import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * Multer Middleware
 *
 * Multer is Express middleware for handling multipart/form-data,
 * which is the encoding type used for file uploads.
 *
 * It does NOT handle storing files permanently - it just:
 * 1. Receives the file from the HTTP request
 * 2. Saves it temporarily (disk or memory)
 * 3. Makes file info available to your route handler
 */

// Ensure uploads directory exists
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Storage Configuration
 *
 * diskStorage: Save files to disk
 * - destination: Where to save
 * - filename: What to name the file
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb = callback(error, destination)
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

/**
 * File Filter
 *
 * Control which files are accepted.
 * Reject non-PDF files early (before they're fully uploaded).
 */
const fileFilter = (req, file, cb) => {
  // Check MIME type
  const allowedMimes = ['application/pdf'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only PDF files are allowed'), false); // Reject file
  }
};

/**
 * Create Multer Instance
 *
 * Configure limits to prevent abuse:
 * - fileSize: Max file size in bytes
 * - files: Max number of files per request
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
    files: 1, // Only 1 file at a time
  },
});

/**
 * Export middleware for single PDF upload
 *
 * Usage in routes:
 * router.post('/upload', uploadPDF, controller)
 *
 * The 'pdf' string is the field name in the form data
 */
export const uploadPDF = upload.single('pdf');

/**
 * Error handling middleware for Multer errors
 *
 * Multer errors need special handling.
 * Use this after your route handlers.
 */
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 50MB.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Only 1 file allowed.',
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  if (err) {
    // Custom errors (like our file filter)
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  next();
};

/**
 * Cleanup uploaded file
 *
 * Call this after processing to remove temp file.
 * Important to prevent disk filling up!
 */
export const cleanupFile = async (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('File cleanup error:', error.message);
  }
};

export default upload;
