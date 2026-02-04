import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileArchive, FileCode, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
  const { currentProject } = useFlipbookStore()

  const handleExport = async (format: ExportFormat) => {
    if (!currentProject) return

    setSelectedFormat(format)
    setIsExporting(true)
    setExportProgress(0)

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
      setTimeout(() => {
        setIsExporting(false)
        setSelectedFormat(null)
        setExportProgress(0)
      }, 1000)
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
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-background rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Download Flipbook</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {isExporting ? (
              <div className="py-8 space-y-4">
                <div className="flex justify-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium">
                    Generating {selectedFormat?.toUpperCase()} package...
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This may take a moment
                  </p>
                </div>
                <Progress value={exportProgress} className="w-full" />
                <p className="text-xs text-center text-muted-foreground">
                  {Math.round(exportProgress)}%
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Card
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleExport('html')}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileCode className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">HTML Package</h3>
                      <p className="text-sm text-muted-foreground">
                        Download as a single HTML file with embedded assets.
                        Perfect for quick sharing.
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleExport('zip')}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileArchive className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">ZIP Package</h3>
                      <p className="text-sm text-muted-foreground">
                        Download as a ZIP file with HTML, CSS, JS, and images
                        separated. Best for hosting.
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              {currentProject?.totalPages ?? 0} pages •{' '}
              {currentProject?.name ?? 'Untitled'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
