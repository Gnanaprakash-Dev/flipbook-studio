import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Code, Copy, Link2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFlipbookStore } from '@/store/flipbook-store'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const { currentProject } = useFlipbookStore()

  // Generate shareable URL using the shareId from backend
  const shareUrl = currentProject?.shareId
    ? `${window.location.origin}/view/${currentProject.shareId}`
    : ''

  const embedCode = `<iframe
  src="${shareUrl}"
  width="100%"
  height="600"
  frameborder="0"
  allowfullscreen>
</iframe>`

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
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
            <h2 className="text-lg font-semibold text-white">Share Flipbook</h2>
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
          <div className="p-4">
            <Tabs defaultValue="link">
              <TabsList className="w-full bg-white/5">
                <TabsTrigger value="link" className="flex-1">
                  <Link2 className="w-4 h-4 mr-2" />
                  Link
                </TabsTrigger>
                <TabsTrigger value="embed" className="flex-1">
                  <Code className="w-4 h-4 mr-2" />
                  Embed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="link" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-blue-200/70">Shareable Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="flex-1 bg-white/5 border-blue-500/20 text-white"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleCopy(shareUrl, 'link')}
                      className="border-blue-500/30 hover:bg-blue-500/10"
                    >
                      {copied === 'link' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-blue-200/50">
                    Anyone with this link can view your flipbook
                  </p>
                </div>

                {/* Share ID info */}
                {currentProject?.shareId && (
                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                    <p className="text-xs text-blue-300">
                      <strong>Share ID:</strong> {currentProject.shareId}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="embed" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-blue-200/70">Embed Code</Label>
                  <div className="relative">
                    <pre className="p-3 bg-white/5 border border-blue-500/20 rounded-md text-xs overflow-x-auto text-blue-200/80">
                      {embedCode}
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 border-blue-500/30 hover:bg-blue-500/10"
                      onClick={() => handleCopy(embedCode, 'embed')}
                    >
                      {copied === 'embed' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-blue-200/50">
                    Paste this code into your website to embed the flipbook
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-blue-500/20 bg-white/5">
            <p className="text-xs text-blue-200/50 text-center">
              Your flipbook is publicly accessible via this link
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
