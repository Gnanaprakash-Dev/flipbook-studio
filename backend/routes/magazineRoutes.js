import express from 'express';
import {
  createMagazine,
  getMagazineById,
  getMagazineByShareId,
  updateMagazine,
  deleteMagazine,
  getAllMagazines,
  getMagazineStatus,
} from '../controllers/magazineController.js';
import { uploadPDF, handleUploadError } from '../middleware/upload.js';

/**
 * Magazine Routes
 *
 * Express Router groups related routes together.
 * This keeps server.js clean and organized.
 *
 * RESTful API Design:
 * - GET    /magazines        → List all
 * - POST   /magazines        → Create new
 * - GET    /magazines/:id    → Get one
 * - PUT    /magazines/:id    → Update one
 * - DELETE /magazines/:id    → Delete one
 */
const router = express.Router();

/**
 * @route   GET /api/magazines
 * @desc    Get all magazines (paginated)
 * @query   page, limit
 */
router.get('/', getAllMagazines);

/**
 * @route   POST /api/magazines/upload
 * @desc    Upload PDF and create magazine
 * @body    FormData with 'pdf' field
 *
 * Middleware chain:
 * 1. uploadPDF - Multer processes the file
 * 2. handleUploadError - Catches multer errors
 * 3. createMagazine - Controller logic
 */
router.post('/upload', uploadPDF, handleUploadError, createMagazine);

/**
 * @route   GET /api/magazines/share/:shareId
 * @desc    Get magazine by share ID (public viewing)
 * @example GET /api/magazines/share/abc123xyz
 *
 * Note: This route MUST come before /:id
 * Otherwise "share" would be interpreted as an id
 */
router.get('/share/:shareId', getMagazineByShareId);

/**
 * @route   GET /api/magazines/:id
 * @desc    Get magazine by MongoDB ObjectId
 * @example GET /api/magazines/507f1f77bcf86cd799439011
 */
router.get('/:id', getMagazineById);

/**
 * @route   GET /api/magazines/:id/status
 * @desc    Check processing status
 * @example GET /api/magazines/507f1f77bcf86cd799439011/status
 */
router.get('/:id/status', getMagazineStatus);

/**
 * @route   PUT /api/magazines/:id
 * @desc    Update magazine name or config
 * @body    { name?: string, config?: object }
 */
router.put('/:id', updateMagazine);

/**
 * @route   DELETE /api/magazines/:id
 * @desc    Delete magazine and all files
 */
router.delete('/:id', deleteMagazine);

export default router;
