import mongoose from 'mongoose';

/**
 * Page Schema (Sub-document)
 *
 * Each page in a magazine has:
 * - pageNumber: Position in the magazine (1, 2, 3...)
 * - imageUrl: Cloudinary URL for the rendered page image
 * - publicId: Cloudinary public_id (needed for deletion)
 * - width/height: Original dimensions
 */
const PageSchema = new mongoose.Schema({
  pageNumber: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
});

/**
 * Config Schema (Sub-document)
 *
 * Flipbook display settings - matches frontend FlipbookConfig
 */
const ConfigSchema = new mongoose.Schema({
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 500,
  },
  flipAnimation: {
    type: String,
    enum: ['hard', 'soft', 'fade', 'vertical'],
    default: 'soft',
  },
  flipSpeed: {
    type: Number,
    default: 1000,
  },
  showShadow: {
    type: Boolean,
    default: true,
  },
  shadowOpacity: {
    type: Number,
    default: 0.3,
  },
  pageLayout: {
    type: String,
    enum: ['single', 'double'],
    default: 'double',
  },
  backgroundColor: {
    type: String,
    default: '#1a1a2e',
  },
  showPageNumbers: {
    type: Boolean,
    default: true,
  },
  navigationStyle: {
    type: String,
    enum: ['arrows', 'thumbnails', 'both', 'none'],
    default: 'both',
  },
  autoPlay: {
    type: Boolean,
    default: false,
  },
  autoPlayInterval: {
    type: Number,
    default: 3000,
  },
});

/**
 * Magazine Schema (Main Document)
 *
 * This is the main collection that stores flipbook data
 */
const MagazineSchema = new mongoose.Schema(
  {
    // Display name of the magazine
    name: {
      type: String,
      required: [true, 'Magazine name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    // Short unique ID for sharing (e.g., "abc123")
    // Using nanoid to generate 10-character IDs
    shareId: {
      type: String,
      required: true,
      unique: true, // unique: true automatically creates an index
    },

    // Original PDF stored in Cloudinary
    pdfUrl: {
      type: String,
      default: null,
    },
    pdfPublicId: {
      type: String,
      default: null,
    },

    // Array of page sub-documents
    pages: [PageSchema],

    // Total number of pages (denormalized for quick access)
    totalPages: {
      type: Number,
      default: 0,
    },

    // Flipbook configuration
    config: {
      type: ConfigSchema,
      default: () => ({}),
    },

    // Processing status
    status: {
      type: String,
      enum: ['processing', 'ready', 'failed'],
      default: 'processing',
    },

    // Error message if processing failed
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

/**
 * Indexes for better query performance
 * Note: shareId already has index via unique: true
 */
MagazineSchema.index({ createdAt: -1 });

/**
 * Virtual property: Generate full share URL
 * Virtual = computed property, not stored in database
 */
MagazineSchema.virtual('shareUrl').get(function () {
  return `${process.env.FRONTEND_URL}/view/${this.shareId}`;
});

/**
 * Transform output when converting to JSON
 * - Include virtuals
 * - Remove internal fields
 */
MagazineSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Create and export the model
// Model name 'Magazine' → MongoDB collection 'magazines'
const Magazine = mongoose.model('Magazine', MagazineSchema);

export default Magazine;
