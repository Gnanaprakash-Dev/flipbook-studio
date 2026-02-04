import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileArchive, FileCode, Loader2, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useFlipbookStore } from '@/store/flipbook-store'
import { generateHTMLPackage, generateZipPackage } from '@/lib/export-utils'

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
}

type ExportFormat = 'html' | 'zip'

export function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(null)
  const [exportComplete, setExportComplete] = useState(false)
  const { currentProject } = useFlipbookStore()

  const handleExport = async (format: ExportFormat) => {
    if (!currentProject) return

    setSelectedFormat(format)
    setIsExporting(true)
    setExportProgress(0)
    setExportComplete(false)

    try {
      if (format === 'html') {
        await generateHTMLPackage(currentProject, (progress) =>
          setExportProgress(progress)
        )
      } else {
        await generateZipPackage(currentProject, (progress) =>
          setExportProgress(progress)
        )
      }

      setExportProgress(100)
      setExportComplete(true)

      // Reset after showing success
      setTimeout(() => {
        setIsExporting(false)
        setSelectedFormat(null)
        setExportProgress(0)
        setExportComplete(false)
      }, 2000)
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
      setSelectedFormat(null)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-[#0f0f15] border border-blue-500/20 rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-500/20">
            <h2 className="text-lg font-semibold text-white">Download Flipbook</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {isExporting ? (
              <div className="py-8 space-y-4">
                <div className="flex justify-center">
                  {exportComplete ? (
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  ) : (
                    <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
                  )}
                </div>
                <div className="text-center">
                  <p className="font-medium text-white">
                    {exportComplete
                      ? 'Download Complete!'
                      : `Generating ${selectedFormat?.toUpperCase()} package...`}
                  </p>
                  {!exportComplete && (
                    <p className="text-sm text-blue-200/50 mt-1">
                      Downloading images from cloud...
                    </p>
                  )}
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${exportProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-center text-blue-200/50">
                  {Math.round(exportProgress)}%
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Card
                  className="cursor-pointer bg-white/5 border-blue-500/20 hover:border-blue-500/50 transition-colors"
                  onClick={() => handleExport('html')}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <FileCode className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">HTML Package</h3>
                      <p className="text-sm text-blue-200/50">
                        Single HTML file with embedded images.
                        Perfect for quick sharing.
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-blue-200/50" />
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer bg-white/5 border-purple-500/20 hover:border-purple-500/50 transition-colors"
                  onClick={() => handleExport('zip')}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <FileArchive className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">ZIP Package</h3>
                      <p className="text-sm text-purple-200/50">
                        HTML, CSS, JS, and images separated.
                        Best for web hosting.
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-purple-200/50" />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-blue-500/20 bg-white/5">
            <p className="text-xs text-blue-200/50 text-center">
              {currentProject?.totalPages ?? 0} pages • {currentProject?.name ?? 'Untitled'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
