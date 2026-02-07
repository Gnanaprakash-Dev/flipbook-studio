import Magazine from '../models/Magazine.js';
import { uploadPDF, deleteFile } from '../services/cloudinaryService.js';
import { getPdfPageCount, generateCloudinaryPageUrls } from '../services/pdfService.js';
import { generateShareId, getNameFromFilename, asyncHandler } from '../utils/helpers.js';
import { cleanupFile } from '../middleware/upload.js';

/**
 * Magazine Controller
 *
 * Now uses Cloudinary's built-in PDF-to-image transformation!
 * No native dependencies needed.
 *
 * How it works:
 * 1. Upload PDF to Cloudinary
 * 2. Get page count using pdf-parse
 * 3. Generate Cloudinary URLs with pg_N transformation
 * 4. Cloudinary converts pages to images on-the-fly when accessed
 */

/**
 * @route   POST /api/magazines/upload
 * @desc    Upload PDF and create new magazine
 * @access  Public
 */
export const createMagazine = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No PDF file uploaded',
    });
  }

  const { path: filePath, originalname } = req.file;

  try {
    // 1. Generate unique share ID
    const shareId = generateShareId();
    console.log('📄 Processing:', originalname);

    // 2. Get PDF page count
    console.log('📊 Getting page count...');
    const totalPages = await getPdfPageCount(filePath);
    console.log(`   Found ${totalPages} pages`);

    // 3. Create magazine document
    const magazine = await Magazine.create({
      name: getNameFromFilename(originalname),
      shareId: shareId,
      status: 'processing',
      totalPages: totalPages,
    });

    console.log(`📚 Created magazine: ${magazine._id}`);

    // 4. Upload PDF to Cloudinary
    console.log('☁️  Uploading PDF to Cloudinary...');
    const pdfResult = await uploadPDF(filePath, `flipbook/${magazine._id}`);
    console.log('   PDF uploaded:', pdfResult.publicId);

    magazine.pdfUrl = pdfResult.url;
    magazine.pdfPublicId = pdfResult.publicId;

    // 5. Generate page URLs using Cloudinary transformations
    // Cloudinary will convert PDF pages to images on-the-fly!
    console.log('🖼️  Generating page URLs...');
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const pages = generateCloudinaryPageUrls(
      pdfResult.publicId,
      cloudName,
      totalPages,
      {
        width: 1200,
        height: 1600,
        quality: 'auto',
        format: 'jpg',
      }
    );

    // 6. Update magazine
    magazine.pages = pages;
    magazine.status = 'ready';
    await magazine.save();

    console.log('✅ Magazine ready!');

    // 7. Cleanup temp file
    await cleanupFile(filePath);

    // 8. Send response
    res.status(201).json({
      success: true,
      data: magazine,
    });
  } catch (error) {
    await cleanupFile(filePath);
    console.error('❌ Error:', error.message);

    res.status(500).json({
      success: false,
      error: 'Failed to process PDF: ' + error.message,
    });
  }
});

/**
 * @route   GET /api/magazines/:id
 * @desc    Get magazine by MongoDB ObjectId
 * @access  Public
 */
export const getMagazineById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const magazine = await Magazine.findById(id);

  if (!magazine) {
    return res.status(404).json({
      success: false,
      error: 'Magazine not found',
    });
  }

  res.json({
    success: true,
    data: magazine,
  });
});

/**
 * @route   GET /api/magazines/share/:shareId
 * @desc    Get magazine by share ID (for public viewing)
 * @access  Public
 */
export const getMagazineByShareId = asyncHandler(async (req, res) => {
  const { shareId } = req.params;

  const magazine = await Magazine.findOne({ shareId });

  if (!magazine) {
    return res.status(404).json({
      success: false,
      error: 'Magazine not found',
    });
  }

  if (magazine.status !== 'ready') {
    return res.status(404).json({
      success: false,
      error: 'Magazine is still processing',
      status: magazine.status,
    });
  }

  res.json({
    success: true,
    data: magazine,
  });
});

/**
 * @route   PUT /api/magazines/:id
 * @desc    Update magazine (name, config)
 * @access  Public
 */
export const updateMagazine = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, config } = req.body;

  const magazine = await Magazine.findById(id);

  if (!magazine) {
    return res.status(404).json({
      success: false,
      error: 'Magazine not found',
    });
  }

  if (name !== undefined) {
    magazine.name = name;
  }

  if (config !== undefined) {
    magazine.config = {
      ...magazine.config.toObject(),
      ...config,
    };
  }

  await magazine.save();

  res.json({
    success: true,
    data: magazine,
  });
});

/**
 * @route   DELETE /api/magazines/:id
 * @desc    Delete magazine and all associated files
 * @access  Public
 */
export const deleteMagazine = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const magazine = await Magazine.findById(id);

  if (!magazine) {
    return res.status(404).json({
      success: false,
      error: 'Magazine not found',
    });
  }

  console.log(`🗑️  Deleting magazine: ${magazine.name}`);

  // Delete PDF from Cloudinary
  if (magazine.pdfPublicId) {
    console.log('   Deleting PDF from Cloudinary...');
    await deleteFile(magazine.pdfPublicId, 'raw');
  }

  // Delete from database
  await Magazine.findByIdAndDelete(id);

  console.log('✅ Magazine deleted');

  res.json({
    success: true,
    message: 'Magazine deleted successfully',
  });
});

/**
 * @route   GET /api/magazines
 * @desc    Get all magazines (with pagination)
 * @access  Public
 */
export const getAllMagazines = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [magazines, total] = await Promise.all([
    Magazine.find({ status: 'ready' })
      .select('name shareId totalPages createdAt updatedAt config.backgroundColor pages')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Magazine.countDocuments({ status: 'ready' }),
  ]);

  // Add thumbnail (first page URL)
  const magazinesWithThumbnails = magazines.map((mag) => ({
    ...mag,
    thumbnail: mag.pages?.[0]?.imageUrl || null,
    pages: undefined,
  }));

  res.json({
    success: true,
    data: magazinesWithThumbnails,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
});

/**
 * @route   GET /api/magazines/:id/status
 * @desc    Check processing status
 * @access  Public
 */
export const getMagazineStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const magazine = await Magazine.findById(id).select(
    'status totalPages errorMessage name shareId'
  );

  if (!magazine) {
    return res.status(404).json({
      success: false,
      error: 'Magazine not found',
    });
  }

  res.json({
    success: true,
    data: {
      id: magazine._id,
      name: magazine.name,
      shareId: magazine.shareId,
      status: magazine.status,
      totalPages: magazine.totalPages,
      errorMessage: magazine.errorMessage,
    },
  });
});
