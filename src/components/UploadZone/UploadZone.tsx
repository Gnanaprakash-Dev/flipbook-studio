import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, AlertCircle, Loader2, CheckCircle, Sparkles } from 'lucide-react'
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
  onUploadComplete?: (id: string) => void
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // 'idle' → 'uploading' → 'completing' (100% visible) → 'done' (checkmark)
  const [phase, setPhase] = useState<'idle' | 'uploading' | 'completing' | 'done'>('idle')

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
      setPhase('uploading')

      try {
        // Upload to backend — resolves after server finishes processing
        const magazine = await uploadPdf(file)
        const magazineId = magazine.id || magazine._id

        // Show bar at 100% for 1s so the user sees it complete
        setPhase('completing')
        setTimeout(() => {
          setPhase('done')
          // Navigate after showing success briefly
          setTimeout(() => {
            onUploadComplete?.(magazineId)
          }, 600)
        }, 1000)
      } catch (error) {
        setPhase('idle')
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

  const isWorking = isUploading || phase === 'uploading' || phase === 'completing'

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
          {/* Phase: uploading — file sending + server processing */}
          {phase === 'uploading' ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                {uploadProgress >= 95 ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-12 h-12 text-purple-400" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 w-12 h-12 bg-purple-500/20 blur-xl rounded-full"
                    />
                  </>
                ) : (
                  <>
                    <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 bg-blue-500/20 blur-xl rounded-full" />
                  </>
                )}
              </div>
              <div className="text-center">
                <p className="font-medium text-white">
                  {uploadProgress < 95
                    ? 'Uploading your PDF...'
                    : 'Processing pages...'}
                </p>
                {selectedFile && (
                  <p className="text-sm text-blue-200/60 mt-1">
                    {selectedFile.name}
                  </p>
                )}
                <p className="text-xs text-purple-300/50 mt-2">
                  {uploadProgress < 95
                    ? 'Sending file to server'
                    : 'Converting PDF pages — this may take a moment'}
                </p>
              </div>
              <div className="w-full max-w-xs">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
                  {/* Actual progress fill — never reaches 100% until API responds */}
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: uploadProgress >= 95 ? '95%' : `${uploadProgress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                  {/* Shimmer overlay when processing — shows activity without filling bar */}
                  {uploadProgress >= 95 && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.4) 50%, transparent 100%)',
                        backgroundSize: '50% 100%',
                      }}
                      animate={{ backgroundPosition: ['-50% 0%', '150% 0%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </div>
                <p className="text-xs text-purple-300/50 text-center mt-2">
                  {uploadProgress < 95
                    ? `${uploadProgress}% uploaded`
                    : 'Almost there — processing pages...'}
                </p>
              </div>
            </motion.div>

          /* Phase: completing — bar fills to 100%, visible for 1 second */
          ) : phase === 'completing' ? (
            <motion.div
              key="completing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                >
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 w-12 h-12 bg-green-500/20 blur-xl rounded-full"
                />
              </div>
              <p className="font-medium text-green-400">Upload Complete!</p>
              {selectedFile && (
                <p className="text-sm text-blue-200/60">
                  {selectedFile.name}
                </p>
              )}
              <div className="w-full max-w-xs">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                    initial={{ width: '95%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-xs text-green-400/70 text-center mt-2 font-medium">
                  100% — Done!
                </p>
              </div>
            </motion.div>

          /* Phase: done — redirect message */
          ) : phase === 'done' ? (
            <motion.div
              key="done"
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
