import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useFlipbookStore } from '@/store/flipbook-store'

/**
 * UploadZone Component
 *
 * Handles PDF file upload with:
 * - Drag and drop support
 * - File validation
 * - Upload progress tracking
 * - Error handling
 *
 * Now uses backend API instead of client-side processing.
 */

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

interface UploadZoneProps {
  onUploadComplete?: () => void
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadComplete, setUploadComplete] = useState(false)

  const {
    isUploading,
    uploadProgress,
    uploadError,
    setUploadError,
    uploadPdf,
  } = useFlipbookStore()

  /**
   * Validate file before upload
   */
  const validateFile = (file: File): string | null => {
    if (!file.type.includes('pdf')) {
      return 'Please upload a PDF file'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 50MB'
    }
    return null
  }

  /**
   * Handle file upload
   */
  const handleUpload = useCallback(
    async (file: File) => {
      setSelectedFile(file)
      setUploadError(null)
      setUploadComplete(false)

      try {
        // Upload to backend
        await uploadPdf(file)

        // Show success state briefly
        setUploadComplete(true)

        // Navigate after short delay
        setTimeout(() => {
          onUploadComplete?.()
        }, 500)
      } catch (error) {
        // Error is already set in store
        console.error('Upload error:', error)
      }
    },
    [uploadPdf, setUploadError, onUploadComplete]
  )

  /**
   * Drag event handlers
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        const error = validateFile(file)
        if (error) {
          setUploadError(error)
          return
        }
        handleUpload(file)
      }
    },
    [handleUpload, setUploadError]
  )

  /**
   * File input change handler
   */
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const error = validateFile(file)
        if (error) {
          setUploadError(error)
          return
        }
        handleUpload(file)
      }
    },
    [handleUpload, setUploadError]
  )

  const isWorking = isUploading

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300',
          'bg-[#0a0a0f]/60 backdrop-blur-xl',
          isDragging
            ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.3)]'
            : 'border-blue-500/30 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]',
          isWorking && 'pointer-events-none'
        )}
        style={{
          boxShadow: isDragging
            ? '0 0 40px rgba(59, 130, 246, 0.3), inset 0 0 60px rgba(59, 130, 246, 0.05)'
            : '0 0 20px rgba(139, 92, 246, 0.1), inset 0 0 40px rgba(139, 92, 246, 0.02)'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Hidden file input */}
        {!uploadError && (
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className={cn(
              "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
              isWorking && "pointer-events-none"
            )}
            disabled={isWorking}
          />
        )}

        <AnimatePresence mode="wait">
          {/* Uploading State */}
          {isWorking && !uploadComplete ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                <div className="absolute inset-0 w-12 h-12 bg-blue-500/20 blur-xl rounded-full" />
              </div>
              <div className="text-center">
                <p className="font-medium text-white">
                  Uploading & Processing...
                </p>
                {selectedFile && (
                  <p className="text-sm text-blue-200/60 mt-1">
                    {selectedFile.name}
                  </p>
                )}
                <p className="text-xs text-purple-300/50 mt-2">
                  This may take a moment for large PDFs
                </p>
              </div>
              <div className="w-full max-w-xs">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-purple-300/50 text-center mt-2">
                  {uploadProgress}% uploaded
                </p>
              </div>
            </motion.div>

          /* Success State */
          ) : uploadComplete ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <CheckCircle className="w-12 h-12 text-green-400" />
                <div className="absolute inset-0 w-12 h-12 bg-green-500/20 blur-xl rounded-full" />
              </div>
              <div className="text-center">
                <p className="font-medium text-green-400">Upload Complete!</p>
                <p className="text-sm text-blue-200/60 mt-1">
                  Redirecting to viewer...
                </p>
              </div>
            </motion.div>

          /* Error State */
          ) : uploadError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col items-center gap-4"
            >
              <div className="relative">
                <AlertCircle className="w-12 h-12 text-red-400" />
                <div className="absolute inset-0 w-12 h-12 bg-red-500/20 blur-xl rounded-full" />
              </div>
              <div className="text-center">
                <p className="font-medium text-red-400">{uploadError}</p>
                <p className="text-sm text-blue-200/60 mt-1">
                  Please try again with a valid PDF file
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:border-blue-500/50"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setUploadError(null)
                  setSelectedFile(null)
                }}
              >
                Try Again
              </Button>
            </motion.div>

          /* Default Upload State */
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ y: isDragging ? -5 : 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative"
              >
                <Upload className="w-12 h-12 text-blue-400" />
                <div className="absolute inset-0 w-12 h-12 bg-blue-500/20 blur-xl rounded-full" />
              </motion.div>
              <div className="text-center">
                <p className="font-medium text-white">
                  Drag and drop your PDF here
                </p>
                <p className="text-sm text-blue-200/60 mt-1">
                  or click to browse files
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-300/50">
                <FileText className="w-4 h-4" />
                <span>PDF files up to 50MB</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
