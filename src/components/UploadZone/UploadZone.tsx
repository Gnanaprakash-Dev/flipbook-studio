import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useFlipbookStore } from '@/store/flipbook-store'
import { getPDFProcessor, resetPDFProcessor } from '@/lib/pdf-processor'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

interface UploadZoneProps {
  onUploadComplete?: () => void
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    isUploading,
    uploadProgress,
    uploadError,
    isProcessing,
    processingProgress,
    setIsUploading,
    setUploadProgress,
    setUploadError,
    setIsProcessing,
    setProcessingProgress,
    createNewProject,
    setPages,
    updatePage,
  } = useFlipbookStore()

  const validateFile = (file: File): string | null => {
    if (!file.type.includes('pdf')) {
      return 'Please upload a PDF file'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 50MB'
    }
    return null
  }

  const processFile = useCallback(
    async (file: File) => {
      setSelectedFile(file)
      setUploadError(null)
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress (since we're processing locally)
      let currentProgress = 0
      const uploadInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + 10, 90)
        setUploadProgress(currentProgress)
      }, 100)

      try {
        // Create project
        createNewProject(file.name.replace('.pdf', ''), file)

        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        clearInterval(uploadInterval)
        setUploadProgress(100)
        setIsUploading(false)

        // Process PDF
        setIsProcessing(true)
        setProcessingProgress(0)

        resetPDFProcessor()
        const processor = getPDFProcessor({
          onProgress: (progress) => setProcessingProgress(progress),
        })

        // Load document
        const { pages } = await processor.loadDocument(arrayBuffer)
        setPages(pages)

        // Render visible pages (first few)
        const initialPagesToRender = Math.min(6, pages.length)
        for (let i = 1; i <= initialPagesToRender; i++) {
          updatePage(i, { isLoading: true })
          const imageData = await processor.renderPage(i)
          updatePage(i, { imageData, isLoading: false, isRendered: true })
          setProcessingProgress(50 + (i / pages.length) * 50)
        }

        setIsProcessing(false)
        setProcessingProgress(100)
        onUploadComplete?.()
      } catch (error) {
        clearInterval(uploadInterval)
        setIsUploading(false)
        setIsProcessing(false)
        setUploadError(error instanceof Error ? error.message : 'Failed to process PDF')
      }
    },
    [
      createNewProject,
      onUploadComplete,
      setIsProcessing,
      setIsUploading,
      setPages,
      setProcessingProgress,
      setUploadError,
      setUploadProgress,
      updatePage,
    ]
  )

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
        processFile(file)
      }
    },
    [processFile, setUploadError]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const error = validateFile(file)
        if (error) {
          setUploadError(error)
          return
        }
        processFile(file)
      }
    },
    [processFile, setUploadError]
  )

  const isWorking = isUploading || isProcessing
  const progress = isUploading ? uploadProgress : processingProgress

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
          {isWorking ? (
            <motion.div
              key="processing"
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
                  {isUploading ? 'Uploading...' : 'Processing PDF...'}
                </p>
                {selectedFile && (
                  <p className="text-sm text-blue-200/60 mt-1">
                    {selectedFile.name}
                  </p>
                )}
              </div>
              <div className="w-full max-w-xs">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-purple-300/50 text-center mt-2">
                  {Math.round(progress)}%
                </p>
              </div>
            </motion.div>
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
                  e.preventDefault();
                  e.stopPropagation();
                  setUploadError(null);
                }}
              >
                Try Again
              </Button>
            </motion.div>
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
